# Bloody Others

Mobile-first browser build of **Bloody Others**, an interactive psychological thriller built with plain HTML, CSS, and JavaScript.

## Live concept

- 42 scene story structure
- 7 unlockable endings
- persistent local save data
- ending gallery for tracking discovered endings
- mobile-focused menu and gameplay layout
- secret post-ending epilogue content

## Inspiration

Inspired by **The Society of Others** by **William Nicholson**.

## Project structure

- [index.html](C:/Users/USER/VSCode Source Files 2026/Bloody Others (Game)/index.html) - app shell
- [style.css](C:/Users/USER/VSCode Source Files 2026/Bloody Others (Game)/style.css) - styling and responsive layout
- [js/](C:/Users/USER/VSCode Source Files 2026/Bloody Others (Game)/js) - game logic, scenes, endings, state, combat
- [assets/images/](C:/Users/USER/VSCode Source Files 2026/Bloody Others (Game)/assets/images) - poster and scene art assets

## Running locally

Open [index.html](C:/Users/USER/VSCode Source Files 2026/Bloody Others (Game)/index.html) in a browser.

## Publishing to GitHub Pages

This project is static, so it can be published directly with GitHub Pages.

Typical setup:

1. Create a GitHub repository for this folder.
2. Push the contents of this project to the repository.
3. In GitHub, open **Settings -> Pages**.
4. Set the source to the branch you want to publish from.
5. Use the repository root as the published folder.

## Notes

- save data is stored in the browser with `localStorage`
- no build step is required
- designed primarily for phone-sized screens
