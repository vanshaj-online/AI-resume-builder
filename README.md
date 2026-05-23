# 🤖 AI Resume Builder

An elegant, modern, AI-powered interactive resume builder designed to help job seekers, students, and professionals draft top-tier, ATS-optimized resumes in minutes. Powered by the **Google Gemini API**, this application provides automated summaries, professional bullet point optimization, and smart skill recommendations.

---

## ✨ Features

### 👤 User Authentication & Management
*   **Secure Sign Up & Log In:** Built with JWT-based security and password hashing (`bcrypt`).
*   **Personal Dashboard:** Manage, create, view, update, and delete multiple resumes from a unified interface.

### 🧠 Gemini AI-Powered Features
*   **Smart Skill Suggestion:** Generates industry-relevant, highly sought-after core technical skills based on the target job role (automatically avoiding generic skills like HTML/CSS).
*   **AI Summary Generator:** Instantly crafts a tailored, professional 2-to-4 line resume summary based on your target role, projects, education, and skills.
*   **Professional Bullet Point Optimizer:** Polishes raw project or experience descriptions into high-impact, action-verb-rich, ATS-friendly bullet points.

### 📝 Live Builder & Preview
*   **Interactive Form Builder:** Real-time form fields grouped into Personal Details, Skills, Experience, Education, and Projects.
*   **Live Side-by-Side Preview:** Instantly see layout and text updates as you type.
*   **PDF Export / Print:** One-click seamless downloading and printing using styled CSS templates (`react-to-print`).

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8 | Core user interface framework and dev tooling |
| **Styling** | Tailwind CSS v4, Framer Motion | Modern, performant UI styles and smooth micro-animations |
| **State & Forms** | Zustand, React Hook Form, Zod | Global state management and strict schema form validation |
| **Icons** | Lucide React | Modern, minimalist SVG icons |
| **Backend** | Node.js, Express, TypeScript | Highly performant REST API backend |
| **Database** | MongoDB, Mongoose | NoSQL data store for users and resumes |
| **AI Integration** | Google GenAI SDK | Powers the Gemini 2.5 Flash Lite LLM completions |

---

## 📂 Folder Structure

```text
AI-resume-builder/
├── frontend/               # React client application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Builder, Dashboard, Login, Signup
│   │   ├── services/       # API endpoints and network handlers
│   │   ├── store/          # Zustand global store configuration
│   │   └── main.tsx        # React entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/                # Express server and AI handlers
│   ├── src/
│   │   ├── controllers/    # Request handlers (auth, resume, AI)
│   │   ├── models/         # Mongoose DB Schemas (User, Resume)
│   │   ├── routes/         # Express API route declarations
│   │   ├── services/       # Gemini AI & custom business logic
│   │   └── server.ts       # Express app and server startup
│   ├── package.json
│   └── tsconfig.json
├── .gitignore              # Git ignore rules for the root project
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites
Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas cluster)
*   A **Gemini API Key** (obtainable from [Google AI Studio](https://aistudio.google.com/))

---

### 🔧 Installation & Setup

#### 1. Clone the Repository
```bash
git clone <your-repo-link>
cd "AI resume builder"
```

#### 2. Set Up the Backend
1.  Navigate into the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend/` directory and configure your variables:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
    JWT_SECRET=your_jwt_super_secret_key_here
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
4.  Start the backend development server:
    ```bash
    npm run dev
    ```
    *The server will start running at `http://localhost:5000`.*

---

#### 3. Set Up the Frontend
1.  Open a new terminal and navigate to the `frontend/` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend/` directory:
    ```env
    VITE_API_URL=http://localhost:5000
    ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    *The client will open in your browser, typically at `http://localhost:5173`.*

---

## 🔒 Security & Best Practices
*   **Environment Secrets:** Never commit `.env` files to git. They are ignored locally in both root and sub-folder `.gitignore` files.
*   **TypeScript Strict Mode:** Enforced across both client and server to prevent run-time type issues.
*   **Input Validation:** Fully secured via server-side Mongoose schema rules and frontend validation schemas compiled through Zod.
