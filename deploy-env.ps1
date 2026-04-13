# Deploy Environment Configuration for AnythingLLM Butler
# Prerequisites: Node.js + npm installed

$ErrorActionPreference = "Stop"
$skillDir = "C:\Users\Guochen\.openclaw\workspace\skills\anythingllm-butler"

Write-Host "[INFO] Starting deployment..." -ForegroundColor Cyan

# Step 1: Verify .env file exists
if (-not (Test-Path "$skillDir\.env")) {
    Write-Error "[ERROR] .env file not found in $skillDir"
    exit 1
}

# Step 2: Install dotenv package
Write-Host "[INFO] Installing 'dotenv' package..." -ForegroundColor Yellow
Set-Location $skillDir
npm install dotenv --save

if ($LASTEXITCODE -ne 0) {
    Write-Error "[ERROR] Failed to install dotenv. Please check npm availability."
    exit 1
}

Write-Host "[SUCCESS] dotenv installed successfully!" -ForegroundColor Green

# Step 3: Verify .env content
Write-Host "`n[INFO] Current .env configuration:" -ForegroundColor Cyan
Get-Content "$skillDir\.env" | ForEach-Object { Write-Host $_ }

Write-Host "`n[INFO] Deployment complete! Ready to use." -ForegroundColor Green
Write-Host "Run: node scripts/butler-v2.2-secure.cjs" -ForegroundColor Yellow
