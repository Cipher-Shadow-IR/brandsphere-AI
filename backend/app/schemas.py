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
    image_url: Optional[str] = Field(default=None, description="Optional image data or URL for multimodal visual review")


class ReviewRequest(BaseModel):
    document_id: str = Field(..., min_length=1, description="UUID of the document being reviewed")
    reviewer_id: str = Field(..., min_length=1, max_length=255, description="Identifier of the reviewer")
    status: ReviewStatus = Field(..., description="Decision: approved, rejected, or needs_revision")
    comments: Optional[str] = Field(default=None, description="Optional review feedback comments")
    role: Optional[str] = Field(default="Reviewer", description="Reviewer role: Creator, Reviewer, Legal Admin")


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
    resolved: Optional[bool] = False
    original_text: Optional[str] = None


class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    document_id: str
    reviewer_id: str
    status: str
    comments: Optional[str] = None
    role: Optional[str] = "Reviewer"
    created_at: str


class RevisionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    document_id: str
    version: int
    content: str
    change_summary: str
    edited_by: str
    created_at: str


class CommentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    document_id: str
    author: str
    role: str
    text: str
    created_at: str


class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    document_id: str
    actor: str
    role: str
    action: str
    details: Optional[str] = None
    created_at: str


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    content: str
    content_type: str
    author: str
    status: str
    created_at: str
    version: Optional[int] = 1
    readability_score: Optional[float] = 70.0
    wcag_score: Optional[float] = 100.0
    image_url: Optional[str] = None
    dominant_colors: Optional[str] = None
    issues: List[IssueResponse] = []
    reviews: Optional[List[ReviewResponse]] = []
    revisions: Optional[List[RevisionResponse]] = []
    comments: Optional[List[CommentResponse]] = []


class DocumentUploadResult(BaseModel):
    document: DocumentResponse
    issues_count: int
    metadata: Optional[Dict[str, Any]] = None


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
    compliance_rate_percent: Optional[float] = 0.0
    severity_breakdown: Optional[Dict[str, int]] = {}


class GuidelineItem(BaseModel):
    id: str
    name: str
    version: str
    category: str
    description: Optional[str] = None
    rule_pattern: Optional[str] = None
    rationale: Optional[str] = None
    remediation_template: Optional[str] = None
    is_active: Optional[bool] = True


class GuidelinesListResult(BaseModel):
    guidelines: List[GuidelineItem]


class GuidelineCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    category: str = Field(..., description="claims, tone, terminology, visual, accessibility")
    version: str = Field(default="v1.0")
    description: str = Field(..., min_length=5)
    rule_pattern: Optional[str] = None
    rationale: Optional[str] = None
    remediation_template: Optional[str] = None


class ApprovedFactItem(BaseModel):
    id: str
    topic: str
    claim_statement: str
    approved_metric: str
    source_citation: str
    status: str
    created_at: str


class ApprovedFactCreate(BaseModel):
    topic: str = Field(..., min_length=2)
    claim_statement: str = Field(..., min_length=5)
    approved_metric: str = Field(..., min_length=1)
    source_citation: str = Field(..., min_length=3)


class GlossaryItem(BaseModel):
    id: str
    term: str
    replacement: str
    category: str
    note: Optional[str] = None
    created_at: str


class GlossaryCreate(BaseModel):
    term: str = Field(..., min_length=1)
    replacement: str = Field(..., min_length=1)
    category: str = Field(default="deprecated")
    note: Optional[str] = None


class BrandAssetItem(BaseModel):
    id: str
    asset_name: str
    asset_type: str
    value: str
    description: Optional[str] = None
    created_at: str


class BrandAssetCreate(BaseModel):
    asset_name: str = Field(..., min_length=1)
    asset_type: str = Field(..., description="color, logo, font, spacing")
    value: str = Field(..., min_length=1)
    description: Optional[str] = None


class RemediationRequest(BaseModel):
    issue_id: str
    author_name: Optional[str] = "Editor"
    custom_replacement: Optional[str] = None


class RevisionCreateRequest(BaseModel):
    content: str
    change_summary: str
    edited_by: str = "Editor"


class CommentCreateRequest(BaseModel):
    author: str = "Reviewer"
    role: str = "Reviewer"
    text: str = Field(..., min_length=1)


class VisualAnalyzeRequest(BaseModel):
    image_base64: Optional[str] = None
    image_url: Optional[str] = None


class VisualAnalyzeResponse(BaseModel):
    dominant_colors: List[str]
    palette_match_score: float
    contrast_ratio: float
    contrast_compliant_aa: bool
    issues: List[Dict[str, Any]]
    recommendations: List[str]


class CertificateResponse(BaseModel):
    document_id: str
    title: str
    author: str
    approved_at: str
    reviewer_id: str
    compliance_score: float
    wcag_score: float
    readability_score: float
    resolved_issues_count: int
    verification_hash: str
    status: str
    qr_data: str