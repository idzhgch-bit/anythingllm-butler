# Push to GitHub - Safe Mode (No Sensitive Data)
# Prerequisites: 
#   1. Create empty repository on github.com (e.g., anythingllm-butler)
#   2. Replace 'yourusername' below with your GitHub username

$ErrorActionPreference = "Stop"
$repoUrl = "https://github.com/yourusername/anythingllm-butler.git"

Write-Host "[INFO] Starting safe Git push..." -ForegroundColor Cyan

# Step 1: Initialize Git (if not already initialized)
if (-not (Test-Path ".git")) {
    Write-Host "[INFO] Initializing git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "[INFO] Git repository already exists." -ForegroundColor Green
}

# Step 2: Add all files EXCEPT node_modules and .env
Write-Host "[INFO] Adding files to staging (excluding sensitive data)..." -ForegroundColor Yellow
git add README.md LICENSE VERSION package.json deploy-env.ps1 SKILL.md scripts/ tests/ .gitignore .env.example

# Step 3: Commit changes
Write-Host "[INFO] Committing changes..." -ForegroundColor Yellow
git commit -m "Initial release: anythingllm-butler v2.2.0-secure (Safe Mode)"

# Step 4: Add remote repository
Write-Host "[INFO] Setting up remote repository..." -ForegroundColor Yellow
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    git remote add origin $repoUrl
} else {
    Write-Host "[INFO] Remote already exists: $remoteExists" -ForegroundColor Green
}

# Step 5: Push to GitHub
Write-Host "`n[INFO] Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "`n✅ Git push completed successfully!" -ForegroundColor Green
Write-Host "Repository URL: $repoUrl" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Visit: $repoUrl" -ForegroundColor White
Write-Host "  2. Fill in your API Key in .env (DO NOT commit this file!)" -ForegroundColor White
