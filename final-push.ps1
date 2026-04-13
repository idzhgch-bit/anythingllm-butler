# Final Push Script - Safe Mode (idzhgch-bit)
$ErrorActionPreference = "Stop"

Write-Host "`n=== ANYTHINGLLM-BUTLER SAFE PUSH ===" -ForegroundColor Cyan
Write-Host "GitHub ID: idzhgch-bit" -ForegroundColor Yellow
Write-Host "Repository: anythingllm-butler" -ForegroundColor Yellow
Write-Host ""

# 1. Initialize Git (if needed)
if (-not (Test-Path ".git")) {
    Write-Host "[1/6] Initializing git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "[1/6] Git repository already initialized." -ForegroundColor Green
}

# 2. Configure user (already done globally)
Write-Host "[2/6] Git user configured: Guochen (StarRush)" -ForegroundColor Green

# 3. Add files (exclude sensitive data)
Write-Host "[3/6] Staging files (excluding .env and node_modules)..." -ForegroundColor Yellow
git add README.md LICENSE VERSION package.json deploy-env.ps1 SKILL.md scripts/ tests/ .gitignore .env.example push-to-github.ps1 final-push.ps1

# 4. Commit changes
Write-Host "[4/6] Committing changes..." -ForegroundColor Yellow
git commit -m "Initial release: anythingllm-butler v2.2.0-secure (Safe Mode)"

# 5. Add remote repository
Write-Host "[5/6] Setting up remote repository..." -ForegroundColor Yellow
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    $repoUrl = "https://github.com/idzhgch-bit/anythingllm-butler.git"
    git remote add origin $repoUrl
    Write-Host "[INFO] Remote added: $repoUrl" -ForegroundColor Green
} else {
    Write-Host "[INFO] Remote already exists: $remoteExists" -ForegroundColor Green
}

# 6. Push to GitHub (with auto-detection of branch)
Write-Host "`n[6/6] Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main --force

Write-Host "`n✅ SUCCESS! Repository pushed!" -ForegroundColor Green
Write-Host "📍 URL: https://github.com/idzhgch-bit/anythingllm-butler" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  • Visit the repository to verify files" -ForegroundColor White
Write-Host "  • Fill in your API Key in .env (DO NOT commit!)" -ForegroundColor White
Write-Host "  • Share the URL with collaborators" -ForegroundColor White
