# Manual Posts

Manual posts let you add any milestone to the homepage contribution timeline that wouldn't otherwise appear there — GitHub, Substack, Medium, LinkedIn, and research publications are all automatic, but things like hackathon wins, job updates, conference talks, and product launches need to be added here by hand.

## How to add a post

1. Open `index.ts` in this folder
2. Add a new object to the `manualPosts` array — use `template.json` as your field reference
3. Save — the post will appear in the timeline on next build/reload, sorted by `date` alongside all other activity

## Fields

| Field      | Required | Type                                                        | Description                                           |
|------------|----------|-------------------------------------------------------------|-------------------------------------------------------|
| `id`       | ✓        | string                                                      | Unique slug. Use kebab-case, e.g. `"hackmit-2025-win"` |
| `title`    | ✓        | string                                                      | Headline shown above the card, e.g. `"Won 1st at HackMIT 2025"` |
| `date`     | ✓        | ISO 8601 string                                             | `"YYYY-MM-DD"`. Controls timeline placement.          |
| `type`     | ✓        | `"achievement"` `"career"` `"project"` `"event"` `"announcement"` | Controls the badge colour on the card.       |
| `excerpt`  | ✓        | string                                                      | 1–2 sentence description shown in the card body.      |
| `url`      | ✗        | string                                                      | Optional link — article, tweet, company page, demo, etc. Title becomes a clickable link. |
| `imageUrl` | ✗        | string                                                      | Optional thumbnail shown in the card (48×48, cropped). |

## Type reference

| Type           | Badge colour | Use for                                              |
|----------------|-------------|------------------------------------------------------|
| `achievement`  | Yellow      | Award, competition win, certification, ranking       |
| `career`       | Blue        | New job, promotion, internship, collaboration        |
| `project`      | Green       | Launched product, shipped feature, open sourced repo |
| `event`        | Red         | Conference talk, demo day, workshop, hackathon       |
| `announcement` | Grey        | General news that doesn't fit the above              |

## Example

```ts
{
  id: "hackmit-2025-win",
  title: "Won 1st Place at HackMIT 2025",
  date: "2025-10-12",
  type: "achievement",
  excerpt: "Built an AI-powered debris tracking tool over 24 hours and took first place out of 200 teams.",
  url: "https://devpost.com/...",
  imageUrl: "https://...",
},
```

## Notes for agents

- `id` must be unique across all entries in `index.ts`. Use the pattern `"{event-name}-{year}"`.
- `date` is used for sorting — use the actual event/announcement date, not the date you're writing the post.
- Keep `excerpt` under 200 characters so it renders cleanly in the collapsed card body.
- Never put HTML in any field — all fields are rendered as plain text.
- If you're unsure of the type, use `"announcement"`.
