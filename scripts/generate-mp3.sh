#!/bin/bash

# MP4 to MP3 Converter Script
# This script checks for MP4 files in the out folder and generates corresponding MP3 files
# when MP3 files are missing using Remotion's ffmpeg command

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🎵 MP4 to MP3 Converter"
echo "======================="
echo "Project root: $PROJECT_ROOT"
echo ""

# Check if tsx is available
if ! command -v tsx &> /dev/null; then
    echo "❌ tsx is not installed. Installing tsx..."
    npm install -g tsx
fi

# Check if we're in the right directory
if [ ! -d "$PROJECT_ROOT/scripts" ]; then
    echo "❌ Error: This script should be run from the project root or scripts directory"
    echo "Current directory: $(pwd)"
    echo "Expected project root: $PROJECT_ROOT"
    exit 1
fi

# Run the TypeScript script
echo "🚀 Running MP4 to MP3 converter..."
cd "$PROJECT_ROOT"
tsx "$SCRIPT_DIR/src/generate-mp3-from-mp4.ts" "$@"
