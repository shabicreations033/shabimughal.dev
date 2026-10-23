# Shabi Mughal — Portfolio
**Live Site:** [https://shabimughal.dev](https://shabimughal.dev)

A personal portfolio showcasing my journey as a Full Stack Software Engineer, technical skills, and projects. Designed with a minimalist aesthetic, it highlights my approach to software development, user experience, and building practical digital solutions for web and mobile platforms.

---

## ⚡ Overview & Architecture

* **Frontend:** React 18, Vite, React Router
* **Styling:** Custom CSS design system with dynamic variables (Light/Dark mode)
* **Architecture:** 100% static client-side single-page application (SPA) with zero backend/database dependencies
* **Contact Form:** Serverless integration via Web3Forms API with client-side honeypot spam protection
* **Hosting & CDN:** Deployed on Vercel's global edge network with custom DNS on `shabimughal.dev`

---

## 📁 Repository Structure

```text
client/
├── index.html                 # Entry HTML, SEO meta tags, OpenGraph cards
├── .env.example               # Environment template (VITE_WEB3FORMS_ACCESS_KEY)
├── vercel.json                # Single-page application route rewrites
├── public/                    # Static assets (images, certificates, resume PDF, sitemap)
└── src/
    ├── data/                  # Content data layer
    │   ├── profile.js         # Bio, skills, testimonials, external links
    │   ├── portfolioData.js   # Project records and routing helpers
    │   └── gallery.js         # Screenshots and media assets
    ├── lib/
    │   └── sendMessage.js     # Serverless form submission handler
    ├── components/            # Reusable UI components (buttons, inputs, cards)
    ├── pages/                 # Route views (Home, About, Projects, Contact)
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
   Outputs the compiled, optimized bundle to `client/dist`.

---

## 🚀 Deployment

The site is configured for continuous deployment on **Vercel**:
* **Root Directory:** `client`
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Routing:** Handled via `client/vercel.json` rewrites to support direct page refreshes.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).