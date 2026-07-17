# Twin Brother — Sewing Machine Repair Website

A simple, responsive single-page website for Twin Brother sewing machine repair. Built with plain HTML, CSS, and JavaScript — no build tools required.

## Features

- Mobile-first responsive layout (phone, tablet, desktop)
- Hamburger navigation on mobile, horizontal nav on desktop
- Contact / repair request form with email delivery via [Web3Forms](https://web3forms.com) (free)
- hCaptcha spam protection, honeypot field, input limits, and submission cooldown

## Quick Start (Local)

Open `index.html` in your browser, or run a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Form Setup (Required)

### 1. Web3Forms access key

The access key in `index.html` is **public by design** — Web3Forms expects it in client-side code. It is not a secret API key; it routes submissions to your inbox. Protect it with hCaptcha (below), not by hiding it.

1. Go to [https://web3forms.com](https://web3forms.com)
2. Enter a **dedicated notification email** (e.g. `repairs@yourdomain.com`) — not your personal inbox
3. Copy the **access key** from the confirmation email
4. Paste it into `index.html`:

```html
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
```

### 2. Enable hCaptcha in Web3Forms dashboard (required)

The form includes an hCaptcha widget, but it only works after you enable it in the dashboard:

1. Log in to [Web3Forms dashboard](https://app.webforms.com)
2. Select your form
3. Open **Settings → Spam Protection**
4. Enable **hCaptcha** as the captcha provider
5. Save changes

Without this step, submissions may fail or spam protection will be weak.

### 3. Test the form

1. Fill out all required fields
2. Complete the hCaptcha challenge
3. Submit — you should receive an email within a minute

## Security Checklist

| Measure | Status |
|---------|--------|
| hCaptcha widget on form | Built in |
| hCaptcha enabled in Web3Forms dashboard | **You must enable manually** |
| Honeypot (`botcheck`) field | Built in |
| Input length limits | Built in (name 100, email 254, phone 20, machine 100, message 2000) |
| 60-second submission cooldown | Built in (per browser session) |
| HTTPS on GitHub Pages | Enable **Enforce HTTPS** after deploy |
| Dedicated notification inbox | **Recommended — set in Web3Forms** |

### Free tier limit

Web3Forms free plan allows **250 submissions per month**. Monitor usage in the dashboard. If you see spikes or abuse:

1. Rotate your access key in the Web3Forms dashboard
2. Update the key in `index.html`
3. Consider upgrading to Pro for **Restrict to Domain** (~$8/mo) once you have a custom domain

### GitHub Pages note

If the form works locally but fails on `*.github.io`, contact Web3Forms support with your live URL — some free subdomains require approval.

## Customize Contact Info

Update the placeholder details in `index.html`:

- Footer phone: `(555) 123-4567`
- Footer email: `info@twinbrother.com`
- Footer hours: `Mon–Fri: 9am–5pm`

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under **Build and deployment**, set:
   - Source: **Deploy from a branch**
   - Branch: `main` / `/ (root)`
4. Save — your site will be live at `https://<username>.github.io/TwinBrother/` within a few minutes
5. When available, enable **Enforce HTTPS**
6. Test the contact form on the live URL (not just localhost)

The `.nojekyll` file is included so GitHub Pages serves the site as plain static files.

## Custom Domain Cutover (when purchased)

No site rewrite needed — only DNS and GitHub settings change.

### Before you buy

The canonical URL placeholder is in `index.html`:

```html
<link rel="canonical" href="https://PLACEHOLDER_DOMAIN/">
```

Update this when your domain is live.

### Option A: www subdomain (recommended)

1. Create a file named `CNAME` in the repo root containing your domain:

```
www.yourdomain.com
```

2. Commit and push to `main`
3. GitHub **Settings → Pages → Custom domain** → enter `www.yourdomain.com` → Save
4. At your domain registrar, add a DNS record:
   - Type: `CNAME`
   - Name: `www`
   - Value: `<your-github-username>.github.io`
5. GitHub **Settings → Pages → Verify** domain (add TXT record if prompted — prevents domain takeover)
6. Wait up to 24 hours, then enable **Enforce HTTPS**
7. Update the `<link rel="canonical">` in `index.html` to `https://www.yourdomain.com/`
8. Test the contact form on the new domain

### Option B: Apex domain only (`yourdomain.com`)

1. Create `CNAME` file containing `yourdomain.com`
2. Add custom domain in GitHub Pages settings
3. At registrar, add four `A` records pointing `@` to:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
4. Verify domain, enable HTTPS, update canonical link, test form

### Option C: Both apex and www

Use apex `A` records plus a `www` CNAME. Set your preferred primary in the GitHub `CNAME` file (usually `www`). GitHub redirects between them automatically.

### Optional: Web3Forms Pro domain restriction

After cutover, upgrade to Web3Forms Pro and enable **Restrict to Domain** with your production domain(s). This blocks off-site API abuse even if someone copies your access key from GitHub.

During transition, both `github.io/TwinBrother` and your custom domain may work briefly — no downtime if you add DNS before removing anything.

## File Structure

```
index.html       # Main page
css/styles.css   # Responsive styles
js/nav.js        # Mobile menu toggle
js/form.js       # Form validation and submission handler
.nojekyll        # GitHub Pages config
CNAME            # Add when custom domain is purchased (not included yet)
```

## License

All rights reserved — Twin Brother.
