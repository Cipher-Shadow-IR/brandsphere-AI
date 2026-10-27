import os
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

COLLECTION_NAME = "brand_knowledge"
EMBEDDING_DIM = 384  

class QdrantRAGEngine:
    def __init__(self):
        self.client = None
        self.embedding_model = None
        self.collection_name = COLLECTION_NAME
        self.is_active = False

        self._init_qdrant()
        self._init_fastembed()

    def _init_qdrant(self):
        
        try:
            from qdrant_client import QdrantClient
            from qdrant_client.models import Distance, VectorParams

            qdrant_url = os.getenv("QDRANT_URL")
            qdrant_api_key = os.getenv("QDRANT_API_KEY")

            if qdrant_url:
                self.client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
                logger.info(f"Connected to Qdrant Cloud at {qdrant_url}")
            else:
                storage_path = os.getenv("QDRANT_STORAGE_PATH", "./qdrant_storage")
                try:
                    self.client = QdrantClient(path=storage_path)
                    logger.info(f"Initialized embedded local Qdrant at {storage_path}")
                except Exception as e:
                    logger.warning(f"Could not open local Qdrant path ({e}). Falling back to Qdrant :memory:")
                    self.client = QdrantClient(":memory:")

            
            if not self.client.collection_exists(self.collection_name):
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE)
                )
            self.is_active = True
        except Exception as e:
            logger.warning(f"Failed to initialize Qdrant client ({e}). RAG will run in fallback mode.")
            self.client = None
            self.is_active = False

    def _init_fastembed(self):
        
        try:
            from fastembed import TextEmbedding
            self.embedding_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
            logger.info("FastEmbed (bge-small-en-v1.5) initialized successfully.")
        except Exception as e:
            logger.warning(f"Failed to initialize FastEmbed ({e}). Semantic vector search disabled.")
            self.embedding_model = None

    def embed_texts(self, texts: List[str]) -> Optional[List[List[float]]]:
        if not self.embedding_model or not texts:
            return None
        try:
            embeddings = list(self.embedding_model.embed(texts))
            return [e.tolist() for e in embeddings]
        except Exception as e:
            logger.warning(f"FastEmbed embedding generation error ({e})")
            return None

    def index_knowledge_items(self, items: List[Dict[str, Any]]):
        
        if not self.is_active or not self.client or not self.embedding_model or not items:
            return

        try:
            from qdrant_client.models import PointStruct

            texts = [item["text"] for item in items]
            vectors = self.embed_texts(texts)
            if not vectors:
                return

            points = []
            for i, item in enumerate(items):
                point_id = hash(item.get("id", str(i))) & 0x7FFFFFFF  
                points.append(
                    PointStruct(
                        id=point_id,
                        vector=vectors[i],
                        payload={
                            "item_id": item.get("id"),
                            "text": item.get("text"),
                            "title": item.get("title", ""),
                            "type": item.get("type", "knowledge"),
                            "category": item.get("category", "general"),
                            "reference": item.get("reference", "")
                        }
                    )
                )

            self.client.upsert(collection_name=self.collection_name, points=points)
            logger.info(f"Indexed {len(points)} knowledge items into Qdrant vector database.")
        except Exception as e:
            logger.warning(f"Failed to upsert items to Qdrant ({e})")

    def query_semantic_knowledge(self, query_text: str, top_k: int = 4) -> List[Dict[str, Any]]:
        
        if not self.is_active or not self.client or not self.embedding_model:
            return []

        try:
            query_vectors = self.embed_texts([query_text])
            if not query_vectors:
                return []

            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vectors[0],
                limit=top_k
            )

            matches = []
            for hit in results:
                matches.append({
                    "score": round(float(hit.score), 4),
                    "payload": hit.payload
                })
            return matches
        except Exception as e:
            logger.warning(f"Qdrant vector search failed ({e})")
            return []



rag_engine = QdrantRAGEngine()