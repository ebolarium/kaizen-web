# GitHub Setup Script for Kaizen Website (PowerShell)
# This script helps set up the GitHub repository and initial configuration

Write-Host "🚀 Kaizen Website - GitHub Setup Script" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Check if we have files to commit
$gitStatus = git status --porcelain
if ([string]::IsNullOrEmpty($gitStatus)) {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
} else {
    Write-Host "📝 Adding files to Git..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: Kaizen Education NGO website"
}

# Check if remote origin exists
try {
    $remoteUrl = git remote get-url origin 2>$null
    if ($remoteUrl) {
        Write-Host "✅ Remote origin already configured" -ForegroundColor Green
        Write-Host "📍 Current remote: $remoteUrl" -ForegroundColor Cyan
    }
} catch {
    Write-Host ""
    Write-Host "🔗 Please add your GitHub repository URL:" -ForegroundColor Yellow
    Write-Host "   Example: https://github.com/yourusername/kaizen-website.git" -ForegroundColor Gray
    Write-Host ""
    $repoUrl = Read-Host "Enter GitHub repository URL"
    
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "✅ Remote origin added: $repoUrl" -ForegroundColor Green
    } else {
        Write-Host "❌ No repository URL provided. Please add it manually:" -ForegroundColor Red
        Write-Host "   git remote add origin https://github.com/yourusername/kaizen-website.git" -ForegroundColor Gray
    }
}

# Check current branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "🔄 Renaming branch to 'main'..." -ForegroundColor Yellow
    git branch -M main
}

# Push to GitHub
Write-Host ""
Write-Host "🚀 Ready to push to GitHub!" -ForegroundColor Green
Write-Host ""
$pushNow = Read-Host "Do you want to push to GitHub now? (y/n)"

if ($pushNow -eq "y" -or $pushNow -eq "Y") {
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Go to your GitHub repository settings" -ForegroundColor White
        Write-Host "2. Enable GitHub Pages (Settings → Pages)" -ForegroundColor White
        Write-Host "3. Add repository secrets (Settings → Secrets and variables → Actions)" -ForegroundColor White
        Write-Host "4. Follow the GITHUB_SETUP.md guide for detailed configuration" -ForegroundColor White
        Write-Host ""
        $remoteUrl = git remote get-url origin
        Write-Host "🔗 Repository URL: $remoteUrl" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Failed to push to GitHub. Please check your repository URL and permissions." -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "📋 Manual push command:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📖 Follow GITHUB_SETUP.md for detailed configuration steps" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎉 GitHub setup script completed!" -ForegroundColor Green
Write-Host "📖 Read GITHUB_SETUP.md for detailed configuration instructions" -ForegroundColor Cyan
