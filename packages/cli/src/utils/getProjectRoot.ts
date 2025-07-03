export const getWorkingDirectory = () => {
  // Return the current working directory where the CLI is executed
  // This allows creating packages in any directory
  return process.cwd();
}; 