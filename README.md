# Shabi Mughal: Portfolio

Live at **[shabimughal.dev](https://shabimughal.dev)**.

A static portfolio built with **React 18, Vite and React Router**. There is no backend or database.

- **Content:** your bio, skills, certifications and testimonials are in `client/src/data/profile.js`. Every project is in `client/src/data/portfolioData.js`. Edit a file and the site updates on the next build.
- **Contact form:** the form posts straight from the browser to [Web3Forms](https://web3forms.com), which emails the message to you.

## Structure

```
client/
  index.html                 page title, description, link-preview tags, structured data
  .env.example               VITE_WEB3FORMS_KEY (copy to .env)
  public/                    images, certificates, resume PDF, favicon,
                             og-image.png, sitemap.xml, robots.txt, _redirects
  src/
    data/
      profile.js             bio, skills, services, certifications, testimonials, links
      portfolioData.js       all projects (+ getProjectBySlug / getNeighbors helpers)
      gallery.js, covers.js  project screenshots and cover images
    lib/sendMessage.js       contact form -> Web3Forms
    components/, hooks/, pages/, index.css
```

## Run it

```bash
cd client
npm install
cp .env.example .env     # then paste your Web3Forms access key
npm run dev              # http://localhost:5173
npm run build            # production build in client/dist
```

## Contact form setup

1. Go to https://web3forms.com, enter the email where you want messages, and copy the access key they send you.
2. Put it in `client/.env` as `VITE_WEB3FORMS_KEY=...`.
3. On your host (Netlify, Vercel, Cloudflare Pages), add the same variable in the environment settings and redeploy. The `.env` file is not uploaded.

The key is public by design, since it can only send mail to you. A hidden honeypot field filters out simple bots.

## Adding a project

Add an entry to the array in `client/src/data/portfolioData.js`. Copy an existing one and give it a unique `slug` and an `order`. Add a cover in `data/covers.js` and screenshots in `data/gallery.js` if you have them. Then add the new `/projects/<slug>` address to `public/sitemap.xml`.

## Deploying

Any static host works. The build command is `npm run build` and the publish folder is `client/dist`. The site uses client-side routes, so the host needs a single-page-app fallback. Netlify reads `public/_redirects` (`/* /index.html 200`) and Vercel does this on its own.

## Search and link previews

`index.html` holds the title, description, Open Graph and Twitter tags and the structured data. Preview image: `public/og-image.png` (1200x630). If you change the domain, update the URLs in `index.html`, `public/sitemap.xml` and `public/robots.txt`.
