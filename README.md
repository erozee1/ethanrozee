# ethanrozee.com

Personal portfolio site. GitHub-style profile layout with a PostHog-inspired design system.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS**
- **GitHub API** — live activity feed and contribution graph

## Development

```bash
npm install
npm run dev
```

## GitHub Integration

The contribution graph and activity feed pull live data from the GitHub API.

Add a token to `.env.local` to unlock the contribution graph and exact commit counts:

```
GITHUB_TOKEN=your_token_here
```

Create a token at [github.com/settings/tokens](https://github.com/settings/tokens) with `read:user` scope. Both components fall back gracefully without one.

## Content

All content lives in `src/data/` — edit there to update copy, links, and work cards without touching components.
