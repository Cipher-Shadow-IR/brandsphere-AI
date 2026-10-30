"""
Tests for Visual Diff Studio, Contrast Heatmap and Automated Inpainting Engine.
"""

import io
import base64
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def create_sample_image_base64():
    img = Image.new("RGB", (200, 150), color=(200, 200, 200))
    draw = ImageDraw.Draw(img)
    draw.text((20, 20), "Test Collateral Banner", fill=(180, 180, 180))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")


def test_auto_fix_visual_contrast_endpoint():
    b64_img = create_sample_image_base64()
    response = client.post(
        "/api/visual/auto-fix-contrast",
        json={"image_base64": b64_img}
    )
    assert response.status_code == 200
    data = response.json()
    assert "original_contrast_ratio" in data
    assert "corrected_contrast_ratio" in data
    assert data["corrected_contrast_ratio"] >= 4.5
    assert data["wcag_compliant"] is True
    assert "heatmap_data_url" in data
    assert "corrected_data_url" in data
    assert data["heatmap_data_url"].startswith("data:image/png;base64,")
    assert data["corrected_data_url"].startswith("data:image/jpeg;base64,")
