#!/bin/bash
set -e

echo "Running custom release script to build and publish changed packages."

# The GitHub push event provides the SHAs before and after the push.
# We check if the 'before' SHA is present and not the zero-commit SHA.
if [[ -n "$1" && "$1" != "0000000000000000000000000000000000000000" && -n "$2" ]]; then
    BEFORE_SHA=$1
    AFTER_SHA=$2
    echo "Using GitHub event SHAs. Building changes between $BEFORE_SHA and $AFTER_SHA"
    # The "..." range in the filter is used by turbo to find changes between two commits.
    FILTER="[${BEFORE_SHA}...${AFTER_SHA}]"
else
    # This fallback is for workflow_dispatch, the first push to a repo, or other edge cases.
    echo "GitHub event SHAs not provided or this is the first push. Falling back to tag-based comparison."
    
    # 'changeset version' creates a new tag, so we need the one before it.
    TAG_COUNT=$(git tag | wc -l)

    if [ "$TAG_COUNT" -ge 2 ]; then
      # The second-to-last tag represents the previous release.
      PREVIOUS_TAG=$(git tag --sort=-v:refname | head -n 2 | tail -n 1)
      echo "Found previous release tag: $PREVIOUS_TAG. Building changes since then."
      # The "[...]" filter finds all changes since the specified git ref.
      FILTER="[${PREVIOUS_TAG}]"
    else
      # For the first release, we build everything since the very first commit.
      INITIAL_COMMIT=$(git rev-list --max-parents=0 HEAD)
      echo "This appears to be the first release. Building all changes since the initial commit ($INITIAL_COMMIT)."
      FILTER="[${INITIAL_COMMIT}]"
    fi
fi

echo "Building packages with filter: $FILTER"
# The '--continue' flag allows turbo to build as many packages as possible,
# even if some of them fail. The '|| true' part ensures that the script
# doesn't exit if there are build failures, allowing us to proceed with
# publishing the successfully built packages.
npx turbo run build --continue --filter="$FILTER" || true

# Publish packages to npm.
echo "Publishing packages to npm..."
npx changeset publish

echo "Release script finished." 