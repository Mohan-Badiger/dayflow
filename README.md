# DayFlow

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

**DayFlow** is a premium, minimal, and highly focused daily routine and productivity tracking application. Designed to eliminate the noise of traditional trackers, it provides a seamless interface for logging habits, tracking deep work sessions, managing diet, and reviewing daily patterns through rich analytics.

##✨ Key Features

- **Personalized Daily Hub**: A central dashboard combining habit tracking, study hours, and hydration goals with a calculated "Day Score".
- **Deep Work & Career Tracking**: Specifically tailored for continuous learners, allowing precise tracking of study sessions aligned with career goals (e.g., "React Developer").
- **Rich Analytics Engine**: Visualize your consistency, study distribution, and mood trends over 7, 30, or 90 days using interactive `Recharts`.
- **AI-Driven Insights**: Automated pattern recognition (e.g., "You study 40% more on days you wake before 6:30").
- **Premium UX/UI**: Built with Tailwind CSS v4 and Framer Motion, featuring glassmorphism, dynamic micro-interactions, and a responsive design tailored for cross-device usage.
- **Secure Authentication**: Frictionless login via Google OAuth powered by NextAuth.js (Auth.js v5).

##🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS v4 + Global CSS Variables
- **Animations**: Framer Motion
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: NextAuth.js v5 (Google Provider)
- **Data Visualization**: Recharts
- **Icons**: Lucide React

## 🚀 Getting Started

Follow these simple steps to clone, configure, and run **DayFlow** on your local machine.

### 📋 Prerequisites

Before you start, make sure you have the following installed on your system:
* **Node.js** (v18.x or later) — [Download Node.js](https://nodejs.org/)
* **Git** — [Download Git](https://git-scm.com/)
* **MongoDB** (Local instance or a free MongoDB Atlas Cloud account)
* **Google Account** (For setting up OAuth authentication)

---

### 💻 Local Setup Guide

#### Step 1: Clone and Open the Project

1. Click the green **Code** button at the top right of this GitHub page and copy the repository URL (HTTPS or SSH).
2. Open your terminal (Git Bash, Command Prompt, or terminal in VS Code) and run:

```bash
# Clone the repository
git clone https://github.com/yourusername/dayflow.git

# Navigate into the project folder
cd dayflow
```

3. Open the folder in your favorite code editor (e.g., Visual Studio Code):
```bash
code .
```

#### Step 2: Install Dependencies

Install the required packages using `npm`:
```bash
npm install
```

#### Step 3: Configure Environment Variables

1. Duplicate the `.env.example` file and rename it to `.env` in the root directory:
   * **On Windows (PowerShell):**
     ```powershell
     cp .env.example .env
     ```
   * **On macOS/Linux:**
     ```bash
     cp .env.example .env
     ```

2. Open the new `.env` file in your editor. It will contain:
   ```env
   MONGODB_URI=
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   NODE_ENV=development
   ```

3. Fill in the values using the details below:

   | Variable | Description & How to Get It |
   | :--- | :--- |
   | `MONGODB_URI` | Your MongoDB connection string. <br>• **Atlas (Cloud):** Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), create a free database cluster, click **Connect** → **Drivers**, and copy the connection string. Replace `<password>` with your database user password.<br>• **Local:** Use `mongodb://localhost:27017/dayflow` (ensure your local MongoDB service is running). |
   | `NEXTAUTH_SECRET` | A secure random string used to encrypt session cookies. <br>• You can generate one instantly by running this command in your terminal:<br>  `npx auth secret` or `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | Set to `http://localhost:3000` for local development. |
   | `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` | Required for Google Login. <br>1. Go to the [Google Cloud Console](https://console.cloud.google.com/).<br>2. Create a new project or select an existing one.<br>3. Search for **APIs & Services** and click on **OAuth consent screen**. Set user type to **External** and complete the basic setup.<br>4. Go to the **Credentials** tab, click **+ Create Credentials**, and select **OAuth client ID**.<br>5. Set application type to **Web application**.<br>6. Under **Authorized redirect URIs**, add:<br>   `http://localhost:3000/api/auth/callback/google`<br>7. Click **Create** and copy your **Client ID** and **Client Secret**. |

#### Step 4: Run the Development Server

Start the Next.js local development server:
```bash
npm run dev
```

Your server will spin up, usually at [http://localhost:3000](http://localhost:3000). Open this URL in your web browser to start using DayFlow!

---

## 🔍 Troubleshooting & FAQs

> [!TIP]
> **MongoDB connection issues?**  
> Make sure your MongoDB password doesn't contain special characters like `@` or `/` without being URL-encoded, or create a simple password with alphanumeric characters. If using Atlas, ensure your current IP address is whitelisted in the Atlas Network Access tab.

> [!WARNING]
> **Google Sign-In fails / Redirect URI mismatch?**  
> Double check that the redirect URL in your Google Cloud Console exactly matches `http://localhost:3000/api/auth/callback/google` (including the protocol `http` and port `3000`).

> [!NOTE]
> **Node Version Compatibility**  
> If you encounter build issues, check your Node version using `node -v`. We recommend Node LTS (v18 or v20).


## 📁 Project Architecture

```text
dayflow/
├── components/          # Reusable UI components
│   ├── layout/          # Page wrappers, Navigation
│   ├── providers/       # Context & Auth providers
│   ├── today/           # Dashboard-specific components
│   └── ui/              # Base UI elements (Buttons, Cards)
├── lib/                 # Utility functions and DB connection logic
├── models/              # Mongoose database schemas
├── src/
│   └── app/
│       ├── (app)/       # Protected application routes (Dashboard, Analytics)
│       ├── (auth)/      # Authentication routes (Login)
│       ├── api/         # Next.js API routes (NextAuth)
│       ├── globals.css  # Tailwind configurations and design tokens
│       └── layout.js    # Root layout containing the SessionProvider
```

## 🎨 Design Philosophy

DayFlow is built on the premise that **aesthetics drive consistency**. If a tool feels like a chore, you won't use it. By implementing high-end visual design patterns—such as fluid spring animations, harmonious color palettes, and glassmorphic layers—DayFlow aims to create a deeply engaging daily ritual rather than just another checklist.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/yourusername/dayflow/issues).

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Developed By 
Mohan

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
