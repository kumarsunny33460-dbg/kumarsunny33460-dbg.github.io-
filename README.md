# Sunny Kumar — Portfolio

A modern, single-page developer portfolio built with **HTML5, CSS3 and vanilla JavaScript**.
No frameworks, no build step, no dependencies — open `index.html` and it works.

---

## Highlights

| Feature | Details |
|---|---|
| **Design** | Dark-first aurora/mesh gradient theme with glassmorphism cards, plus a full light theme |
| **Projects** | Only the **four repositories pinned** on the GitHub profile, each with live demo + source links |
| **Skills** | Six filterable categories with animated proficiency bars and brand-coloured tech icons |
| **Sections** | Hero · About · Skills · Projects · Experience · GitHub · Contact · Footer |
| **Interactions** | Typewriter role rotator, scroll-triggered reveal, animated counters, 3D card tilt, cursor spotlight, dual marquee, scroll-spy nav, reading-progress bar, skill filters, theme toggle, back-to-top, toast notifications |
| **Accessibility** | Semantic landmarks, `aria-label`/`aria-hidden` on icon-only controls, visible focus rings, `prefers-reduced-motion` support, printable stylesheet |
| **Responsive** | Mobile-first breakpoints at 1080 / 960 / 820 / 560 px with an off-canvas mobile menu |
| **Performance** | Zero runtime dependencies, local SVG icons, `preconnect` to the font CDN, lazy-free single request chain |

---

## Structure

```
My Portfolio/
├── index.html            # markup for every section
├── css/
│   └── style.css         # design tokens, layout, components, animations, responsive rules
├── js/
│   └── main.js           # all interactivity (no dependencies)
└── assets/
    ├── profile.png       # profile photo (443 × 443)
    └── icons/            # 70+ brand SVGs (Simple Icons), colour-corrected for both themes
```

---

## Run locally

Open `index.html` directly, or serve the folder for a production-like experience:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then visit <http://localhost:8000>.

---

## Deploy

The site is fully static — any static host works.

**GitHub Pages**

```bash
git init
git add .
git commit -m "Portfolio: initial commit"
git branch -M main
git remote add origin https://github.com/kumarsunny33460-dbg/<repo>.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: `main` / `root` → Save**.

**Netlify / Vercel / Cloudflare Pages**

Set the build command to *(none)* and the publish directory to the repository root.

---

## Customising

| What | Where |
|---|---|
| Name, tagline, copy | `index.html` — search for `Sunny Kumar` |
| Projects (pinned only) | `index.html` — the `projects` section, one `<article class="proj">` per repo |
| Live demo / source URLs | `index.html` — `proj__links` anchors |
| Skill percentages | `index.html` — `style="--w:NN%"` on each `.skill__bar i` |
| Internship timeline | `index.html` — the `timeline` section |
| Contact email | `index.html` (`mailto:` links) **and** `js/main.js` (`const EMAIL`) |
| Colours & spacing | `css/style.css` — the `:root` token block at the top |
| Theme behaviour | `js/main.js` — `applyTheme()` / the `themeToggle` handler |

### Contact form

The form is backend-free: it validates in the browser and then opens the visitor's mail
client with the message pre-filled. To use a hosted form service instead, point the
`<form>` at it and swap the submit handler in `js/main.js`:

```html
<form class="contact__form" action="https://formspree.io/f/YOUR_ID" method="POST">
```

---

## Content source

Everything below is taken from the public GitHub profile
[`kumarsunny33460-dbg`](https://github.com/kumarsunny33460-dbg):

- **Pinned projects** — `CloudPulse`, `CodeAlpha_SQLInjectionDetection` (SQLShield),
  `CodeAlpha_DataRedundancyRemovalSystem`, `CodeAlpha_CloudBasedChatbot`
- **Languages** — Python, JavaScript, HTML5, CSS3, SQL, Java, C/C++
- **Stack** — Flask, SQLAlchemy, Docker, Kubernetes, Helm, Terraform, AWS, GitHub Actions,
  Prometheus, Grafana, MongoDB Atlas, PostgreSQL, Terraform, TensorFlow, PyTorch, Hugging Face
- **Internships** — CodeAlpha (Cloud Computing), Prodigy Infotech (AI), CodSoft (Python)
- **Profile photo** — the GitHub avatar, stored locally as `assets/profile.png`

---

## License

MIT — free to use and adapt. Brand icons are from [Simple Icons](https://simpleicons.org) (CC0).
