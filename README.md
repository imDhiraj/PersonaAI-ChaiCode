# AI Teacher Persona Chatbot (Hitesh Choudhary & Piyush Garg)

An AI-powered tribute website simulating conversations with two major figures in tech education: **Hitesh Choudhary** (creator of *Chai aur Code*) and **Piyush Garg** (systems architect and educator). 

This project simulates their distinctive speaking styles, vocabulary, pedagogical methods, and career advice using Google's Gemini LLM.

---

## 🚀 Features

*   **Dual Personas**: Simulate conversations with either Hitesh Choudhary or Piyush Garg.
*   **Adaptive Theme Engine**: The UI style transitions dynamically depending on the selected tutor:
    *   **Hitesh Choudhary**: Warm coffee/tea-colored vibes, wood accents, and cozy ambient elements representing the *Chai aur Code* atmosphere.
    *   **Piyush Garg**: Cyberpunk tech aesthetics with dark obsidian and glowing cyan grids representing the *System Builder* vibe.
*   **Full Markdown & Code Rendering**: Code blocks are syntax-styled with copy-code buttons, making it highly useful for programming students.
*   **Independent Context Sessions**: Message logs persist locally in `localStorage` separately for each teacher, ensuring their contexts do not mix.
*   **Production-Ready Configuration**: Supports configuration via local Settings UI or a standard `.env` file.
*   **Interactive Suggestion Chips**: Quick-start prompts custom-tailored to each teacher's actual curriculum topics.

---

## 🛠️ Tech Stack

*   **Frontend Core**: [React](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: Vanilla CSS (Custom properties, grid systems, keyframe animations, glassmorphism)
*   **AI Integration**: [Google Gemini API](https://ai.google.dev/) via `@google/generative-ai` SDK
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Markdown Parsing**: `react-markdown` + `remark-gfm`

---

## ⚙️ Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd PersonaAI-ChaiCode
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Gemini API Key
Configure your API key in one of the following ways:

#### Method A: Local UI Settings (Best for local testing / zero server cost)
1. Run the app and click the **Settings Cog icon** in the top-right corner.
2. Paste your Google Gemini API Key (get one free from [Google AI Studio](https://aistudio.google.com/)).
3. Click **Save Configuration**. The key is stored locally in your browser's `localStorage` and never leaves your machine.

#### Method B: Secure Serverless Proxy (Recommended for Production Deployment)
To prevent your API key from being compiled into the client-side JavaScript bundle and exposed to the public, do NOT use `VITE_` variables in production. Instead, utilize the built-in serverless backend proxy (Vercel/Netlify Edge functions):
1. Rename the variable on your hosting dashboard (e.g., Vercel, Netlify) to **`GEMINI_API_KEY`** (without the `VITE_` prefix).
2. The serverless functions in `/api/config` and `/api/chat` will run on the server side, keeping your key completely hidden.
3. The frontend dynamically detects the serverless endpoint and routes requests through `/api/chat` securely.

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build and Deploy for Production
```bash
npm run build
```
Generates a static web build in the `dist/` directory.
*   **Vercel Deployments**: The project is structured with an `/api` directory. Vercel automatically detects this and deploys `/api/config` and `/api/chat` as Serverless Edge Functions. Make sure to define `GEMINI_API_KEY` in your Vercel Project Environment Variables.

---

## 📂 Project Structure

```
c:\Users\dhira\Desktop\GenAI26\
├── public/
│   ├── hitesh.png         # Custom generated teacher avatar
│   └── piyush.png         # Custom generated teacher avatar
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Brand bar & settings toggle
│   │   ├── PersonaSelector.tsx  # Cards to swap tutor personas
│   │   ├── ChatContainer.tsx    # Message feed & stream processing
│   │   ├── ChatMessage.tsx      # Render messages in markdown
│   │   └── SettingsModal.tsx    # Safe API key configuration modal
│   ├── styles/
│   │   ├── variables.css        # Color schemes & variable styles
│   │   └── App.css              # Typography & animations
│   ├── utils/
│   │   └── gemini.ts            # LLM setup, prompts, & streams
│   ├── App.tsx                  # Application state & effects orchestration
│   ├── main.tsx                 # React entry point
│   └── index.css                # CSS imports
├── .env.example                 # Environment config template
├── package.json
└── tsconfig.json
```

---

## 📝 License
This project is built for educational demonstration and as a tribute to Hitesh Choudhary and Piyush Garg. All trademarked concepts (like *Chai aur Code* or *Teachyst*) belong to their respective creators.
