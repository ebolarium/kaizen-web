// GitHub API service for reading/writing JSON data files
interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  content: string;
}

interface GitHubResponse {
  sha: string;
  content: string;
}

class GitHubAPI {
  private token: string;
  private owner: string;
  private repo: string;
  private baseUrl = 'https://api.github.com';

  constructor(token: string, owner: string, repo: string) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Read a JSON file from GitHub
  async readJSONFile(path: string): Promise<any> {
    try {
      const response = await this.request(`/contents/${path}`);
      const content = Buffer.from(response.content, 'base64').toString('utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error reading file ${path}:`, error);
      throw error;
    }
  }

  // Write a JSON file to GitHub
  async writeJSONFile(path: string, data: any, message: string): Promise<GitHubResponse> {
    try {
      // First, get the current file to get its SHA
      let sha: string | undefined;
      try {
        const currentFile = await this.request(`/contents/${path}`);
        sha = currentFile.sha;
      } catch (error) {
        // File doesn't exist, will create new one
      }

      const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
      
      const body: any = {
        message,
        content,
        committer: {
          name: 'Kaizen Admin',
          email: 'admin@kaizen.org'
        }
      };

      if (sha) {
        body.sha = sha; // Update existing file
      }

      return await this.request(`/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(`Error writing file ${path}:`, error);
      throw error;
    }
  }

  // Get file SHA (for checking if file exists)
  async getFileSHA(path: string): Promise<string | null> {
    try {
      const response = await this.request(`/contents/${path}`);
      return response.sha;
    } catch (error) {
      return null; // File doesn't exist
    }
  }

  // List files in a directory
  async listFiles(path: string): Promise<GitHubFile[]> {
    try {
      return await this.request(`/contents/${path}`);
    } catch (error) {
      console.error(`Error listing files in ${path}:`, error);
      throw error;
    }
  }
}

// Factory function to create GitHub API instance
export function createGitHubAPI(): GitHubAPI | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (!token || !repo) {
    console.warn('GitHub API not configured: Missing GITHUB_TOKEN or GITHUB_REPO');
    return null;
  }

  const [owner, repoName] = repo.split('/');
  if (!owner || !repoName) {
    console.error('Invalid GITHUB_REPO format. Expected: owner/repo');
    return null;
  }

  return new GitHubAPI(token, owner, repoName);
}

// Helper functions for specific data files
export async function readProjectsFromGitHub(): Promise<any> {
  const github = createGitHubAPI();
  if (!github) {
    throw new Error('GitHub API not configured');
  }
  return github.readJSONFile('src/data/projects.json');
}

export async function readBlogPostsFromGitHub(): Promise<any> {
  const github = createGitHubAPI();
  if (!github) {
    throw new Error('GitHub API not configured');
  }
  return github.readJSONFile('src/data/blog-posts.json');
}

export async function readAdminConfigFromGitHub(): Promise<any> {
  const github = createGitHubAPI();
  if (!github) {
    throw new Error('GitHub API not configured');
  }
  return github.readJSONFile('src/data/admin-config.json');
}

export async function writeProjectsToGitHub(data: any): Promise<void> {
  const github = createGitHubAPI();
  if (!github) {
    throw new Error('GitHub API not configured');
  }
  await github.writeJSONFile('src/data/projects.json', data, 'Update projects data');
}

export async function writeBlogPostsToGitHub(data: any): Promise<void> {
  const github = createGitHubAPI();
  if (!github) {
    throw new Error('GitHub API not configured');
  }
  await github.writeJSONFile('src/data/blog-posts.json', data, 'Update blog posts data');
}

export default GitHubAPI;
