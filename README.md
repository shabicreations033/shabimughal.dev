# Shabi Mughal — Portfolio

**Live Site:** [https://shabimughal.dev](https://shabimughal.dev)

A personal portfolio showcasing my journey as a Full Stack Software Engineer, technical skills, and projects. Designed with a minimalist aesthetic, it highlights my approach to software development, user experience, and building practical digital solutions for web and mobile platforms.

---

## ⚡ Overview & Architecture

* **Frontend:** React 18, Vite, React Router
* **Styling:** Custom CSS design system with dynamic variables (Light/Dark mode)
* **Architecture:** Static client-side React app with zero backend/database dependencies. Every page is pre-rendered to plain HTML at build time, so crawlers and first paint get real content
* **Theme Switch:** Light/Dark toggle with a WebGL ink animation that spreads from the button (View Transitions API). Phones play the same ink from a pre-rendered sprite sheet, with canvas and polygon fallbacks for browsers without support. Reduced-motion visitors get an instant switch
* **SEO:** Per-page titles, canonical URLs, OpenGraph/Twitter cards, JSON-LD structured data (Person, WebSite, BreadcrumbList, CreativeWork), `sitemap.xml` with images, `robots.txt`, and `llms.txt`, all generated at build time
* **Performance:** AVIF/WebP responsive images with `srcset`, self-hosted fonts, lazy-loaded project pages, and long-lived cache headers
* **Contact Form:** Serverless integration via Web3Forms API with client-side honeypot spam protection
* **Hosting & CDN:** Deployed on Vercel's global edge network with custom DNS on `shabimughal.dev`

---

## 📁 Repository Structure

```text
client/
├── index.html                 # HTML template (SEO and app markers filled in at build time)
├── vercel.json                # Clean URLs, security headers, cache headers
├── vite.config.js             # Vite configuration
├── scripts/
│   └── prerender.mjs          # Writes one HTML file per route, plus 404, sitemap.xml, llms.txt
├── public/                    # Static assets (hero photos, project covers, certificates, fonts, icons, resume PDF, robots.txt)
└── src/
    ├── main.jsx               # Browser entry
    ├── entry-server.jsx       # Build-time render entry used by the prerender script
    ├── App.jsx                # Routes
    ├── data/                  # Content data layer
    │   ├── profile.js         # Bio, skills, certificates, testimonials, external links
    │   ├── portfolioData.js   # Project records and routing helpers
    │   ├── covers.js          # Project cover image variants
    │   └── gallery.js         # Screenshots and media assets
    ├── lib/
    │   ├── sendMessage.js     # Serverless form submission handler
    │   ├── schema.js          # JSON-LD structured data builders
    │   ├── heroImage.js       # Theme-aware hero photo selection and preloading
    │   ├── inkShader.js       # WebGL ink for the theme switch (live on desktop, sprite sheet on phones)
    │   ├── inkReveal.js       # Canvas fallback when WebGL2 is missing
    │   ├── inkPolygon.js      # Polygon fallback for phones
    │   └── inkCover.js        # Fallback for browsers without View Transitions
    ├── hooks/                 # useTheme, useReveal, useSmoothScroll
    ├── components/            # Reusable UI (Header, Footer, ThemeToggle, ContactCard, CertCarousel, Seo, ...)
    ├── pages/                 # Route views (Home, About, Projects, ProjectDetail, Services, Contact)
    └── index.css              # Global styles and theme variable definitions
```

---

## 🛠️ Local Development

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shabicreations033/shabimughal.dev.git
   cd shabimughal.dev/client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `client/` folder:
   ```bash
   cp .env.example .env
   ```
   Add your Web3Forms access key:
   ```env
   VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```
   This runs three steps: the normal client build, a server-side build of the pages, and the prerender script. The output goes to `client/dist` with one HTML file per route.

6. **Preview the production build:**
   ```bash
   npm run preview
   ```

---

## 🚀 Deployment

The site is configured for continuous deployment on **Vercel**:
* **Root Directory:** `client`
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Routing:** Pre-rendered pages are served with clean URLs (`/about`, `/projects/...`) through `client/vercel.json`, and unknown paths return a real `404` page.
* **Headers:** Security headers and long-lived cache rules for static assets are set in `client/vercel.json`.

---

## 🙏 Credits

* The WebGL ink shader for the theme switch is adapted from the MIT-licensed work by Codemure.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
