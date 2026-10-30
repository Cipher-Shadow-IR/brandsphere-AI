#!/usr/bin/env bash
# BrandSphere AI - Pre-Commit Brand Governance Hook
# Install into your repository by running:
#   cp scripts/pre-commit-hook.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

echo "=========================================================="
echo "🛡️  BrandSphere AI: Running Pre-Commit Governance Audit..."
echo "=========================================================="

python scripts/brandsphere-cli.py pre-commit
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo ""
  echo "❌ Commit rejected by BrandSphere AI Pre-Publication Policy Gate."
  echo "   Resolve the critical brand claims or tone violations listed above before committing."
  echo "   (Use --no-verify only in emergency enterprise override scenarios)"
  exit 1
fi

echo "✅ BrandSphere AI: All staged copy adheres to brand guidelines."
exit 0
