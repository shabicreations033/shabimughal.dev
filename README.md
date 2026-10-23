# Shabi Mughal — Portfolio

A fully static portfolio built with **React 18 + Vite + React Router**. There is no backend or database:

- **Content:** your bio, skills, certifications and testimonials are in `client/src/data/profile.js`; every project is in `client/src/data/portfolioData.js`. Edit the file and the site updates.
- **Contact form:** submitted straight from the browser to [Web3Forms](https://web3forms.com), which emails the message to you.

## Structure

```
client/
  index.html
  .env.example               VITE_WEB3FORMS_KEY (copy to .env)
  public/                    images, certificates, resume PDF, favicon
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

## Contact form setup (2 minutes)

1. Go to https://web3forms.com, enter the email where you want messages, and copy the access key they send you.
2. Put it in `client/.env` as `VITE_WEB3FORMS_KEY=...`.
3. When you deploy (Netlify, Vercel, GitHub Pages, ...), add the same variable in the host's environment settings, then redeploy.

The key is public by design (it can only send mail to you), and a hidden honeypot field filters out simple bots.

## Adding a project

Add an entry to the array in `client/src/data/portfolioData.js` (copy an existing one, give it a unique `slug` and an `order`). Optionally add a cover in `data/covers.js` and screenshots in `data/gallery.js`.

## Deploying

Any static host works: build command `npm run build`, publish folder `client/dist`. Because the site uses client-side routes, enable the host's single-page-app fallback (Netlify: a `_redirects` file with `/* /index.html 200`; Vercel does this automatically).
