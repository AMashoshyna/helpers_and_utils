echo 'run script'
if [[ `git status --porcelain` ]]; then
  # Changes
  echo 'git tree contains unstaged changes'
  exit 1
else
  # No changes
  exit 0
fi