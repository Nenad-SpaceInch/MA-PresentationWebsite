# Sync the site to S3 at bucket root so these URLs work:
#   https://your-domain/styles/index.css
#   https://your-domain/css/site.css
#   https://your-domain/js/site.js
#   https://your-domain/assets/...
#
# Requires: AWS CLI configured (aws configure) or -Profile.
#
# Usage:
#   .\deploy\s3-upload.ps1 -BucketName my-bucket-name
#   .\deploy\s3-upload.ps1 -BucketName my-bucket-name -CloudFrontDistributionId E1234567890ABC
#   .\deploy\s3-upload.ps1 -BucketName my-bucket-name -Profile myprofile

param(
  [Parameter(Mandatory = $true)]
  [string] $BucketName,
  [string] $CloudFrontDistributionId = "",
  [string] $Profile = ""
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

Write-Host "Syncing from: $repoRoot"
Write-Host "Target: s3://$BucketName/ (bucket root)"

$syncArgs = @(
  "s3", "sync", $repoRoot, "s3://$BucketName/",
  "--exclude", ".git/*",
  "--exclude", ".cursor/*",
  "--exclude", "deploy/*",
  "--exclude", ".DS_Store",
  "--exclude", "Thumbs.db",
  "--exclude", "*.log"
)

if ($Profile) {
  & aws --profile $Profile @syncArgs
} else {
  & aws @syncArgs
}

if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host "Sync finished."

if ($CloudFrontDistributionId) {
  Write-Host "Creating CloudFront invalidation for /* ..."
  $invArgs = @(
    "cloudfront", "create-invalidation",
    "--distribution-id", $CloudFrontDistributionId,
    "--paths", "/*"
  )
  if ($Profile) {
    & aws --profile $Profile @invArgs
  } else {
    & aws @invArgs
  }
}
