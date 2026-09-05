<div align="center">

<img src="./assets/hero-banner.svg" width="100%"/>

<br/>

![System Status](https://img.shields.io/badge/SYSTEM%20STATUS-100%25%20OPERATIONAL-00ffcc?style=for-the-badge&labelColor=0d1117)
![AI Engine](https://img.shields.io/badge/AI%20ENGINE-GEMINI%20POWERED-22c55e?style=for-the-badge&labelColor=0d1117)
![Architecture](https://img.shields.io/badge/ARCHITECTURE-REACT%2019%20%2B%20VITE-38bdf8?style=for-the-badge&labelColor=0d1117)
![Build](https://img.shields.io/badge/BUILD-TYPESCRIPT%20STRICT-a78bfa?style=for-the-badge&labelColor=0d1117)

*Classroom Radar &nbsp;•&nbsp; Student Dashboard &nbsp;•&nbsp; Concept Graphs &nbsp;•&nbsp; Lumina AI Curriculum Ingestion*

</div>

<br/>

<div align="center">
<img src="./assets/terminal-preview.svg" width="90%"/>
</div>

<br/>

## ⚡ Architectural Tenets

> *"Software for the classroom should feel invisible — the teacher sees insight,
> the student sees progress, and the AI does the work in between."*

<table>
<tr>
<td width="33%" align="center">

**🎯 Real-Time Insight**

Classroom Radar surfaces live engagement signals instead of static reports.

</td>
<td width="33%" align="center">

**🧠 AI-Native**

Lumina AI ingests raw curriculum and turns it into structured, teachable concepts.

</td>
<td width="33%" align="center">

**🕸️ Connected Knowledge**

Concept Graphs map how ideas relate, not just what was covered.

</td>
</tr>
</table>

<br/>

## 🚀 Core Modules

<div align="center">
<img src="./assets/architecture-diagram.svg" width="85%"/>
</div>

<br/>

<table>
<tr>
<td width="50%">

### 📡 Classroom Radar
Live, at-a-glance view of classroom activity and engagement — built to help teachers spot who needs attention before it becomes a problem.

`React` `TypeScript` `Motion`

</td>
<td width="50%">

### 📊 Student Dashboard
Per-student performance and progress tracking surfaced through a clean, data-dense interface.

`React` `Tailwind CSS` `Lucide Icons`

</td>
</tr>
<tr>
<td width="50%">

### 🕸️ Concept Graphs
Visual, interconnected maps of curriculum concepts — showing prerequisite chains and knowledge gaps at a glance.

`React` `TypeScript` `Data Viz`

</td>
<td width="50%">

### 🤖 Lumina AI — Curriculum Ingestion
Feeds raw curriculum material into the Gemini API and outputs structured, classroom-ready concepts and assessments.

`Google GenAI` `Express` `Server-Side Gemini`

</td>
</tr>
</table>

<br/>

## 🖼️ Module Previews

<div align="center">

<table>
<tr>
<td width="50%" align="center"><img src="./assets/screenshot-radar.svg" width="100%"/></td>
<td width="50%" align="center"><img src="./assets/screenshot-dashboard.svg" width="100%"/></td>
</tr>
<tr>
<td width="50%" align="center"><img src="./assets/screenshot-graphs.svg" width="100%"/></td>
<td width="50%" align="center"><img src="./assets/screenshot-lumina.svg" width="100%"/></td>
</tr>
</table>

</div>

<br/>

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React_19-0d1117?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-0d1117?style=for-the-badge&logo=typescript&logoColor=3178C6)
![Vite](https://img.shields.io/badge/Vite_6-0d1117?style=for-the-badge&logo=vite&logoColor=646CFF)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-0d1117?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![Express](https://img.shields.io/badge/Express-0d1117?style=for-the-badge&logo=express&logoColor=ffffff)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_API-0d1117?style=for-the-badge&logo=google&logoColor=4285F4)
![Node.js](https://img.shields.io/badge/Node.js-0d1117?style=for-the-badge&logo=node.js&logoColor=339933)

</div>

<br/>

## 📦 Project Structure

```bash
smart-classroom/
├── src/
│   └── main.tsx              # App entry point
├── index.html                 # Root HTML shell
├── metadata.json               # App metadata + Gemini capability flags
├── vite.config.ts               # Vite + Tailwind + path alias config
├── tsconfig.json                  # Strict TS config, @/ path alias
├── package.json                     # Scripts + dependencies
└── .gitignore
```

<br/>

## ⚙️ Getting Started

```bash
# clone the repo
git clone https://github.com/<your-username>/smart-classroom.git
cd smart-classroom

# install dependencies
npm install

# run the dev server
npm run dev
```

<div align="center">

| Script | Description |
|---|---|
| `npm run dev` | Launches the Vite dev server on port 3000 |
| `npm run build` | Builds the production bundle |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Type-checks the project with `tsc --noEmit` |
| `npm run clean` | Removes `dist/` and `server.js` |

</div>

<br/>

## 🔐 Environment Setup

This project uses the **Google GenAI (Gemini) API** for AI-powered curriculum ingestion. Create a `.env` file in the project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

<br/>

<div align="center">

![Made with](https://img.shields.io/badge/BUILT%20FOR-CLASSROOMS%20%26%20CURIOUS%20MINDS-0ea5e9?style=for-the-badge&labelColor=0d1117)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:22c55e,50:0ea5e9,100:0f172a&height=100&section=footer" width="100%"/>

</div>
