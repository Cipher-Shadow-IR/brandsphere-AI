from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

app = FastAPI(
    title="BrandSphere AI API",
    description="Intelligent Pre-Publication Brand Governance Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

documents = []
reviews = []

class ContentUpload(BaseModel):
    title: str
    content: str
    content_type: str = "text"
    author: str

class ReviewRequest(BaseModel):
    document_id: str
    reviewer_id: str
    status: str
    comments: Optional[str] = None

@app.get("/")
async def root():
    return {
        "message": "BrandSphere AI API",
        "version": "1.0.0",
        "status": "operational"
    }

def analyze_content(content: str):
    issues = []
    content_lower = content.lower()
    
    if any(word in content_lower for word in ["fastest", "#1", "industry-first", "best-in-class"]):
        issues.append({
            "id": str(uuid.uuid4()),
            "type": "claim",
            "severity": "Critical",
            "description": "Promotional superlative detected without verifiable citation",
            "guideline_reference": "Brand Claims Policy §3.2",
            "suggestion": "Replace with verifiable data or remove the claim. Example: 'Among top solutions in category X according to [Source Name]'.",
            "citation": "Approved Claims Guidelines - Section 3.2: All comparative/superlative claims must cite verified data from approved fact sheets.",
            "location": "Text content"
        })
    
    if "legacy" in content_lower or "old version" in content_lower:
        issues.append({
            "id": str(uuid.uuid4()),
            "type": "terminology",
            "severity": "Moderate",
            "description": "Potentially outdated terminology detected",
            "guideline_reference": "Brand Terminology Guide v2.1",
            "suggestion": "Use current product terminology from the approved glossary.",
            "citation": "Terminology Guidelines: Refer to approved product names in the Brand Glossary v2.1",
            "location": "Text content"
        })
    
    if any(word in content_lower for word in ["awesome", "amazing", "totally"]):
        issues.append({
            "id": str(uuid.uuid4()),
            "type": "tone",
            "severity": "Advisory",
            "description": "Informal tone may not be appropriate for enterprise communications",
            "guideline_reference": "Brand Voice Guide §1.3",
            "suggestion": "Consider more professional phrasing that aligns with enterprise brand voice.",
            "citation": "Brand Voice Guidelines: Enterprise communications should maintain a confident, professional tone.",
            "location": "Text content"
        })
    
    if len(content) > 100:
        issues.append({
            "id": str(uuid.uuid4()),
            "type": "accessibility",
            "severity": "Advisory",
            "description": "Consider adding alt-text context for better accessibility",
            "guideline_reference": "Accessibility Standards WCAG 2.1",
            "suggestion": "Ensure all visual elements include descriptive alternative text.",
            "citation": "WCAG 2.1 Guidelines: Provide text alternatives for non-text content.",
            "location": "Document structure"
        })
    
    return issues

@app.post("/api/documents/upload")
async def upload_document(doc: ContentUpload):
    doc_id = str(uuid.uuid4())
    issues = analyze_content(doc.content)
    document = {
        "id": doc_id,
        "title": doc.title,
        "content": doc.content,
        "content_type": doc.content_type,
        "author": doc.author,
        "status": "pending_review",
        "created_at": datetime.now().isoformat(),
        "issues": issues
    }
    documents.append(document)
    return {"document": document, "issues_count": len(issues)}

@app.get("/api/documents")
async def get_documents():
    return {"documents": documents}

@app.get("/api/documents/{doc_id}")
async def get_document(doc_id: str):
    for doc in documents:
        if doc["id"] == doc_id:
            return {"document": doc}
    return {"error": "Document not found"}, 404

@app.post("/api/reviews/submit")
async def submit_review(review: ReviewRequest):
    review_id = str(uuid.uuid4())
    review_entry = {
        "id": review_id,
        "document_id": review.document_id,
        "reviewer_id": review.reviewer_id,
        "status": review.status,
        "comments": review.comments,
        "created_at": datetime.now().isoformat()
    }
    reviews.append(review_entry)
    
    for doc in documents:
        if doc["id"] == review.document_id:
            if review.status == "approved":
                doc["status"] = "approved"
            elif review.status == "rejected":
                doc["status"] = "rejected"
            else:
                doc["status"] = "needs_revision"
    
    return {"review": review_entry}

@app.get("/api/reviews")
async def get_reviews():
    return {"reviews": reviews}

@app.get("/api/analytics")
async def get_analytics():
    total_docs = len(documents)
    total_issues = sum(len(d["issues"]) for d in documents)
    issue_types = {}
    for doc in documents:
        for issue in doc["issues"]:
            issue_types[issue["type"]] = issue_types.get(issue["type"], 0) + 1
    
    return {
        "overview": {
            "total_documents": total_docs,
            "approved": len([d for d in documents if d["status"] == "approved"]),
            "pending_review": len([d for d in documents if d["status"] == "pending_review"]),
            "rejected": len([d for d in documents if d["status"] == "rejected"]),
            "total_issues_flagged": total_issues,
            "avg_issues_per_doc": round(total_issues / total_docs if total_docs > 0 else 0, 2)
        },
        "issue_distribution": issue_types,
        "guideline_clarity_insights": [
            {"guideline": "Brand Claims Policy §3.2", "frequency": issue_types.get("claim", 0), "recommendation": "Add more examples of compliant claim phrasing"},
            {"guideline": "Brand Voice Guide §1.3", "frequency": issue_types.get("tone", 0), "recommendation": "Provide industry-specific tone examples"},
            {"guideline": "Brand Terminology Guide v2.1", "frequency": issue_types.get("terminology", 0), "recommendation": "Create searchable glossary with deprecation notices"}
        ]
    }

@app.get("/api/guidelines")
async def get_guidelines():
    default_guidelines = [
        {"id": "1", "name": "Brand Claims Policy", "version": "v1.2", "category": "claims"},
        {"id": "2", "name": "Brand Voice Guide", "version": "v2.0", "category": "tone"},
        {"id": "3", "name": "Visual Identity Guidelines", "version": "v1.5", "category": "visual"},
        {"id": "4", "name": "Accessibility Standards", "version": "WCAG 2.1", "category": "accessibility"},
        {"id": "5", "name": "Brand Terminology Guide", "version": "v2.1", "category": "terminology"}
    ]
    return {"guidelines": default_guidelines}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
