# Afzaan Mandi Restaurant website

Cinematic black-and-gold 3D website (Three.js hero, GSAP animations). Plain HTML/CSS/JS, no build step.

## Structure
- `index.html` page markup and SEO tags
- `css/styles.css` styling
- `js/config.js` **edit this to update the site**: phone, WhatsApp, email, address, hours, Google Maps links, social links, menu, photos
- `js/main.js` animations, 3D scene, cart, forms
- `images/` your photos (see `images/README.md`)

## Deploy on GitHub Pages
1. Create a repository and upload everything in this folder (so `index.html` is at the repository root).
2. Settings > Pages > Source: **Deploy from a branch**, Branch: `main`, folder `/ (root)`, Save.
3. The site appears at `https://<username>.github.io/<repository>/` after a minute.

## Before going live
- Fill in `js/config.js`. Anything left empty shows a placeholder. Do not publish invented prices or details.
- Set `whatsapp` or `email` so reservation, contact and order requests can be sent (the site has no server).
- Add real photos; until then dish visuals are 3D renderings generated in the browser.
- Three.js and GSAP load from public CDNs, so visitors need an internet connection.

Test locally: `python3 -m http.server` in this folder, then open http://localhost:8000.
