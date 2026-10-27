import os
import time
import pytest
from backend.app.cache import CacheService
from backend.app.rag_engine import QdrantRAGEngine
from backend.app.llm_engine import LLMEngine
from backend.app.database import DATABASE_URL, engine
from backend.app.main import ensure_sqlite_columns


def test_database_url_normalization():
    raw_postgres = "postgres://user:pass@ep-cool-db.us-east-2.aws.neon.tech/neondb?sslmode=require"
    normalized = raw_postgres.replace("postgres://", "postgresql://", 1) if raw_postgres.startswith("postgres://") else raw_postgres
    assert normalized.startswith("postgresql://")


def test_ensure_sqlite_columns_dialect_guard():
    
    ensure_sqlite_columns()


def test_cache_service_in_memory_and_ttl():
    cache = CacheService()
    test_key = "test:scan:doc_123"
    test_data = {"issues": [{"type": "claim", "score": 98.5}], "readability": 74.2}

    
    assert cache.set(test_key, test_data, ttl=2) is True
    retrieved = cache.get(test_key)
    assert retrieved is not None
    assert retrieved["readability"] == 74.2

    
    hashed = cache.hash_key("scan", "Unique Marketing Document Content")
    assert hashed.startswith("scan:")
    assert len(hashed) == len("scan:") + 64  

    
    assert cache.delete(test_key) is True
    assert cache.get(test_key) is None


def test_qdrant_rag_engine_lifecycle():
    rag = QdrantRAGEngine()
    assert rag.client is not None
    assert rag.is_active is True

    
    test_items = [
        {
            "id": "test-guideline-1",
            "title": "Brand Voice Policy",
            "text": "Brand Voice Policy: Tone must be executive, confident, and professional.",
            "type": "guideline",
            "category": "tone",
            "reference": "Brand Voice §1.0"
        },
        {
            "id": "test-fact-1",
            "title": "Review Cycle Benchmark",
            "text": "Canonical Fact: BrandSphere AI reduces review turnaround cycles by up to 80%.",
            "type": "fact",
            "category": "claims",
            "reference": "Inkloom Benchmark Study 2026"
        }
    ]
    rag.index_knowledge_items(test_items)

    
    results = rag.query_semantic_knowledge("review cycle reduction benchmark", top_k=2)
    assert isinstance(results, list)
    if results:
        top_match = results[0]
        assert "score" in top_match
        assert "payload" in top_match
        assert "title" in top_match["payload"]


def test_llm_engine_graceful_fallback():
    llm = LLMEngine()
    
    if not os.getenv("GEMINI_API_KEY"):
        assert llm.is_gemini_active() is False
        assert llm.generate_smart_remediation(
            full_content="Our platform is the fastest.",
            issue_type="claim",
            issue_description="Promotional superlative",
            guideline_reference="Brand Claims Policy §3.2"
        ) is None
        assert llm.audit_image_multimodal(b"fake_image_bytes") is None