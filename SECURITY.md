# Security Policy — Sri Telangana Ruchulu

## Supported Versions

Security updates and patches are actively applied to the latest production branch deployed at **https://sritelanganaruchulu.vercel.app**.

| Branch / Version | Supported          |
| ---------------- | ------------------ |
| `main` (Live)    | :white_check_mark: |
| Older commits    | :x:                |

---

## Reporting a Vulnerability

We take the security of **Sri Telangana Ruchulu** and our customers' personal and order data seriously. If you discover a potential security issue, please report it responsibly rather than opening a public GitHub issue.

### Contact
- **Email:** `adminsritelanganaruchulu@gmail.com`
- **Security Metadata (`security.txt`):** `https://sritelanganaruchulu.vercel.app/.well-known/security.txt`

### What to Include in Your Report
1. A clear description of the vulnerability and its potential impact.
2. Step-by-step instructions or a minimal proof-of-concept to reproduce the issue.
3. Affected URL(s), API endpoint(s), or source file(s).
4. Any suggested remediation or mitigation (optional).

### Response Timeline
- **Initial Acknowledgment:** Within **48 hours** of receiving the report.
- **Status Assessment & Triage:** Within **5 business days**.
- **Resolution & Patch Deployment:** Prioritized based on severity (critical issues patched immediately on `main`).

---

## Scope & Safe Harbor

### In Scope
- Storefront web application (`https://sritelanganaruchulu.vercel.app`)
- Serverless API endpoints (`/api/*`)
- Authentication, OTP verification, and session handling
- Checkout and payment verification workflows

### Out of Scope
- Denial of Service (DoS / DDoS) or automated high-volume rate-testing against production infrastructure
- Social engineering, phishing, or spam targeting staff or customers
- Vulnerabilities in third-party services outside our control (e.g., Vercel platform infrastructure, Razorpay hosted checkout)

Good-faith security researchers who follow this policy without accessing, modifying, or exfiltrating customer data will not face legal action regarding their research.

---

## Security Practices in This Repository
- **Transport & Browser Security:** Enforced HTTPS (`Strict-Transport-Security`), clickjacking protection (`X-Frame-Options: SAMEORIGIN`), MIME-sniffing protection (`X-Content-Type-Options: nosniff`), and strict referrer/permissions policies via `vercel.json` and `frontend/public/_headers`.
- **Stateless Cryptographic OTP:** One-Time Passwords use HMAC-SHA256 verification with short expiration windows (`10 minutes`) and timing-safe comparisons.
- **Secrets Management:** Environment variables (`.env`, `.env.*`), private keys, and credentials are excluded via `.gitignore` and configured through Vercel Environment Variables.
