# Mobile Capture (Phase 2 MVP)

Mindwtr Mobile now includes a lightweight capture screen at `/capture`.

## Deep‑link capture

You can open the capture modal with a URL like:

`mobile://capture?text=<url-encoded text>`

The screen pre‑fills the text and lets you confirm before adding to Inbox.  
It supports the same quick‑add syntax as desktop (`/due:…`, `/note:…`, `@context`, `#tag`, `+Project`).

## Share‑sheet integration (next)

Native share‑sheet receiving requires a platform share‑intent/extension library.
We will wire incoming shares to the `/capture` screen in a later Phase‑2 iteration.

## Home widget (optional)

Widgets are planned as an optional enhancement after share‑sheet capture.
The target is a small “+ Inbox” widget that opens `/capture`.

