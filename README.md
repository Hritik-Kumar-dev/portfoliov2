# Portfolio (React + Vite)

Built from the Figma frames (home, detailed view landscape/portrait).

```bash
npm install
npm run dev
```

## Make it yours

| What | Where |
| --- | --- |
| Name, bio, social links, resume path, certificate link | `src/data/profile.js` |
| Projects (title, category, description, images) | `src/data/projects.js` |
| Tech stack icons / layout | `src/data/tech.js` (+ SVGs in `src/assets/tech`) |
| Resume file | drop `resume.pdf` into `public/` |

Project images: set `thumb` (grid + list) and `media: [{ src, orientation }]` (detailed view gallery).
`orientation: 'portrait'` switches the preview to the tall frame from the design.

## Interactions

- Filter pill: All / Full Stack / UIUx
- `<<  1/2  >>` pages through 5 projects at a time
- Click a card or "Detailed view" to open the detailed view; Back or Esc returns
- Detailed view: pick a project on the left, dots or ← → move through its images
- The second "Download Resume" button in the design is used as the hover/focus state
