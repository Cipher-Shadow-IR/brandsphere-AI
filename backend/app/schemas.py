from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class ReviewStatus(str, Enum):
    APPROVED = "approved"
    REJECTED = "rejected"
    NEEDS_REVISION = "needs_revision"


class ContentUpload(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Title of the content")
    content: str = Field(..., min_length=1, description="Body text content to scan")
    content_type: str = Field(default="text", max_length=50, description="Format type: text, document, social")
    author: str = Field(..., min_length=1, max_length=255, description="Author or team name")


class ReviewRequest(BaseModel):
    document_id: str = Field(..., min_length=1, description="UUID of the document being reviewed")
    reviewer_id: str = Field(..., min_length=1, max_length=255, description="Identifier of the reviewer")
    status: ReviewStatus = Field(..., description="Decision: approved, rejected, or needs_revision")
    comments: Optional[str] = Field(default=None, description="Optional review feedback comments")


class IssueResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    type: str
    severity: str
    description: str
    guideline_reference: str
    suggestion: str
    citation: str
    location: str


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    content: str
    content_type: str
    author: str
    status: str
    created_at: str
    issues: List[IssueResponse] = []


class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    document_id: str
    reviewer_id: str
    status: str
    comments: Optional[str] = None
    created_at: str


class DocumentUploadResult(BaseModel):
    document: DocumentResponse
    issues_count: int


class DocumentDetailResult(BaseModel):
    document: DocumentResponse


class DocumentsListResult(BaseModel):
    documents: List[DocumentResponse]


class ReviewSubmitResult(BaseModel):
    review: ReviewResponse


class ReviewsListResult(BaseModel):
    reviews: List[ReviewResponse]


class AnalyticsOverview(BaseModel):
    total_documents: int
    approved: int
    pending_review: int
    rejected: int
    total_issues_flagged: int
    avg_issues_per_doc: float


class GuidelineClarityInsight(BaseModel):
    guideline: str
    frequency: int
    recommendation: str


class AnalyticsResult(BaseModel):
    overview: AnalyticsOverview
    issue_distribution: Dict[str, int]
    guideline_clarity_insights: List[GuidelineClarityInsight]


class GuidelineItem(BaseModel):
    id: str
    name: str
    version: str
    category: str


class GuidelinesListResult(BaseModel):
    guidelines: List[GuidelineItem]
