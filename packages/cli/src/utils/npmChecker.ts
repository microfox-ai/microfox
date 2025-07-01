export async function isPackageNameAvailable(packageName: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`https://registry.npmjs.org/${packageName}`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // If we get a 200 response, the package exists
    if (response.ok) {
      return false;
    }
    
    // If we get a 404, the package doesn't exist (available)
    if (response.status === 404) {
      return true;
    }
    
    // For other status codes, assume unavailable for safety
    console.warn(`Warning: Unexpected status ${response.status} when checking npm availability for ${packageName}. Proceeding with caution.`);
    return false;
  } catch (error: any) {
    // For network errors, timeouts, etc., assume unavailable for safety
    if (error.name === 'AbortError') {
      console.warn(`Warning: Timeout when checking npm availability for ${packageName}. Proceeding with caution.`);
    } else {
      console.warn(`Warning: Could not check npm availability for ${packageName}. Proceeding with caution.`);
    }
    return false;
  }
}

export async function checkPackageNameAndPrompt(packageName: string): Promise<string> {
  const readlineSync = require('readline-sync');
  let currentName = packageName;
  
  while (true) {
    console.log(`🔍 Checking npm availability for "${currentName}"...`);
    
    const isAvailable = await isPackageNameAvailable(currentName);
    
    if (isAvailable) {
      console.log(`✅ Package name "${currentName}" is available on npm!`);
      return currentName;
    } else {
      console.log(`❌ Package name "${currentName}" is already taken on npm.`);
      
      const newName = readlineSync.question('Please enter a new package name: ');
      if (!newName || newName.trim() === '') {
        console.log('❌ Invalid package name. Please try again.');
        continue;
      }
      
      currentName = newName.trim();
    }
  }
} 