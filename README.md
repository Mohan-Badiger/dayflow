# DayFlow

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

**DayFlow** is a premium, minimal, and highly focused daily routine and productivity tracking application. Designed to eliminate the noise of traditional trackers, it provides a seamless interface for logging habits, tracking deep work sessions, managing diet, and reviewing daily patterns through rich analytics.

## ✨ Key Features

- **Personalized Daily Hub**: A central dashboard combining habit tracking, study hours, and hydration goals with a calculated "Day Score".
- **Deep Work & Career Tracking**: Specifically tailored for continuous learners, allowing precise tracking of study sessions aligned with career goals (e.g., "React Developer").
- **Rich Analytics Engine**: Visualize your consistency, study distribution, and mood trends over 7, 30, or 90 days using interactive `Recharts`.
- **AI-Driven Insights**: Automated pattern recognition (e.g., "You study 40% more on days you wake before 6:30").
- **Premium UX/UI**: Built with Tailwind CSS v4 and Framer Motion, featuring glassmorphism, dynamic micro-interactions, and a responsive design tailored for cross-device usage.
- **Secure Authentication**: Frictionless login via Google OAuth powered by NextAuth.js (Auth.js v5).

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS v4 + Global CSS Variables
- **Animations**: Framer Motion
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: NextAuth.js v5 (Google Provider)
- **Data Visualization**: Recharts
- **Icons**: Lucide React

## 🚀 Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn
- MongoDB Atlas cluster (or local MongoDB server)
- Google Cloud Console account (for OAuth credentials)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/dayflow.git
cd dayflow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of your project by copying the example provided:

```bash
cp .env.example .env
```

Populate the `.env` file with your specific credentials:

```env
# MongoDB Connection String (Include the database name at the end, e.g., /dayflow)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dayflow?retryWrites=true&w=majority

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Secrets
AUTH_SECRET=generate_a_random_secure_string_here
AUTH_URL=http://localhost:3000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

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

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
