# Guided Childhood

**The OS for Modern Parenting**

guidedchildhood.co.uk

---

## What this is

The pre-launch homepage for Guided Childhood — the only platform that guides
children through every stage of digital life from age 4 to 16.

Built by Justin Phillips, The Social Billboard.

---

## Files

- `index.html` — the complete homepage
- `vercel.json` — Vercel deployment configuration
- `README.md` — this file

---

## How to deploy

This site is automatically deployed to Vercel on every commit to main.

To make changes:
1. Edit `index.html` directly in GitHub
2. Commit changes
3. Vercel redeploys automatically within 60 seconds

---

## Mailchimp setup

Before going live, update these three constants in `index.html`:

```javascript
const MC_URL  = 'https://YOUR_SUBDOMAIN.us1.list-manage.com/subscribe/post-json';
const MC_U    = 'YOUR_MAILCHIMP_U';
const MC_ID   = 'YOUR_MAILCHIMP_LIST_ID';
```

Find these values in Mailchimp under:
Audience → Signup Forms → Embedded Forms → Generate Code

---

## Domain

Primary: guidedchildhood.co.uk
Defensive: guidedchildhood.com

DNS records (add at 123-reg):
- Type: A    Name: @    Value: 76.76.21.21
- Type: CNAME Name: www  Value: cname.vercel-dns.com

---

## Contact

Justin Phillips
The Guided Digital Pathway
hello@guidedchildhood.co.uk
