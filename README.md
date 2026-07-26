# Networking Foundations

This repository contains the source for [Networking Foundations](https://networking-foundations-guide.netlify.app), a free networking guide built with Astro and Starlight.

> **Looking for the guide?** [Read Networking Foundations online](https://networking-foundations-guide.netlify.app). You do not need to clone or build this repository.

**Work in progress**
This guide is still a work in progress. I will continue reviewing and updating it as time permits. If you find an error or have an idea that could improve it, feedback and suggestions are welcome through [GitHub Issues](https://github.com/mblackonline/networking-foundations-guide/issues).

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
