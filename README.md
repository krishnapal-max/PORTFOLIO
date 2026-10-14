# Krishna Pal — Cinematic Portfolio

## Start on Windows
1. Install Node.js LTS if it is not already installed.
2. Copy `.env.example` to `.env` and set a long unique `ADMIN_PASSWORD`.
3. In PowerShell, run:
   ```powershell
   npm.cmd install
   npm.cmd run dev
   ```
4. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

The `dev` command runs both the Vite frontend and the Express API. The API runs on port 8787 and the Vite dev server proxies `/api` and `/uploads` to it.

## Deploy on Render
1. Push this repository to GitHub and connect `krishnapal-max/PORTFOLIO` to Render as a Blueprint.
2. Review the `render.yaml` service and disk plan before applying it. This full-stack setup uses a paid web-service plan and a persistent disk; confirm Render's current pricing before creating the service.
3. Render generates `ADMIN_PASSWORD` for the deployed service. Set or rotate it in the Render dashboard, then open `/admin` on your deployed site to manage projects and About content.

The Express server serves the built frontend and API from one service. Set `STORAGE_DIR` to a persistent disk mount so project/About edits and uploaded images survive deployments and restarts. The Render blueprint mounts a 1 GB disk at `/var/data`.

## Admin
Open `/admin`, enter the password from `.env`, then use:
- **Projects** to add/edit/delete projects, upload a cover image, and publish/draft projects.
- **Edit About** to update the About heading, biography, skills and image.

Locally, project/About content is persisted in `server/data/content.json` and uploaded images are stored in `server/data/uploads`. Back up this folder before moving the project. On Render, both use the persistent storage directory configured above.

## Implemented interactions
- Cursor-controlled circular reveal: masked generated character is the default; the final unmasked generated frame is revealed under the cursor.
- Six interactive 3D scenes: car driving, endless runner, 3D Tic-Tac-Toe, 3D chess (robot/local friend), space shooter and physics playground.
- Separate generated project/game cover images.

## Notes
The mask reveal uses a generated 24-frame storyboard, with the first frame as masked artwork and the last frame as the unmasked artwork. Because these are storyboard crops rather than a professionally registered 3D character rig, slight alignment differences can remain. Chess rules use `chess.js`; robot mode uses a lightweight legal-move opponent. The contact form remains a frontend preparation/copy flow until an email provider is configured.
