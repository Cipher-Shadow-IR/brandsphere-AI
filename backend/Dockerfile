# ==============================================================================
# BrandSphere AI — Backend Production Container
# Multi-stage optimized Python 3.12 runtime with non-root security compliance
# ==============================================================================

FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

WORKDIR /app

# Install curl for container healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy source code
COPY . /app/

# Create non-root system user for enterprise security
RUN useradd -m -u 10001 -s /bin/sh appuser && \
    mkdir -p /app/qdrant_storage && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Health check verifies API endpoint operational status
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
