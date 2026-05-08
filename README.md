# Fairmont × LoversAI

A private AI-powered platform that helps teams design luxury wedding and event concepts for Fairmont spaces.

## What this project does

This product helps a user:
- describe a design idea in plain language,
- optionally upload inspiration images,
- generate visual concepts for event spaces,
- save selected designs into a moodboard,
- export moodboards as PDF or PowerPoint files.

In short: it turns event ideas into polished visual drafts that can be shared with clients.

## Who this is for

- Event planners and wedding designers
- Hospitality and venue teams
- Brand and creative teams preparing client proposals

## How the experience works (simple flow)

1. Open the platform
2. Choose venue/event options
3. Add a prompt (and optional reference images)
4. Generate design visuals
5. Save the best outputs to a moodboard
6. Export and share as PDF/PPT

## Main parts of the repository

- `frontend/` → User-facing web application
- `backend/` → API layer for generation, moodboard storage, and export
- `backend/data/templates/` → Downloadable template assets
- `design_guidelines.json` → Visual style rules for the product

## Key capabilities currently available

- AI image generation for venue/event concepts
- Moodboard creation and image management
- PDF export
- PowerPoint export
- Template listing and download APIs

## Technology (high level)

- **Frontend:** React-based web app
- **Backend:** Python FastAPI service
- **AI Integration:** FLUX image generation API
- **Optional Database:** MongoDB for moodboard persistence

## Environment requirements

To run locally, you need:
- Node.js and npm (for frontend)
- Python 3.x (for backend)
- Environment variables for API keys and service URLs (see backend `.env` usage)

## Local run commands (for developers)

### Frontend
```bash
cd frontend
npm start
```

### Backend
```bash
cd backend
uvicorn server:app --reload
```

## Important note on access and usage

This repository is private and not licensed for public use, copying, modification, or redistribution.

## Project status

The core flow (generate → moodboard → export) is implemented and usable.
