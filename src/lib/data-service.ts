// Hybrid data service that can use local files or GitHub API
import fs from 'fs';
import path from 'path';
import { 
  readProjectsFromGitHub, 
  readBlogPostsFromGitHub, 
  readAdminConfigFromGitHub,
  writeProjectsToGitHub,
  writeBlogPostsToGitHub
} from './github-api';

interface DataServiceConfig {
  useGitHub: boolean;
  fallbackToLocal: boolean;
}

class DataService {
  private config: DataServiceConfig;

  constructor(config: DataServiceConfig = { useGitHub: false, fallbackToLocal: true }) {
    this.config = config;
  }

  // Projects
  async readProjects(): Promise<any> {
    if (this.config.useGitHub) {
      try {
        return await readProjectsFromGitHub();
      } catch (error) {
        console.error('Failed to read projects from GitHub:', error);
        if (this.config.fallbackToLocal) {
          return this.readProjectsLocal();
        }
        throw error;
      }
    }
    return this.readProjectsLocal();
  }

  async writeProjects(data: any): Promise<void> {
    if (this.config.useGitHub) {
      try {
        await writeProjectsToGitHub(data);
        return;
      } catch (error) {
        console.error('Failed to write projects to GitHub:', error);
        if (this.config.fallbackToLocal) {
          this.writeProjectsLocal(data);
          return;
        }
        throw error;
      }
    }
    this.writeProjectsLocal(data);
  }

  private readProjectsLocal(): any {
    const filePath = path.join(process.cwd(), 'src', 'data', 'projects.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  }

  private writeProjectsLocal(data: any): void {
    const filePath = path.join(process.cwd(), 'src', 'data', 'projects.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  // Blog Posts
  async readBlogPosts(): Promise<any> {
    if (this.config.useGitHub) {
      try {
        return await readBlogPostsFromGitHub();
      } catch (error) {
        console.error('Failed to read blog posts from GitHub:', error);
        if (this.config.fallbackToLocal) {
          return this.readBlogPostsLocal();
        }
        throw error;
      }
    }
    return this.readBlogPostsLocal();
  }

  async writeBlogPosts(data: any): Promise<void> {
    if (this.config.useGitHub) {
      try {
        await writeBlogPostsToGitHub(data);
        return;
      } catch (error) {
        console.error('Failed to write blog posts to GitHub:', error);
        if (this.config.fallbackToLocal) {
          this.writeBlogPostsLocal(data);
          return;
        }
        throw error;
      }
    }
    this.writeBlogPostsLocal(data);
  }

  private readBlogPostsLocal(): any {
    const filePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  }

  private writeBlogPostsLocal(data: any): void {
    const filePath = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  // Admin Config
  async readAdminConfig(): Promise<any> {
    if (this.config.useGitHub) {
      try {
        return await readAdminConfigFromGitHub();
      } catch (error) {
        console.error('Failed to read admin config from GitHub:', error);
        if (this.config.fallbackToLocal) {
          return this.readAdminConfigLocal();
        }
        throw error;
      }
    }
    return this.readAdminConfigLocal();
  }

  private readAdminConfigLocal(): any {
    const filePath = path.join(process.cwd(), 'src', 'data', 'admin-config.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  }
}

// Factory function to create data service based on environment
export function createDataService(): DataService {
  const useGitHub = process.env.USE_GITHUB_DATA === 'true' && 
                   !!process.env.GITHUB_TOKEN && 
                   !!process.env.GITHUB_REPO;
  
  return new DataService({
    useGitHub,
    fallbackToLocal: true
  });
}

export default DataService;
