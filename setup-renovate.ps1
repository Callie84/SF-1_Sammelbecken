New-Item -ItemType Directory -Force -Path ".github/workflows" | Out-Null

@'
name: Renovate

on:
  workflow_dispatch:
  schedule:
    - cron: "15 3 * * 1-5"  # Mo–Fr 03:15 Europe/Berlin

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Renovate
        uses: renovatebot/github-action@v40
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
        env:
          LOG_LEVEL: info
          RENOVATE_REPOSITORY: ${{ github.repository }}
          RENOVATE_CONFIG_FILE: renovate.json
'@ | Set-Content .github/workflows/renovate.yml -Encoding UTF8

@'
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":semanticCommits",
    ":prHourlyLimitNone",
    ":disableRateLimiting"
  ],
  "timezone": "Europe/Berlin",
  "assigneesFromCodeOwners": true,
  "baseBranches": ["main", "master"],
  "rangeStrategy": "bump",
  "rebaseWhen": "behind-base-branch",
  "dependencyDashboard": true,
  "labels": ["deps", "renovate"],
  "schedule": ["before 8am on monday", "before 8am on thursday"],
  "packageRules": [
    {
      "matchManagers": ["npm"],
      "automerge": true,
      "automergeType": "pr",
      "matchUpdateTypes": ["patch", "minor"],
      "prCreation": "immediate",
      "internalChecksFilter": "strict"
    },
    {
      "matchManagers": ["npm"],
      "matchDepTypes": ["devDependencies"],
      "groupName": "dev-deps (minor/patch)",
      "matchUpdateTypes": ["minor", "patch"]
    },
    {
      "description": "Lockfile maintenance weekly",
      "matchManagers": ["npm"],
      "matchUpdateTypes": ["lockFileMaintenance"],
      "extends": [":maintainLockFilesWeekly"],
      "automerge": true
    },
    {
      "description": "Major updates need manual review",
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["major-update"]
    },
    {
      "description": "Security-fixes bevorzugen",
      "matchManagers": ["npm"],
      "matchConfidence": ["high"],
      "matchCurrentVersion": "!/^0\\./",
      "labels": ["security"],
      "prPriority": 1
    }
  ],
  "npm": {
    "enabled": true
  },
  "osvVulnerabilityAlerts": true,
  "prHourlyLimit": 0,
  "prConcurrentLimit": 10
}
'@ | Set-Content renovate.json -Encoding UTF8

# Hinweis für Branch-Protection (optional)
@'
Empfehlung:
- Aktiviere Branch Protection auf main/master.
- Erfordere erfolgreiche Checks: CI, CodeQL, Super Linter, Renovate.
'@ | Set-Content .github/RENOVATE_NOTES.md -Encoding UTF8
