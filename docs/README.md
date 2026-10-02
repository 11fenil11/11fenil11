# Portfolio site

Source for **https://11fenil11.github.io/11fenil11/**, a Jekyll site that GitHub Pages builds straight from this `docs/` folder. The profile `README.md` at the repo root is untouched.

## Go live (one time)

1. Merge this branch into `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder: `/docs` → Save**.
3. After about a minute the site is live at https://11fenil11.github.io/11fenil11/.

## Edit the content

Every word on the site comes from `_data/`. Edit a file on github.com, commit, and Pages rebuilds in about a minute.

| File | What it controls |
| --- | --- |
| `profile.yml` | Name, headline, intro, links, the "open to roles" badge, stats, contact section |
| `experience.yml` | Work history, kept high level on purpose (no resume bullets, metrics or client names) |
| `education.yml` | Degrees |
| `projects.yml` | Project cards. `placement: featured` or `selected` puts a project on the home page |
| `categories.yml` | Filter tabs on `/projects/` |
| `awards.yml` | Awards, hackathons and competitions |
| `timeline.yml` | Dated highlights (supports `**bold**`) |
| `skills.yml` | Toolbox |
| `overview.yml` | The "engineering overview" principles and stack diagram |

Common changes:

- **Hide the "Open to senior & staff roles" badge:** set `availability.show: false` in `profile.yml`.
- **Change the photo:** replace `assets/img/fenil.jpg` (square, at least 460 px).
- **Add a project:** copy an entry in `projects.yml`; give it one or more `categories`.

## Preview locally

```bash
cd docs
bundle install
bundle exec jekyll serve      # http://localhost:4000/11fenil11/
```

## Link-preview image

`assets/img/social-card.png` is the card LinkedIn, Slack and iMessage show for the link. After changing the name, title or photo, regenerate it (and the PNG favicons) with `node tools/render-assets.mjs` (needs Playwright).

## Shorter URL or custom domain

- **https://11fenil11.github.io/**: create a repo named `11fenil11.github.io`, copy this folder's contents to its root, and set `baseurl: ""` in `_config.yml`.
- **Custom domain** (e.g. `fenilparmar.dev`): add it under Settings → Pages, then set `url` to the domain and `baseurl: ""`.

## Credits

Design adapted from Wanglong Lu's homepage ([longlongaaago.github.io](https://longlongaaago.github.io/)), which is built on AcademicPages / Minimal Mistakes (MIT). GitHub, LinkedIn and LeetCode icons are from [Simple Icons](https://simpleicons.org/) (CC0).
