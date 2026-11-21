# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Frozen Fit game screen

- `/game` shows the webcam full-screen, a countdown timer (top-right) and a big snowflake (bottom-left).
- Press **Start!** → a random outline from `src/game/outlines.js` appears, the timer counts down, and a snapshot is taken at 0.
- Change round length with `ROUND_SECONDS` in `src/pages/GamePage.jsx`.
- Add your own art to `src/assets/` as `snowflake.png` and `timer.png` (png/svg/webp/jpg). Placeholders show until then.
- Font: **Snow Kei** (`src/assets/SnowKei.ttf`) is personal-use only; buy a commercial license before commercial release.
