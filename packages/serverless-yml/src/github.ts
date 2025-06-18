export async function fetchGithubJson(
  owner: string,
  repo: string,
  path: string,
): Promise<any> {
  // GitHub raw content URL format with proper encoding
  const encodedPath = encodeURIComponent(path);
  const url = `https://raw.githubusercontent.com/${owner}/${repo}${encodedPath}`;

  console.log('fetching', url);
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching GitHub JSON:', error);
    throw error;
  }
}

export async function fetchServerlessConfig(
  owner: string,
  repo: string,
  path: string,
): Promise<any> {
  const config = await fetchGithubJson(owner, repo, path);
  return config;
}
