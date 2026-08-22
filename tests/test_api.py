"""Mock-backed tests for the Stage 2 API boundary."""

import json
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest import TestCase
from unittest.mock import patch

from fastapi.testclient import TestClient

from api.main import app
from api.services import pipeline_service


class ApiTests(TestCase):
    """Exercise API behavior without running the real compliance pipeline."""

    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_health(self) -> None:
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_analyze_contract_invokes_existing_pipeline(self) -> None:
        received_paths: list[Path] = []
        with TemporaryDirectory() as temporary_directory:
            temporary_path = Path(temporary_directory)

            def write_pipeline_outputs(pdf_path: str) -> None:
                received_path = Path(pdf_path)
                received_paths.append(received_path)
                output_directory = temporary_path / "results"
                output_directory.mkdir()
                base_name = received_path.stem
                clauses = [
                    {
                        "clause_id": "1",
                        "clause_text": "Data protection clause",
                        "risk": {"severity": "high", "risk_score": 90},
                    },
                    {
                        "clause_id": "2",
                        "clause_text": "Payment clause",
                        "risk": {"severity": "medium", "risk_score": 50},
                    },
                    {
                        "clause_id": "3",
                        "clause_text": "Term clause",
                        "risk": {"severity": "low", "risk_score": 10},
                    },
                ]
                (output_directory / f"{base_name}_m2_output.json").write_text(
                    json.dumps(clauses), encoding="utf-8"
                )
                (output_directory / f"{base_name}_m2_annotations.csv").write_text(
                    "clause_id,severity\n1,high\n", encoding="utf-8"
                )
                report = {
                    "compliance_report": {
                        "total_clauses_analyzed": 3,
                        "total_issues_detected": 1,
                        "issues": [{"clause_id": "1", "severity": "high"}],
                    },
                    "amended_clauses": ["1"],
                }
                (output_directory / f"{base_name}_m3_compliance_report.json").write_text(
                    json.dumps(report), encoding="utf-8"
                )
                (output_directory / f"{base_name}_updated_contract.txt").write_text(
                    "Updated contract", encoding="utf-8"
                )
                (output_directory / f"{base_name}_updated_contract.pdf").write_bytes(
                    b"%PDF-1.4 test contract"
                )

            with (
                patch.object(pipeline_service, "RAW_DIR", temporary_path / "uploads"),
                patch.object(pipeline_service, "OUTPUT_DIR", str(temporary_path / "results")),
                patch("api.services.result_service.OUTPUT_DIR", str(temporary_path / "results")),
                patch.object(
                    pipeline_service,
                    "run_pipeline",
                    side_effect=write_pipeline_outputs,
                ),
            ):
                response = self.client.post(
                    "/api/v1/contracts/analyze",
                    files={
                        "file": (
                            "sample.pdf",
                            b"%PDF-1.4 test contract",
                            "application/pdf",
                        )
                    },
                )

                self.assertEqual(response.status_code, 200)
                body = response.json()
                self.assertTrue(body["uploaded_file"].endswith(".pdf"))
                self.assertEqual(len(body["run_id"]), 32)
                self.assertEqual(len(body["artifacts"]), 5)
                self.assertEqual(body["status"], "completed")
                self.assertEqual(received_paths[0].read_bytes(), b"%PDF-1.4 test contract")

                run_id = body["run_id"]
                summary_response = self.client.get(f"/api/v1/runs/{run_id}")
                self.assertEqual(summary_response.status_code, 200)
                summary = summary_response.json()["summary"]
                self.assertEqual(
                    summary,
                    {
                        "total_clauses": 3,
                        "high_risk": 1,
                        "medium_risk": 1,
                        "low_risk": 1,
                        "total_issues": 1,
                    },
                )

                clauses_response = self.client.get(
                    f"/api/v1/runs/{run_id}/clauses?offset=1&limit=1"
                )
                self.assertEqual(clauses_response.status_code, 200)
                clause_page = clauses_response.json()
                self.assertEqual(clause_page["total"], 3)
                self.assertEqual(clause_page["items"][0], {
                    "clause_id": "2",
                    "clause_text": "Payment clause",
                    "risk": {"severity": "medium", "risk_score": 50},
                })

                report_response = self.client.get(f"/api/v1/runs/{run_id}/report")
                self.assertEqual(report_response.status_code, 200)
                self.assertEqual(
                    report_response.json()["report"]["amended_clauses"], ["1"]
                )

                for artifact_type in (
                    "clauses_json",
                    "annotations_csv",
                    "compliance_report",
                    "updated_contract_txt",
                    "updated_contract_pdf",
                ):
                    artifact_response = self.client.get(
                        f"/api/v1/runs/{run_id}/artifacts/{artifact_type}"
                    )
                    self.assertEqual(artifact_response.status_code, 200)
                    self.assertIn(
                        "attachment; filename=",
                        artifact_response.headers["content-disposition"],
                    )

                invalid_type_response = self.client.get(
                    f"/api/v1/runs/{run_id}/artifacts/../../.env"
                )
                self.assertEqual(invalid_type_response.status_code, 404)

                invalid_artifact_response = self.client.get(
                    f"/api/v1/runs/{run_id}/artifacts/not_allowed"
                )
                self.assertEqual(invalid_artifact_response.status_code, 400)

                unknown_run_response = self.client.get(
                    "/api/v1/runs/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                )
                self.assertEqual(unknown_run_response.status_code, 404)

                malformed_run_response = self.client.get("/api/v1/runs/not-a-run")
                self.assertEqual(malformed_run_response.status_code, 404)

    def test_analyze_contract_rejects_non_pdf(self) -> None:
        response = self.client.post(
            "/api/v1/contracts/analyze",
            files={"file": ("sample.txt", b"not a PDF", "text/plain")},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(), {"detail": "Only PDF uploads are supported."}
        )
