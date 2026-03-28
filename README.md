# Tyzn Shorts Content - Viral Food Battle Generator

A full-stack SaaS application that generates viral "food battle" content for TikTok, YouTube Shorts, and Instagram Reels using AI.

## Features

- **Dynamic Food Battle Generation**: Creates unique healthy vs processed food matchups
- **AI-Powered Content**: Uses OpenAI GPT-4 to generate scripts, prompts, and SEO
- **Complete Content Package**:
  - 12-16 second dramatic dialogue scripts
  - Cinematic image generation prompts
  - Continuous action video prompts
  - SEO-optimized titles, descriptions, tags, and hashtags
- **Theme Toggle**: Switch between light and dark mode
- **Topography Aesthetic**: Clean black, gray, and white design

## Tech Stack

- **Frontend**: Next.js 14 (Pages Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4 API

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Your OpenAI API Key
Edit `.env.local` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Browser
Go to: http://localhost:3000

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add `OPENAI_API_KEY` environment variable
4. Deploy!

## File Structure

```
tyzn-shorts-content/
├── pages/
│   ├── _app.tsx          # App wrapper
│   ├── _document.tsx     # HTML template
│   ├── index.tsx         # Main UI
│   └── api/
│       └── generate.ts   # API route with OpenAI
├── styles/
│   └── globals.css       # Tailwind styles
├── .env.local            # Environment variables
├── next.config.js        # Next.js config
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind config
└── tsconfig.json         # TypeScript config
```

## License

MIT License
