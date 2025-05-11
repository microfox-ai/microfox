#!/bin/bash

# Reset packagefox-build.json
echo '{"requests": []}' > .microfox/packagefox-build.json

# Reset pr-usage.json
echo '{}' > .microfox/pr-usage.json

# Remove report files
rm -f packages/*/research-report.md
rm -f packages/*/build-report.md
rm -f packages/*/doc-report.md
rm -f packages/*/codegen-report.md

echo "Successfully removed report files from packages/*/"
echo "Successfully reset .microfox files" 