# GitHub Setup Guide for Kaizen Website

## 🎯 Overview
This guide will help you set up GitHub for hosting both the static website and managing data files for the admin system.

## 📋 Step-by-Step GitHub Setup

### Step 1: Create GitHub Repository

1. **Go to GitHub.com** and sign in to your account
2. **Click "New Repository"** (green button or + icon)
3. **Repository Settings**:
   ```
   Repository name: kaizen-website
   Description: Kaizen Education NGO website with admin panel
   Visibility: Private (recommended) or Public
   Initialize: ✅ Add a README file
   ```
4. **Click "Create Repository"**

### Step 2: Repository Configuration

#### 2.1 Repository Settings
1. Go to **Settings** tab in your repository
2. **General Settings**:
   - ✅ Issues (enable if you want bug tracking)
   - ✅ Wiki (enable if you want documentation)
   - ✅ Projects (enable if you want project management)

#### 2.2 GitHub Pages Setup
1. Go to **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main`
4. **Folder**: `/ (root)`
5. **Click Save**

#### 2.3 Actions Permissions
1. Go to **Settings** → **Actions** → **General**
2. **Workflow permissions**: ✅ "Read and write permissions"
3. **Allow GitHub Actions to create and approve pull requests**: ✅
4. **Click Save**

### Step 3: GitHub Secrets Configuration

#### 3.1 Create GitHub Token
1. Go to **GitHub Settings** (your profile) → **Developer settings**
2. **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)**
4. **Token Settings**:
   ```
   Note: Kaizen Website Admin
   Expiration: No expiration (or 1 year)
   Scopes:
   ✅ repo (Full control of private repositories)
   ✅ workflow (Update GitHub Action workflows)
   ```
5. **Generate token** and **COPY IT** (you won't see it again!)

#### 3.2 Add Repository Secrets
1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. **Click "New repository secret"** and add:

   **Secret 1: JWT_SECRET**
   ```
   Name: JWT_SECRET
   Value: [Generate a secure 32+ character string]
   ```

   **Secret 2: GITHUB_TOKEN**
   ```
   Name: GITHUB_TOKEN
   Value: [The token you created in step 3.1]
   ```

   **Secret 3: ADMIN_PASSWORD** (optional)
   ```
   Name: ADMIN_PASSWORD
   Value: [Your desired admin password - will be hashed]
   ```

### Step 4: Repository Permissions

#### 4.1 Branch Protection Rules
1. Go to **Settings** → **Branches**
2. **Add rule** for `main` branch:
   ```
   ✅ Require a pull request before merging
   ✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   ✅ Restrict pushes that create files larger than 100MB
   ```

#### 4.2 Collaborator Access (if needed)
1. Go to **Settings** → **Collaborators and teams**
2. **Add people** who need access
3. **Permission levels**:
   - **Read**: View only
   - **Write**: Push to repository
   - **Admin**: Full control

### Step 5: Local Git Setup

#### 5.1 Initialize Local Repository
```bash
# Navigate to your project directory
cd kaizen-website

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Kaizen Education NGO website"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/kaizen-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### 5.2 Verify Upload
1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that `.github/workflows/deploy.yml` exists

### Step 6: Test GitHub Pages

#### 6.1 Trigger Deployment
1. Go to **Actions** tab in your repository
2. You should see the "Deploy to GitHub Pages and Render.com" workflow
3. **Click on it** and **Run workflow** manually (optional)

#### 6.2 Verify Deployment
1. Go to **Settings** → **Pages**
2. You should see: ✅ "Your site is published at https://YOUR_USERNAME.github.io/kaizen-website"
3. **Visit the URL** to test your static site

### Step 7: Environment Variables for Development

#### 7.1 Create .env.local (for local development)
```bash
# Create .env.local file
touch .env.local
```

#### 7.2 Add to .env.local
```env
# GitHub Integration
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=YOUR_USERNAME/kaizen-website
USE_GITHUB_DATA=true

# JWT Secret
JWT_SECRET=your-secure-jwt-secret-key-32-chars-minimum

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🔧 GitHub API Integration

### Data Files Structure
Your repository should have this structure:
```
kaizen-website/
├── src/data/
│   ├── projects.json          # Project data
│   ├── blog-posts.json        # Blog posts data
│   └── admin-config.json      # Admin configuration
├── public/images/             # Static images
└── .github/workflows/         # Deployment workflows
```

### API Endpoints
The system will automatically use GitHub API when:
- `USE_GITHUB_DATA=true`
- `GITHUB_TOKEN` is set
- `GITHUB_REPO` is set

### Fallback System
If GitHub API fails, the system will:
1. Try GitHub API first
2. Fall back to local files
3. Show error if both fail

## 🚀 Next Steps

### After GitHub Setup:
1. ✅ **Test static site** on GitHub Pages
2. ✅ **Verify file uploads** work
3. ✅ **Test admin functionality** (when Render.com is set up)
4. ✅ **Set up Render.com** for web service hosting

### Monitoring:
1. **GitHub Actions** tab for deployment status
2. **Repository Insights** for traffic and activity
3. **Settings** → **Pages** for site status

## 🆘 Troubleshooting

### Common Issues:

#### 1. GitHub Pages Not Deploying
- Check **Actions** tab for error messages
- Verify **Pages** settings (branch: main, folder: /)
- Ensure `next.config.ts` has correct export settings

#### 2. GitHub API Errors
- Verify `GITHUB_TOKEN` has correct permissions
- Check `GITHUB_REPO` format: `username/repository-name`
- Test token manually: `curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user`

#### 3. File Upload Issues
- Check repository permissions
- Verify token has `repo` scope
- Check file size limits (100MB max per file)

#### 4. Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

### Support Resources:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub API Documentation](https://docs.github.com/en/rest)

## 📞 Need Help?
If you encounter issues:
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Test API endpoints manually
4. Review this guide step by step
