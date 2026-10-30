"""
Tests for Headless CMS Webhooks and Automated CI/CD Governance Gates.
"""

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_webhook_scan_compliant_content():
    """
    Submitting compliant copy should yield APPROVED_FOR_PUBLICATION gate decision.
    """
    payload = {
        "source": "hubspot",
        "event": "content.publish_attempt",
        "content_id": "blog-post-9821",
        "title": "Quarterly Operational Review",
        "body": "BrandSphere AI delivers up to an 80% reduction in content review turnaround cycles according to the Inkloom Enterprise Study 2026. All published collateral retains a cryptographically verifiable audit trail compliant with SOC 2 requirements.",
        "author": "HubSpot CMS Sync",
        "strict_mode": True
    }
    response = client.post("/api/webhooks/scan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["compliant"] is True
    assert data["gate_decision"] == "APPROVED_FOR_PUBLICATION"
    assert data["critical_count"] == 0
    assert data["source"] == "hubspot"
    assert data["content_id"] == "blog-post-9821"
    assert data["document_id"] is not None


def test_webhook_scan_blocking_critical_claims():
    """
    Submitting unsubstantiated promotional superlatives should yield BLOCKED gate decision.
    """
    payload = {
        "source": "wordpress",
        "event": "post.publish",
        "content_id": "wp-1004",
        "title": "Hyper Cloud Launch Press Release",
        "body": "BrandSphere is officially the fastest cloud platform in the world! Our totally amazing new release is #1 rated across all benchmarks with guaranteed 100% zero downtime.",
        "author": "PR Wire WordPress",
        "strict_mode": True
    }
    response = client.post("/api/webhooks/scan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["compliant"] is False
    assert data["gate_decision"] == "BLOCKED"
    assert data["critical_count"] > 0
    assert "Publication blocked" in data["message"]
    assert len(data["issues"]) > 0


def test_webhook_scan_github_pr_source():
    """
    Submitting a simulated GitHub PR review payload.
    """
    payload = {
        "source": "github_pr",
        "event": "pull_request.opened",
        "content_id": "pr-42",
        "title": "docs/announcement.md",
        "body": "Unbeatable price with an awesome revolution in business computing that your team will totally love.",
        "author": "github-actions[bot]",
        "strict_mode": True
    }
    response = client.post("/api/webhooks/scan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "github_pr"
    assert data["gate_decision"] == "BLOCKED"
    assert any(i["severity"] == "Critical" for i in data["issues"])
