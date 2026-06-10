# 🔒 Security Policy

## Supported Versions

Currently supported versions of Caffélino:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

We take the security of Caffélino seriously. If you discover a security vulnerability, please follow these steps:

### 1. **DO NOT** Create a Public Issue

Security vulnerabilities should not be publicly disclosed until they have been addressed.

### 2. Report Privately

Send details to: **security@caffelino.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Time

- We will acknowledge your report within **48 hours**
- We will provide a detailed response within **7 days**
- We will work on a fix and notify you of progress

### 4. Disclosure

- Once the vulnerability is fixed, we will:
  - Release a security patch
  - Credit you in the release notes (if you wish)
  - Publish a security advisory

---

## Security Best Practices

### For Users

1. **Keep Updated** - Always use the latest version
2. **Secure Credentials** - Never share your login details
3. **Strong Passwords** - Use strong, unique passwords
4. **Verify URLs** - Ensure you're on the official site
5. **Report Suspicious Activity** - Contact us immediately

### For Developers

1. **Environment Variables**
   - Never commit `.env` files
   - Never expose API keys in frontend code
   - Use environment variables for all secrets

2. **Dependencies**
   - Run `npm audit` regularly
   - Keep dependencies updated
   - Review security advisories

3. **Input Validation**
   - Validate all user inputs
   - Sanitize data before storage
   - Use parameterized queries

4. **Authentication**
   - Use secure session management
   - Implement proper logout
   - Use HTTPS only

5. **Data Protection**
   - Encrypt sensitive data
   - Follow GDPR guidelines
   - Minimize data collection

---

## Known Security Measures

### 1. Safe Storage Utility

Prevents localStorage errors in restricted environments:

```typescript
// Gracefully handles localStorage failures
import { safeStorage } from './utils/safeStorage';
safeStorage.setItem('key', 'value');
```

### 2. Row Level Security (RLS)

Supabase RLS policies ensure:
- Users can only access their own data
- Café owners can only manage their cafés
- Admins have limited permissions

### 3. Input Validation

All inputs are validated:
- Email format
- Phone number format
- Amount validation (no negatives)
- SQL injection prevention (via Supabase)

### 4. HTTPS Only

- All production deployments use HTTPS
- No sensitive data over HTTP
- Secure cookie flags enabled

### 5. Payment Security

- ₹20 token payments via secure gateway (Razorpay)
- No credit card details stored
- PCI DSS compliant payment flow

---

## Security Checklist

### Before Deployment

- [ ] Environment variables secured
- [ ] Debug mode disabled
- [ ] API keys rotated
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] RLS policies active
- [ ] Input validation implemented
- [ ] Authentication tested
- [ ] Error messages don't leak info
- [ ] Dependencies audited

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Run security audits
- [ ] Review access logs
- [ ] Rotate API keys quarterly
- [ ] Backup database
- [ ] Test disaster recovery
- [ ] Review user permissions

---

## Vulnerability Disclosure Policy

### Timeline

1. **T+0**: Vulnerability reported
2. **T+48h**: Acknowledgment sent
3. **T+7d**: Initial assessment complete
4. **T+30d**: Fix developed and tested
5. **T+45d**: Security patch released
6. **T+60d**: Public disclosure (if appropriate)

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| Critical | System compromise possible | 24-48 hours |
| High | Data breach possible | 3-7 days |
| Medium | Limited impact | 7-14 days |
| Low | Minimal risk | 14-30 days |

---

## Common Vulnerabilities

### Prevented

✅ **SQL Injection** - Supabase handles this
✅ **XSS** - React escapes by default
✅ **CSRF** - Token-based auth
✅ **Clickjacking** - X-Frame-Options set
✅ **localStorage Errors** - Safe storage wrapper

### Monitoring

We actively monitor for:
- Brute force attacks
- Unusual access patterns
- Failed login attempts
- API abuse
- Data exfiltration attempts

---

## Third-Party Security

### Supabase
- SOC 2 Type II certified
- ISO 27001 certified
- GDPR compliant
- Regular security audits

### Razorpay
- PCI DSS Level 1 certified
- 2048-bit SSL encryption
- Regular security audits

---

## Compliance

### GDPR Compliance

- Minimal data collection
- User consent required
- Right to be forgotten
- Data portability
- Privacy by design

### Data Retention

- User data: Until account deletion
- Payment records: 7 years (legal requirement)
- Logs: 90 days
- Backups: 30 days

---

## Contact

For security concerns:

- **Email**: security@caffelino.com
- **Response Time**: Within 48 hours
- **Encryption**: PGP key available on request

For general issues:
- **GitHub Issues**: https://github.com/yourusername/caffelino/issues
- **Email**: support@caffelino.com

---

## Acknowledgments

We appreciate responsible disclosure. Contributors who report valid security issues will be:

- Acknowledged in release notes (if desired)
- Credited in SECURITY.md
- Invited to test the fix

---

## Hall of Fame

Thanks to these security researchers:

<!-- Add security researchers who responsibly disclose vulnerabilities -->

---

<div align="center">
  <p>Security is a priority at Caffélino</p>
  <p>Made with ☕ and 🔒 by the Caffélino Team</p>
</div>
