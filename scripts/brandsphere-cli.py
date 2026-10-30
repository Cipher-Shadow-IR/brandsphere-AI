#!/usr/bin/env python3
"""
BrandSphere AI - Headless Pre-Publication CLI & CI/CD Scanner
Enforces brand governance, claim substantiation, and WCAG accessibility
in terminal sessions, git pre-commit hooks, and CI/CD pipelines.
"""

import sys
import os
import argparse
import subprocess
from pathlib import Path
from typing import List, Dict, Any

# Ensure project root is in sys.path
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(REPO_ROOT))

from backend.app.governance_engine import analyze_content, compute_readability
from backend.app.database import SessionLocal
from backend.app.document_parser import parse_document_file


def format_cli_report(file_name: str, text: str, issues: List[Dict[str, Any]], readability: Dict[str, Any]) -> int:
    """
    Renders terminal governance report and returns exit code (1 if critical violations, 0 if clean).
    """
    critical_issues = [i for i in issues if i.get("severity") == "Critical"]
    moderate_issues = [i for i in issues if i.get("severity") == "Moderate"]
    advisory_issues = [i for i in issues if i.get("severity") == "Advisory"]

    print("\n" + "=" * 70)
    print("  \033[1;36mBrandSphere AI\033[0m — Pre-Publication Brand Governance CLI Gate")
    print("=" * 70)
    print(f"  Target Asset : \033[1m{file_name}\033[0m")
    print(f"  Word Count   : {len(text.split())} words")
    print(f"  Readability  : {readability.get('flesch_reading_ease', 70):.1f}/100 ({readability.get('reading_level', 'Standard')})")
    print("-" * 70)

    if not issues:
        print("  \033[1;32m[PASS]\033[0m All brand governance checks passed with 100% compliance!")
        print("  Collateral is authorized for publication.\n")
        return 0

    print(f"  Findings Detected: {len(issues)} total (\033[1;31m{len(critical_issues)} Critical\033[0m, \033[1;33m{len(moderate_issues)} Moderate\033[0m, \033[1;34m{len(advisory_issues)} Advisory\033[0m)\n")

    for idx, iss in enumerate(issues, 1):
        sev = iss.get("severity", "Advisory")
        if sev == "Critical":
            badge = "\033[1;31m[CRITICAL]\033[0m"
        elif sev == "Moderate":
            badge = "\033[1;33m[MODERATE]\033[0m"
        else:
            badge = "\033[1;34m[ADVISORY]\033[0m"

        print(f"  {idx}. {badge} \033[1m{iss.get('description')}\033[0m")
        print(f"     Policy     : {iss.get('guideline_reference', 'Brand Standard')}")
        print(f"     Remediation: \033[32m{iss.get('suggestion')}\033[0m")
        print(f"     Truth Cite : \033[90m{iss.get('citation')}\033[0m")
        print()

    print("=" * 70)
    if critical_issues:
        print("  \033[1;31m[GATE REJECTED]\033[0m Publication blocked due to unresolved critical brand liabilities.")
        print("  Please apply remediations before committing or publishing.\n")
        return 1
    else:
        print("  \033[1;33m[GATE WARNING]\033[0m Minor advisories present. Permitted for publication.\n")
        return 0


def scan_file(file_path: Path, strict: bool = True) -> int:
    if not file_path.exists():
        print(f"\033[1;31mError:\033[0m File not found: {file_path}", file=sys.stderr)
        return 1

    content_bytes = file_path.read_bytes()
    parsed = parse_document_file(file_path.name, content_bytes)
    text = parsed.get("text", "")

    if not text.strip():
        print(f"File {file_path.name} is empty or contains no parseable text.")
        return 0

    db = None
    if SessionLocal:
        db = SessionLocal()

    try:
        issues = analyze_content(text, db)
        readability = compute_readability(text)
        return format_cli_report(file_path.name, text, issues, readability)
    finally:
        if db:
            db.close()


def git_pre_commit() -> int:
    """
    Scans staged files in git repository before allowing commit.
    """
    try:
        cmd = ["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        staged_files = [f.strip() for f in res.stdout.splitlines() if f.strip()]
    except Exception as e:
        print(f"Git pre-commit inspection failed: {e}", file=sys.stderr)
        return 0

    scannable_exts = {".md", ".txt", ".pdf", ".docx", ".pptx", ".html", ".json"}
    files_to_scan = [Path(f) for f in staged_files if Path(f).suffix.lower() in scannable_exts]

    if not files_to_scan:
        print("BrandSphere AI: No relevant marketing copy or documents staged. Proceeding with commit.")
        return 0

    print(f"BrandSphere AI Pre-Commit: Scanning {len(files_to_scan)} staged collateral files...")
    exit_code = 0
    for f in files_to_scan:
        code = scan_file(f, strict=True)
        if code != 0:
            exit_code = 1

    return exit_code


def main():
    parser = argparse.ArgumentParser(description="BrandSphere AI Pre-Publication Governance CLI")
    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # scan command
    scan_cmd = subparsers.add_parser("scan", help="Scan a document or copy file")
    scan_cmd.add_argument("file", help="Path to file to scan (.md, .txt, .pdf, .docx, .pptx)")
    scan_cmd.add_argument("--strict", action="store_true", help="Fail if any critical issue exists")

    # pre-commit command
    subparsers.add_parser("pre-commit", help="Run git pre-commit hook scan on staged files")

    args = parser.parse_args()

    if args.command == "scan":
        sys.exit(scan_file(Path(args.file), strict=args.strict))
    elif args.command == "pre-commit":
        sys.exit(git_pre_commit())
    else:
        parser.print_help()
        sys.exit(0)


if __name__ == "__main__":
    main()
