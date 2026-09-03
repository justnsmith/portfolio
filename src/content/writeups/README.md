# Adding a writeup

Drop a `.md` file in this folder. The filename becomes the URL, so `foo.md`
publishes at `/writeups/foo`, and the entry shows up on the Writeups page and
in the Writeups section on the home page. There is nothing to register.

Start the file with a frontmatter block:

```markdown
---
title: The headline, in sentence case
date: February 2026
sort: 2026-02
summary: One or two sentences. Shown on the index and in the section on the home page.
tags: C++20, Raft, LSM-tree
project: distributed-kv-store
repo: https://github.com/justnsmith/KVRaft
---

Body starts here.
```

| Key | Required | Notes |
| --- | --- | --- |
| `title` | yes | Falls back to the filename |
| `sort` | yes | `YYYY-MM`. Orders the list, newest first |
| `date` | no | How the date is displayed |
| `summary` | no | Shown on the index; keep it under ~40 words |
| `tags` | no | Comma-separated |
| `project` | no | An `id` from `src/data/projects.ts`. Links the two together, and adds a "Writeup" link to that project |
| `repo` | no | Shown as a "Source" link in the writeup header |

Reading time is computed from the body, so don't set it.

## Markdown supported

Headings `#` through `####`, paragraphs, `-` and `1.` lists, fenced code
blocks, blockquotes, `---` rules, pipe tables, and inline `**bold**`,
`*italic*`, `` `code` ``, and `[links](https://example.com)`.

Not supported, by design: nested lists, raw HTML, reference-style links,
footnotes. The renderer is `src/components/ui/Markdown.tsx`: about 200 lines,
no dependency, and no `dangerouslySetInnerHTML`, so a writeup can never inject
markup into the page.

Use `##` for the main sections; those become the anchored headings.

## Publishing somewhere else

For a piece published offsite, skip the Markdown file and add an entry to the
`elsewhere` array in `src/data/writeups.ts` with a `url` and a `source`. It is
listed alongside the rest and links straight out.
