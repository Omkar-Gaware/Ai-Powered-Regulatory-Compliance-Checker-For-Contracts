"""Minimal FastAPI application kept independent from the Streamlit workflow."""

from fastapi import FastAPI, File, Query, UploadFile
from fastapi.responses import FileResponse

from api.schemas import (
    ClausePageResponse,
    ContractAnalysisResponse,
    ReportResponse,
    RunDetailResponse,
)
from api.services.pipeline_service import analyze_contract
from api.services.result_service import (
    artifact_media_type,
    get_artifact_metadata,
    get_artifact_path,
    get_clauses,
    get_report,
    get_summary,
    get_uploaded_filename,
    run_links,
)


app = FastAPI(title="AI Contract Compliance Checker API")


@app.get("/health")
def health() -> dict[str, str]:
    """Return service availability without invoking the compliance pipeline."""
    return {"status": "ok"}


@app.post("/api/v1/contracts/analyze", response_model=ContractAnalysisResponse)
def analyze_contract_upload(file: UploadFile = File(...)) -> ContractAnalysisResponse:
    """Run the existing compliance pipeline for one uploaded PDF contract."""
    run_id, uploaded_file, artifacts = analyze_contract(file)
    return ContractAnalysisResponse(
        run_id=run_id,
        status="completed",
        uploaded_file=uploaded_file,
        artifacts=artifacts,
        links=run_links(run_id),
    )


@app.get("/api/v1/runs/{run_id}", response_model=RunDetailResponse)
def get_run(run_id: str) -> RunDetailResponse:
    """Return a compact summary of an existing completed pipeline run."""
    return RunDetailResponse(
        run_id=run_id,
        status="completed",
        uploaded_file=get_uploaded_filename(run_id),
        summary=get_summary(run_id),
        artifacts=get_artifact_metadata(run_id),
        links=run_links(run_id),
    )


@app.get("/api/v1/runs/{run_id}/clauses", response_model=ClausePageResponse)
def get_run_clauses(
    run_id: str,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
) -> ClausePageResponse:
    """Return a page of unchanged milestone-2 clause/risk objects."""
    clauses = get_clauses(run_id)
    return ClausePageResponse(
        run_id=run_id,
        offset=offset,
        limit=limit,
        total=len(clauses),
        items=clauses[offset : offset + limit],
    )


@app.get("/api/v1/runs/{run_id}/report", response_model=ReportResponse)
def get_run_report(run_id: str) -> ReportResponse:
    """Return the unchanged milestone-3 compliance report."""
    return ReportResponse(run_id=run_id, report=get_report(run_id))


@app.get("/api/v1/runs/{run_id}/artifacts/{artifact_type}")
def download_artifact(run_id: str, artifact_type: str) -> FileResponse:
    """Download one existing allow-listed generated artifact."""
    path = get_artifact_path(run_id, artifact_type)
    return FileResponse(
        path=path,
        media_type=artifact_media_type(artifact_type),
        filename=path.name,
    )
