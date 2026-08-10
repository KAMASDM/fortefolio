#!/usr/bin/env bash
set -euo pipefail

echo "Checking all configured resume templates..."

template_count="$(
  sed -n '/TEMPLATES:/,/^  },/p' \
    src/components/ResumeBuilderPage/ResumePreview/constants.jsx |
    rg -c '^    [A-Z_]+:'
)"

if [[ "$template_count" != "24" ]]; then
  echo "Expected 24 templates, found $template_count."
  exit 1
fi

npm run build
echo "All 24 templates are mapped and the application builds."
