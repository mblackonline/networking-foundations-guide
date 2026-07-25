# Networking Foundations

This repository contains the source code for a beginner-friendly, vendor-agnostic networking guide for people interested in information technology (IT) support, system administration, DevOps, software development, or cybersecurity.

**If you want to follow the guide, you don't need anything in this repository. Read it on the website.**

Everything below is only for developing the website itself.

---

## Site development

The site is built with [Astro Starlight](https://starlight.astro.build/) and deploys automatically to Netlify on every push to `main`.

### Local preview

Requires Node.js 20+.

```
npm install
npm run dev
```

The site runs at http://localhost:4321

### Content

Guide content lives in `src/content/docs/` as Markdown. Sidebar order is set in `astro.config.mjs`.

## License

MIT. See [LICENSE](LICENSE).
