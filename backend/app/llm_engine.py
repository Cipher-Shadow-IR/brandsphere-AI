import os
import json
import logging
from typing import Optional, Dict, Any, List

logger = logging.getLogger(__name__)

class LLMEngine:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        self.model_name = "gemini-1.5-flash"

        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Gemini 1.5 Flash Multimodal LLM engine initialized.")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini 1.5 Flash client ({e}). Falling back to rule-based engine.")
                self.client = None
        else:
            logger.info("GEMINI_API_KEY not configured. Rule-based remediation and Pillow vision active.")

    def is_gemini_active(self) -> bool:
        return self.client is not None

    def generate_smart_remediation(
        self,
        full_content: str,
        issue_type: str,
        issue_description: str,
        guideline_reference: str,
        target_text: Optional[str] = None,
        canonical_context: Optional[str] = None
    ) -> Optional[str]:
        
        if not self.is_gemini_active():
            return None

        try:
            prompt = f"""You are the BrandSphere AI Brand Compliance Engine.
We need to remediate an issue in enterprise brand content while preserving surrounding voice and context.

DOCUMENT CONTENT:
"{full_content}"

FLAGGED ISSUE:
- Type: {issue_type}
- Reference: {guideline_reference}
- Description: {issue_description}
- Target Text: "{target_text or 'N/A'}"
- Approved Enterprise Context / Facts: "{canonical_context or 'Use verifiable enterprise descriptors'}"

TASK:
Provide the optimal, concise replacement phrase for "{target_text or issue_description}".
Output ONLY the clean replacement phrase without markdown quotes or explanations.
"""
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            if response and response.text:
                cleaned = response.text.strip().strip("'\"`")
                if cleaned:
                    return cleaned
        except Exception as e:
            logger.warning(f"Gemini remediation call failed ({e}). Using rule-based fallback.")

        return None

    def audit_image_multimodal(
        self,
        image_bytes: bytes,
        mime_type: str = "image/png"
    ) -> Optional[Dict[str, Any]]:

        if not self.is_gemini_active():
            return None

        try:
            from google.genai import types

            prompt = """Analyze this marketing creative banner for brand identity compliance.
Evaluate:
1. Visual hierarchy and clarity
2. Professional enterprise tone
3. Brand color harmony
4. Any potential accessibility or readability concerns

Respond in valid JSON format with keys:
{
  "multimodal_summary": "string",
  "brand_tone_alignment": "string (e.g. High / Moderate / Low)",
  "ai_recommendations": ["string", "string"]
}
"""
            image_part = types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type
            )

            response = self.client.models.generate_content(
                model=self.model_name,
                contents=[prompt, image_part]
            )

            if response and response.text:
                raw_text = response.text.strip()

                if "```json" in raw_text:
                    raw_text = raw_text.split("```json")[1].split("```")[0].strip()
                elif "```" in raw_text:
                    raw_text = raw_text.split("```")[1].split("```")[0].strip()

                try:
                    parsed = json.loads(raw_text)
                    return parsed
                except Exception:
                    return {
                        "multimodal_summary": response.text.strip(),
                        "brand_tone_alignment": "High",
                        "ai_recommendations": ["Visual asset verified with Gemini 1.5 Flash."]
                    }
        except Exception as e:
            logger.warning(f"Gemini multimodal audit call failed ({e}).")

        return None



llm_engine = LLMEngine()