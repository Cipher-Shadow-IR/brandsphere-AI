import os
import json
import time
import hashlib
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)

class CacheService:
    def __init__(self):
        self.redis_client = None
        self._memory_cache = {}  
        self.redis_url = os.getenv("REDIS_URL")

        if self.redis_url:
            try:
                import redis
                
                client = redis.from_url(
                    self.redis_url,
                    decode_responses=True,
                    socket_connect_timeout=2.0,
                    socket_timeout=2.0
                )
                client.ping()
                self.redis_client = client
                logger.info(f"Connected to Redis cache at {self.redis_url.split('@')[-1] if '@' in self.redis_url else 'specified host'}")
            except Exception as e:
                logger.warning(f"Failed to connect to Redis ({e}). Gracefully falling back to in-memory TTL cache.")
                self.redis_client = None
        else:
            logger.info("REDIS_URL not configured. Operating with in-memory TTL dictionary cache.")

    def is_redis_active(self) -> bool:
        return self.redis_client is not None

    def _cleanup_memory(self):
        
        now = time.time()
        expired_keys = [k for k, (_, exp) in self._memory_cache.items() if exp and exp < now]
        for k in expired_keys:
            self._memory_cache.pop(k, None)

    def get(self, key: str) -> Optional[Any]:
        if self.redis_client:
            try:
                data = self.redis_client.get(key)
                if data is not None:
                    try:
                        return json.loads(data)
                    except (json.JSONDecodeError, TypeError):
                        return data
                return None
            except Exception as e:
                logger.warning(f"Redis get error ({e}), falling back to memory cache.")

        
        self._cleanup_memory()
        if key in self._memory_cache:
            val, exp = self._memory_cache[key]
            if exp is None or exp >= time.time():
                return val
            else:
                self._memory_cache.pop(key, None)
        return None

    def set(self, key: str, value: Any, ttl: int = 3600) -> bool:
        serialized = json.dumps(value) if not isinstance(value, (str, int, float, bool)) else json.dumps(value)

        if self.redis_client:
            try:
                self.redis_client.setex(key, ttl, serialized)
                return True
            except Exception as e:
                logger.warning(f"Redis set error ({e}), falling back to memory cache.")

        
        expiry = time.time() + ttl if ttl else None
        self._memory_cache[key] = (value, expiry)
        return True

    def delete(self, key: str) -> bool:
        deleted = False
        if self.redis_client:
            try:
                self.redis_client.delete(key)
                deleted = True
            except Exception as e:
                logger.warning(f"Redis delete error ({e})")
        if key in self._memory_cache:
            self._memory_cache.pop(key, None)
            deleted = True
        return deleted

    def clear(self):
        if self.redis_client:
            try:
                self.redis_client.flushdb()
            except Exception:
                pass
        self._memory_cache.clear()

    @staticmethod
    def hash_key(prefix: str, content: str) -> str:
        digest = hashlib.sha256(content.encode("utf-8")).hexdigest()
        return f"{prefix}:{digest}"



cache_service = CacheService()