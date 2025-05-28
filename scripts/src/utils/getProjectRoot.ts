// Add this at the top of the file after imports
export const getProjectRoot = () => {
  // If we're in the scripts directory, go up one level
  if (process.cwd().endsWith('/scripts')) {
    return process.cwd().replace('/scripts', '');
  }
  if (process.cwd().endsWith('\\scripts')) {
    return process.cwd().replace('\\scripts', '');
  }
  // If we're in the scripts/src directory, go up two levels
  if (process.cwd().endsWith('/scripts/src')) {
    return process.cwd().replace('/scripts/src', '');
  }
  if (process.cwd().endsWith('\\scripts\\src')) {
    return process.cwd().replace('\\scripts\\src', '');
  }
  // Otherwise, assume we're already in the project root
  return process.cwd();
};
