"""Response models for the HTTP API."""

from typing import Any

from pydantic import BaseModel


class RunLinks(BaseModel):
    """Read endpoints for one completed analysis run."""

    self: str
    clauses: str
    report: str


class ContractAnalysisResponse(BaseModel):
    """Completed contract-analysis run and its generated artifact names."""

    run_id: str
    status: str
    uploaded_file: str
    artifacts: list[str]
    links: RunLinks


class AnalysisSummary(BaseModel):
    """Risk and issue counts calculated from existing pipeline output."""

    total_clauses: int
    high_risk: int
    medium_risk: int
    low_risk: int
    total_issues: int


class ArtifactMetadata(BaseModel):
    """One allow-listed generated artifact."""

    type: str
    filename: str
    download_url: str


class RunDetailResponse(BaseModel):
    """Frontend-ready summary of an existing completed analysis run."""

    run_id: str
    status: str
    uploaded_file: str
    summary: AnalysisSummary
    artifacts: list[ArtifactMetadata]
    links: RunLinks


class ClausePageResponse(BaseModel):
    """A page of original clause/risk objects from milestone-2 output."""

    run_id: str
    offset: int
    limit: int
    total: int
    items: list[dict[str, Any]]


class ReportResponse(BaseModel):
    """The original milestone-3 report payload for one completed run."""

    run_id: str
    report: dict[str, Any]
