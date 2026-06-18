# PicLight — Frontend

Single-page web app for storing and sharing photos: users register, log in, search for other users, and browse photo galleries in a modal lightbox. This repository holds the **React 18 + TypeScript** client; it talks to a separate backend API.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)

---

## Features

- **JWT authentication** with automatic token refresh and **role-based access**.
- **User search** to find other people on the platform.
- **Photo galleries** with a **modal lightbox** for full-size viewing.
- **Robust forms** validated with React Hook Form + Zod.
- **Component-scoped styling** via CSS Modules.
- **Production-ready delivery**: multi-stage Docker build served through Nginx, deployed automatically via GitHub Actions.

## Tech stack

| Area | Technologies |
|------|--------------|
| Framework | React 18, TypeScript |
| Build tool | Vite |
| Routing | React Router |
| Forms / validation | React Hook Form, Zod |
| Styling | CSS Modules |
| Container / serving | Docker (multi-stage), Nginx |
| CI/CD | GitHub Actions → AWS ECR → EC2 (over SSH) |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/)
- A running instance of the PicLight backend API

### Run locally

```bash
# 1. Clone
git clone https://github.com/Iwakuraa7/PicLight-Frontend.git
cd PicLight-Frontend

# 2. Install dependencies
npm install

# 3. Configure the API URL
#    Create a .env file in the project root:
#    VITE_API_URL=http://localhost:5000   # TODO: confirm the exact env var name used in the code

# 4. Start the dev server
npm run dev
```

Vite will serve the app at `http://localhost:5173` by default.

### Build for production

```bash
npm run build      # outputs static files to /dist
npm run preview    # preview the production build locally
```

## Deployment

The app ships as a **multi-stage Docker image**: the first stage builds the static bundle, the second serves it with **Nginx** (see `Dockerfile` and `nginx.conf`).

```bash
docker build -t piclight-frontend .
docker run -p 8080:80 piclight-frontend
# TODO: confirm the exposed port in nginx.conf / Dockerfile and update if needed.
```

**CI/CD:** on every push to `main`, the GitHub Actions workflow (`.github/workflows`) builds the Docker image, pushes it to **AWS ECR**, and deploys it to an **AWS EC2** instance over SSH.

## Project structure

```
PicLight-Frontend/
├── .github/workflows/   # CI/CD pipeline
├── public/              # static assets
├── src/                 # app source
├── components/          # reusable UI components
├── pages/               # route-level pages
├── styles/              # CSS Modules
├── Dockerfile           # multi-stage build
├── nginx.conf           # production web server config
└── vite.config.ts
```

## Contact

**Erlan Esengeldiev** — Frontend / Fullstack (React, TypeScript)
GitHub: [@Iwakuraa7](https://github.com/Iwakuraa7) · Telegram: [@iw4kvra](https://t.me/iw4kvra) · erlanesengeldiev7@gmail.com
