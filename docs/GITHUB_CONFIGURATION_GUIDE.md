# GitHub Repository Configuration Guide

**Repository**: Nblues/chiangmaiusedcar-next  
**Date**: 2025-10-19  
**Standards**: International Best Practices 2025

---

## ✅ Completed Configurations

### 1. Repository Files (100%)

- [x] README.md - Enhanced with badges, sections, and documentation
- [x] CHANGELOG.md - Version history (Keep a Changelog format)
- [x] CONTRIBUTING.md - Contribution guidelines
- [x] CODE_OF_CONDUCT.md - Community standards
- [x] SECURITY.md - Security policy and vulnerability reporting
- [x] LICENSE - Proprietary license
- [x] .editorconfig - Editor consistency
- [x] .gitignore - Git ignore rules

### 2. GitHub Templates (100%)

- [x] `.github/ISSUE_TEMPLATE/bug_report.md` - Bug report template
- [x] `.github/ISSUE_TEMPLATE/feature_request.md` - Feature request template
- [x] `.github/PULL_REQUEST_TEMPLATE.md` - PR checklist template
- [x] `.github/CODEOWNERS` - Code ownership and auto-review assignment
- [x] `.github/labels.yml` - Label configuration (24 labels)

### 3. GitHub Actions Workflows (100%)

- [x] `.github/workflows/ci.yml` - Lint, type-check, and build
- [x] `.github/workflows/codeql.yml` - Security scanning (weekly)
- [x] `.github/workflows/auto-label.yml` - Auto-label issues/PRs
- [x] `.github/workflows/stale.yml` - Stale issue/PR management

### 4. Dependency Management (100%)

- [x] `.github/dependabot.yml` - Automated dependency updates
- [x] `renovate.json` - Smart dependency grouping and auto-merge

---

## 📋 Manual Configuration Required

Complete these settings in GitHub repository:

### 1. General Settings

**URL**: https://github.com/Nblues/chiangmaiusedcar-next/settings

- [ ] **Description**: เว็บไซต์รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย | Next.js 14 + Shopify Headless CMS
- [ ] **Website**: https://www.chiangmaiusedcar.com
- [ ] **Topics**: `nextjs`, `shopify`, `thailand`, `used-cars`, `ecommerce`, `typescript`, `tailwindcss`
- [ ] **Features**:
  - ✅ Issues
  - ❌ Wiki
  - ❌ Projects (deprecated - use GitHub Projects separately)
  - ⚠️ Discussions (optional)
  - ❌ Sponsorships (not applicable)

### 2. Branch Protection Rules

**URL**: https://github.com/Nblues/chiangmaiusedcar-next/settings/branches

Click "Add rule" for branch `master`:

**Basic Protection**:

- [x] Require a pull request before merging
  - [x] Require approvals: **1**
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners

**Status Checks**:

- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - [x] Status checks that are required:
    - `build-and-check` (from CI workflow)

**Additional Rules**:

- [x] Require conversation resolution before merging
- [x] Require signed commits (recommended for security)
- [ ] Do not allow bypassing the above settings (strict mode)
- [x] Allow force pushes: **Specify who can force push** → Only admins

### 3. Code Security & Analysis

**URL**: https://github.com/Nblues/chiangmaiusedcar-next/settings/security_analysis

**Dependabot**:

- [x] Enable Dependabot alerts
- [x] Enable Dependabot security updates
- [x] Enable grouped security updates

**Code Scanning**:

- [x] Enable CodeQL analysis (set up by `.github/workflows/codeql.yml`)
  - Verify workflow is running successfully

**Secret Scanning**:

- [x] Enable secret scanning
- [x] Enable push protection (prevents commits with secrets)

**Private Vulnerability Reporting**:

- [x] Enable (allows security researchers to privately report vulnerabilities)

### 4. Webhooks & Services

**URL**: https://github.com/Nblues/chiangmaiusedcar-next/settings/hooks

Verify existing integrations:

- [x] **Vercel**: Should already be connected
  - Events: Push, Pull request, Deployment status
  - Active: ✅

Add if needed:

- [ ] **Slack/Discord** (optional): For deployment notifications

### 5. Labels

**URL**: https://github.com/Nblues/chiangmaiusedcar-next/labels

Labels are defined in `.github/labels.yml`. Apply them manually or use GitHub CLI:

```bash
# Install GitHub CLI if not installed
# https://cli.github.com/

# Authenticate
gh auth login

# Navigate to repository
cd /path/to/chiangmaiusedcar-next

# Create labels from labels.yml (requires ghaction-github-labeler or manual creation)
# Manual: Go to Issues → Labels → New label
```

**Label Categories to Create**:

**Type Labels**:

- `bug` (color: d73a4a)
- `enhancement` (color: a2eeef)
- `documentation` (color: 0075ca)
- `design` (color: f9d0c4)
- `refactoring` (color: fbca04)
- `performance` (color: ff7619)
- `testing` (color: 0e8a16)
- `maintenance` (color: d4c5f9)

**Priority Labels**:

- `priority: critical` (color: b60205)
- `priority: high` (color: d93f0b)
- `priority: medium` (color: fbca04)
- `priority: low` (color: 0e8a16)

