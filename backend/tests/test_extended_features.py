import uuid
import pytest
from fastapi import status


def test_guideline_crud_and_seeding(client):
    
    res = client.get("/api/guidelines")
    assert res.status_code == status.HTTP_200_OK
    guidelines = res.json()["guidelines"]
    assert len(guidelines) >= 5

    
    new_guideline = {
        "name": "Social Media Hashtag Policy",
        "category": "claims",
        "version": "v1.0",
        "description": "All brand posts must include official #BrandSphere tag.",
        "rule_pattern": "#BrandSphere",
        "rationale": "Amplifies brand reach and consistency across social channels.",
        "remediation_template": "Append #BrandSphere to social captions."
    }
    create_res = client.post("/api/guidelines", json=new_guideline)
    assert create_res.status_code == status.HTTP_200_OK
    created_id = create_res.json()["guideline"]["id"]

    
    res2 = client.get("/api/guidelines")
    ids = [g["id"] for g in res2.json()["guidelines"]]
    assert created_id in ids

    
    del_res = client.delete(f"/api/guidelines/{created_id}")
    assert del_res.status_code == status.HTTP_200_OK
    assert del_res.json()["success"] is True


def test_approved_facts_library(client):
    res = client.get("/api/facts")
    assert res.status_code == status.HTTP_200_OK
    facts = res.json()["facts"]
    assert len(facts) >= 1

    
    new_fact = {
        "topic": "SOC2 Certification",
        "claim_statement": "BrandSphere maintains Type II SOC2 Compliance certification.",
        "approved_metric": "Type II SOC2 Certified",
        "source_citation": "Security Audit Report 2026-Q1"
    }
    post_res = client.post("/api/facts", json=new_fact)
    assert post_res.status_code == status.HTTP_200_OK
    fact_id = post_res.json()["fact"]["id"]

    
    del_res = client.delete(f"/api/facts/{fact_id}")
    assert del_res.status_code == status.HTTP_200_OK


def test_glossary_terms_and_enforcement(client):
    
    res = client.get("/api/glossary")
    assert res.status_code == status.HTTP_200_OK
    terms = res.json()["glossary"]
    assert len(terms) >= 1

    
    new_term = {
        "term": "buggy code",
        "replacement": "unstable release",
        "category": "prohibited",
        "note": "Maintain professional engineering phrasing."
    }
    add_res = client.post("/api/glossary", json=new_term)
    assert add_res.status_code == status.HTTP_200_OK

    
    doc_res = client.post("/api/documents/upload", json={
        "title": "Release Notes",
        "content": "This draft contains buggy code that needs fixing.",
        "author": "Dev Team"
    })
    doc_data = doc_res.json()["document"]
    issue_types = [i["type"] for i in doc_data["issues"]]
    assert "terminology" in issue_types


def test_remediation_and_revision_flow(client):
    
    doc_res = client.post("/api/documents/upload", json={
        "title": "Marketing Pitch",
        "content": "We built the fastest platform on earth.",
        "author": "Growth Team"
    })
    doc = doc_res.json()["document"]
    doc_id = doc["id"]
    issues = doc["issues"]
    claim_issue = next(i for i in issues if i["type"] == "claim")

    
    rem_res = client.post(f"/api/documents/{doc_id}/apply-remediation", json={
        "issue_id": claim_issue["id"],
        "author_name": "Senior Editor",
        "custom_replacement": "industry-leading verified"
    })
    assert rem_res.status_code == status.HTTP_200_OK
    rem_data = rem_res.json()
    assert rem_data["success"] is True
    assert rem_data["new_version"] == 2

    
    rev_res = client.get(f"/api/documents/{doc_id}/revisions")
    assert rev_res.status_code == status.HTTP_200_OK
    assert len(rev_res.json()["revisions"]) >= 2

    
    audit_res = client.get(f"/api/documents/{doc_id}/audit-trail")
    assert audit_res.status_code == status.HTTP_200_OK
    actions = [a["action"] for a in audit_res.json()["audit_trail"]]
    assert "ISSUE_REMEDIATED" in actions


def test_collaborative_threaded_comments(client):
    doc_res = client.post("/api/documents/upload", json={
        "title": "Collab Test",
        "content": "Initial content for collaboration.",
        "author": "Alice"
    })
    doc_id = doc_res.json()["document"]["id"]

    
    com_res = client.post(f"/api/documents/{doc_id}/comments", json={
        "author": "Bob (Reviewer)",
        "role": "Reviewer",
        "text": "Please cite the benchmark source before approval."
    })
    assert com_res.status_code == status.HTTP_200_OK

    
    list_res = client.get(f"/api/documents/{doc_id}/comments")
    assert list_res.status_code == status.HTTP_200_OK
    comments = list_res.json()["comments"]
    assert len(comments) == 1
    assert "benchmark source" in comments[0]["text"]


def test_certified_publication_export(client):
    doc_res = client.post("/api/documents/upload", json={
        "title": "Cert Test",
        "content": "Standard professional company statement.",
        "author": "Comms Lead"
    })
    doc_id = doc_res.json()["document"]["id"]

    
    client.post("/api/reviews/submit", json={
        "document_id": doc_id,
        "reviewer_id": "chief-officer",
        "status": "approved",
        "comments": "Signed off."
    })

    
    cert_res = client.get(f"/api/documents/{doc_id}/certificate")
    assert cert_res.status_code == status.HTTP_200_OK
    cert = cert_res.json()
    assert cert["document_id"] == doc_id
    assert cert["status"] == "approved"
    assert "BS-SHA256-" in cert["verification_hash"]
    assert cert["compliance_score"] >= 80.0


def test_delete_document_and_cascading_cleanup(client):
    upload_res = client.post("/api/documents/upload", json={
        "title": "Document To Delete",
        "content": "This content has issues like legacy systems and awesome speed.",
        "author": "Delete Tester"
    })
    doc_id = upload_res.json()["document"]["id"]

    
    client.post(f"/api/documents/{doc_id}/comments", json={
        "author": "Tester",
        "role": "Reviewer",
        "text": "Comment on doc to be deleted"
    })
    client.post("/api/reviews/submit", json={
        "document_id": doc_id,
        "reviewer_id": "rev-del",
        "status": "needs_revision"
    })

    
    del_res = client.delete(f"/api/documents/{doc_id}")
    assert del_res.status_code == status.HTTP_200_OK
    assert del_res.json()["deleted_id"] == doc_id

    
    get_res = client.get(f"/api/documents/{doc_id}")
    assert get_res.status_code == status.HTTP_404_NOT_FOUND


def test_seed_demo_documents_endpoint(client):
    seed_res = client.post("/api/demo/seed")
    assert seed_res.status_code == status.HTTP_200_OK
    data = seed_res.json()
    assert data["success"] is True
    assert data["seeded_count"] == 3
    assert len(data["documents"]) == 3

    
    list_res = client.get("/api/documents")
    assert list_res.status_code == status.HTTP_200_OK
    titles = [d["title"] for d in list_res.json()["documents"]]
    assert "Q4 Enterprise Cloud Launch Announcement" in titles
    assert "Product Performance Benchmark Summary" in titles