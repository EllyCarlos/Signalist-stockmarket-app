<div align="center">

<img src="https://signalist-stockmarket-app.vercel.app/assets/icons/logo.svg" alt="Signalist Logo" width="80" />

# Signalist

**Track real-time stock prices, get personalized alerts, and explore detailed company insights.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-signalist.vercel.app-4ade80?style=flat-square&logo=vercel)](https://signalist-stockmarket-app.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47a248?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

![Signalist Dashboard](https://signalist-stockmarket-app.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fdashboard.png&w=1920&q=75)

</div>

---

## Overview

Signalist is a full-stack stock market tracking application that helps investors cut through the noise and focus on what matters — the signal. It provides live stock price monitoring, user-configurable price alerts delivered by email, and rich company insights, all behind a clean, authenticated dashboard.

> *"The signal is the truth; the noise is the ego's attempt to rewrite it."*

## Features

- **Real-Time Stock Tracking** — Monitor live stock prices and market data from one unified dashboard.
- **Personalized Price Alerts** — Set custom alert thresholds; get notified by email the moment a target is hit, powered by background jobs via Inngest.
- **Company Insights** — Explore detailed profiles and financial summaries for any tracked company.
- **Secure Authentication** — Cookie-based session auth with sign-up, sign-in, and protected routes via `better-auth`.
- **Email Notifications** — Transactional alerts sent reliably through Nodemailer.
- **Dark / Light Mode** — Theme switching powered by `next-themes`.
- **Command Palette** — Quickly jump between stocks and pages via a keyboard-accessible command menu (`cmdk`).
- **Responsive UI** — Built with Radix UI primitives and Tailwind CSS for a polished experience on any screen size.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Components | shadcn/ui · Radix UI · Lucide React |
| Styling | Tailwind CSS v4 |
| Database | MongoDB · Mongoose |
| Authentication | better-auth |
| Background Jobs | Inngest |
| Email | Nodemailer |
| Forms | React Hook Form |
| Notifications | Sonner |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

## Project Structure

```
signalist-stockmarket-app/
├── app/               # Next.js App Router — pages, layouts, API routes
├── components/        # Reusable UI components
├── database/          # Mongoose models and DB connection
├── hooks/             # Custom React hooks
├── lib/               # Utility functions, auth config, Inngest functions
├── public/assets/     # Static images and icons
├── types/             # Shared TypeScript type definitions
├── proxy.ts           # Auth middleware (session-based route protection)
├── next.config.ts     # Next.js configuration
└── components.json    # shadcn/ui component registry config
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- An SMTP provider for email (e.g. Gmail, Resend, SendGrid)
- An [Inngest](https://www.inngest.com) account (free tier works)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/EllyCarlos/Signalist-stockmarket-app.git
   cd Signalist-stockmarket-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory and fill in your credentials:

   ```env
   NODE_ENV='development'
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # Finnhub — https://finnhub.io
   NEXT_PUBLIC_NEXT_PUBLIC_FINNHUB_API_KEY=
   FINNHUB_BASE_URL=https://finnhub.io/api/v1

   # MongoDB — https://mongodb.com/atlas
   MONGODB_URI=

   # Better Auth — https://better-auth.com
   BETTER_AUTH_SECRET=
   BETTER_AUTH_URL=http://localhost:3000

   # Gemini AI — https://aistudio.google.com
   GEMINI_API_KEY=

   # Nodemailer (SMTP email)
   NODEMAILER_EMAIL=
   NODEMAILER_PASSWORD=
   ```

   | Variable | Where to get it |
   |---|---|
   | `NEXT_PUBLIC_NEXT_PUBLIC_FINNHUB_API_KEY` | [finnhub.io](https://finnhub.io) — free tier available |
   | `FINNHUB_BASE_URL` | Pre-filled: `https://finnhub.io/api/v1` |
   | `MONGODB_URI` | [MongoDB Atlas](https://www.mongodb.com/atlas) — free cluster |
   | `BETTER_AUTH_SECRET` | Any long random string (e.g. `openssl rand -base64 32`) |
   | `BETTER_AUTH_URL` | Your app's base URL |
   | `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com) — free tier |
   | `NODEMAILER_EMAIL` | The Gmail / SMTP address Signalist sends alerts from |
   | `NODEMAILER_PASSWORD` | App password for that email account |

4. **Run the development server**

   You need two processes running in parallel — the Next.js dev server and the Inngest local dev server:

   ```bash
   # Terminal 1 — Next.js
   npm run dev

   # Terminal 2 — Inngest (background job runner)
   npx inngest-cli@latest dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the app for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

## Deployment

Signalist is optimised for [Vercel](https://vercel.com). To deploy your own instance:

1. Fork this repository.
2. Import the project into Vercel.
3. Add all environment variables from the table above in the Vercel project settings.
4. Deploy — Vercel handles the rest.

Make sure to add all environment variables from your `.env` file into the Vercel project settings. For Inngest background jobs to work in production, register your deployment URL (`https://your-domain.vercel.app/api/inngest`) as the webhook endpoint in your [Inngest dashboard](https://app.inngest.com).

## Authentication & Route Protection

All routes (except `/sign-in`, `/sign-up`, and static assets) are protected by the middleware in `proxy.ts`. If a user does not have a valid session cookie, they are automatically redirected to the sign-in page.

## Contributing

Contributions are welcome! Here's how to get involved:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request.

Please follow the existing code style and make sure `npm run lint` passes before submitting.

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with ♥ by [EllyCarlos](https://github.com/EllyCarlos)

⭐ If you find this project useful, please consider giving it a star!

</div>