**Status Labels**:

- `status: blocked` (color: d73a4a)
- `status: in progress` (color: 0052cc)
- `status: needs review` (color: 0e8a16)
- `status: on hold` (color: fbca04)

**Special Labels**:

- `good first issue` (color: 7057ff)
- `help wanted` (color: 008672)
- `question` (color: d876e3)
- `duplicate` (color: cfd3d7)
- `invalid` (color: e4e669)
- `wontfix` (color: ffffff)
- `stale` (color: fef2c0)
- `security` (color: ee0701)
- `dependencies` (color: 0366d6)
- `pinned` (color: fbca04)
- `work-in-progress` (color: f9d0c4)

### 6. Secrets & Variables

**URL**: https://github.com/Nblues/chiangmaiusedcar-next/settings/secrets/actions

**Repository Secrets** (for GitHub Actions):

- [x] `SHOPIFY_DOMAIN`
- [x] `SHOPIFY_STOREFRONT_TOKEN`

**Note**: Most secrets are managed in Vercel Dashboard (recommended for deployment).

### 7. Environments (Optional)

**URL**: https://github.com/Nblues/chiangmaiusedcar-next/settings/environments

Create environments for deployment protection:

**Production**:

- Required reviewers: @Nblues
- Wait timer: 0 minutes
- Deployment branches: Only `master`

**Preview**:

- Required reviewers: None
- Deployment branches: All branches

### 8. Pages

**URL**: https://github.com/Nblues/chiangmaiusedcar-next/settings/pages

- [ ] **Disable GitHub Pages** (using Vercel for hosting)

---

## 🔄 Automated Workflows

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers**: Push to master, Pull requests  
**Jobs**:

- Lint code with ESLint
- Type-check with TypeScript
- Build Next.js project
- Format check with Prettier

### CodeQL Security Scan (`.github/workflows/codeql.yml`)

**Triggers**: Push to master, Pull requests, Weekly schedule (Sundays 11PM UTC)  
**Jobs**:

- Scan JavaScript/TypeScript code for vulnerabilities
- Report security issues to GitHub Security tab

### Auto-Label (`.github/workflows/auto-label.yml`)

**Triggers**: New issues, New pull requests  
**Jobs**:

- Auto-apply labels based on:
  - Issue content (bug, enhancement, security, etc.)
  - PR title (conventional commits: feat:, fix:, docs:, etc.)

### Stale Management (`.github/workflows/stale.yml`)

**Triggers**: Daily at 7PM UTC  
**Jobs**:

- Mark issues as stale after 30 days of inactivity
- Close stale issues after 7 additional days
- Mark PRs as stale after 45 days
- Close stale PRs after 14 additional days
- Exempt labels: `pinned`, `security`, `critical`, `work-in-progress`

---

## 🎯 Best Practices Applied

### Conventional Commits

All commits should follow the format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`

Example:

```bash
git commit -m "feat(cart): add shopping cart functionality

Add shopping cart with local storage persistence
Update cart badge on navbar

Closes #123"
```

### Semantic Versioning

Version numbers follow `MAJOR.MINOR.PATCH`:

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Code Review Process

1. Create feature branch
2. Make changes and commit
3. Push to GitHub
4. Open Pull Request
5. Request review from CODEOWNERS
6. Address feedback
7. Merge after approval

---

## 📊 Monitoring & Analytics

### GitHub Insights

**URL**: https://github.com/Nblues/chiangmaiusedcar-next/pulse

Monitor:

- Active pull requests and issues
- Contributors and commits
- Code frequency
- Dependency graph

### Security Alerts

**URL**: https://github.com/Nblues/chiangmaiusedcar-next/security

Check:

- Dependabot alerts
- Code scanning alerts
- Secret scanning alerts

### Actions Runs

**URL**: https://github.com/Nblues/chiangmaiusedcar-next/actions

Monitor workflow executions and logs.

---

## ✅ Verification Checklist

After completing manual configurations:

- [ ] Branch protection is active on `master`
- [ ] Dependabot alerts are enabled
- [ ] CodeQL workflow runs successfully
- [ ] Auto-label workflow works on new issues/PRs
- [ ] Stale workflow is scheduled
- [ ] All labels are created
- [ ] Vercel webhook is connected
- [ ] Repository description and topics are set
- [ ] CODEOWNERS file triggers review requests

---

## 🔗 Quick Links

- **Repository**: https://github.com/Nblues/chiangmaiusedcar-next
- **Settings**: https://github.com/Nblues/chiangmaiusedcar-next/settings
- **Security**: https://github.com/Nblues/chiangmaiusedcar-next/security
- **Actions**: https://github.com/Nblues/chiangmaiusedcar-next/actions
- **Insights**: https://github.com/Nblues/chiangmaiusedcar-next/pulse

---

## 📝 Next Steps

1. Complete all checkboxes in "Manual Configuration Required" section
2. Verify all workflows run successfully on next push
3. Test issue/PR creation to verify auto-labeling
4. Monitor Dependabot for first dependency update PRs
5. Review CodeQL security scan results

---

**Last Updated**: 2025-10-19  
**Maintainer**: @Nblues  
**Status**: ✅ Ready for production use with manual configuration pending
