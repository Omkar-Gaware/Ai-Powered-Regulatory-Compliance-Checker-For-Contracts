"""Adapter that invokes the existing compliance pipeline without changing it."""

import os
import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from run import OUTPUT_DIR, run_pipeline


RAW_DIR = Path(os.getenv("RAW_DIR", "./raw"))


def analyze_contract(upload: UploadFile) -> tuple[str, str, list[str]]:
    """Persist a PDF upload and run the existing synchronous pipeline."""
    original_name = Path(upload.filename or "contract.pdf").name
    if Path(original_name).suffix.lower() != ".pdf":
        raise HTTPException(status_code=400, detail="Only PDF uploads are supported.")

    run_id = uuid4().hex
    upload_name = f"{Path(original_name).stem}_{run_id}.pdf"
    upload_path = RAW_DIR / upload_name
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    with upload_path.open("wb") as destination:
        shutil.copyfileobj(upload.file, destination)

    try:
        run_pipeline(str(upload_path))
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Contract analysis failed. Check the server logs for details.",
        ) from exc
    finally:
        upload.file.close()

    base_name = Path(upload_name).stem
    artifacts = [
        f"{base_name}_m2_output.json",
        f"{base_name}_m2_annotations.csv",
        f"{base_name}_m3_compliance_report.json",
        f"{base_name}_updated_contract.txt",
        f"{base_name}_updated_contract.pdf",
    ]

    return run_id, upload_name, artifacts
