# 🛡️ SafeReport

**SafeReport** is a modern web application built to provide a simple, secure, and user-friendly platform for reporting and managing safety-related incidents.

The application is built with **React, TypeScript, Vite, Tailwind CSS, and Supabase**, with a component-driven UI powered by Radix UI and shadcn-style components.

## 🌐 Live Demo

🔗 **Live Website:** [SafeReport](https://safe-report-major-project.vercel.app/)

## ✨ Features

- 🔐 **User Authentication** — Secure authentication using Supabase
- 📝 **Incident Reporting** — Submit safety-related reports through structured forms
- 📋 **Report Management** — View and manage submitted reports
- 🔎 **Report Tracking** — Track the status of submitted reports
- 📊 **Data Visualization** — Display report-related information using charts
- 🧾 **Form Validation** — Robust validation using React Hook Form and Zod
- 🧭 **Client-side Routing** — Smooth navigation using React Router
- 📱 **Responsive Design** — Designed to work across desktop, tablet, and mobile devices
- 🎨 **Modern UI** — Built using Tailwind CSS, Radix UI, and reusable components
- 🔔 **Toast Notifications** — User feedback using Sonner

## 🛠️ Tech Stack

### Frontend

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router DOM**
- **React Hook Form**
- **Zod**
- **Lucide React**

### UI & Components

- **Radix UI**
- **shadcn/ui**
- **Tailwind CSS Animate**
- **Class Variance Authority**
- **Sonner**

### Backend & Database

- **Supabase**
  - Authentication
  - Database
  - Backend services

### Data Visualization

- **Recharts**

### Development Tools

- ESLint
- TypeScript
- PostCSS
- Autoprefixer

## 📂 Project Structure

```text
SafeReport/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── integrations/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .gitignore
├── package.json
├── package-lock.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

> The exact structure may vary depending on the current implementation.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Rishi-Kumar85/SafeReport-Major-Project.git
```

### 2. Navigate to the project

```bash
cd SafeReport
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Never commit your `.env` file or expose private Supabase service-role keys.

### 5. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## 📦 Available Scripts

| Command               | Description                     |
| --------------------- | ------------------------------- |
| `npm run dev`       | Start the development server    |
| `npm run build`     | Create a production build       |
| `npm run build:dev` | Create a development-mode build |
| `npm run lint`      | Run ESLint                      |
| `npm run preview`   | Preview the production build    |

## 🏗️ Production Build

To create a production-ready build:

```bash
npm run build
```

The generated files will be placed in:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

## 🔐 Supabase Configuration

SafeReport uses **Supabase** for backend functionality.

Supabase can provide:

- User authentication
- Database storage
- User profiles
- Incident/report data
- Secure API access

The Supabase configuration should be stored using environment variables rather than directly inside the source code.

## 🎯 Project Objectives

SafeReport aims to:

- Simplify the process of reporting safety-related incidents.
- Provide an organized platform for managing reports.
- Allow users to securely submit and track reports.
- Provide useful insights through data visualization.
- Create an accessible and responsive reporting experience.
- Reduce the complexity involved in traditional reporting processes.

## 🔮 Future Enhancements

Potential future improvements include:

- 📍 GPS-based incident location
- 📸 Image and video attachments
- 🗺️ Interactive incident maps
- 🔔 Real-time notifications
- 👨‍💼 Advanced administrator dashboard
- 📊 Advanced analytics
- 🤖 AI-assisted incident classification
- 📱 Progressive Web App support
- 📧 Email notifications
- 📄 Report export to PDF

## 🤝 Contributing

Contributions are welcome.

### Fork the repository

```bash
git fork https://github.com/Rishi-Kumar85/SafeReport.git
```

### Create a branch

```bash
git checkout -b feature/your-feature
```

### Commit your changes

```bash
git add .
git commit -m "Add new feature"
```

### Push your branch

```bash
git push origin feature/your-feature
```

Then open a Pull Request on GitHub.

## 📄 License

This project was developed for educational and project-development purposes.

## 👨‍💻 Author

**Rishi Kumar**

GitHub: [Rishi-Kumar85](https://github.com/Rishi-Kumar85)

---

⭐ **If you like SafeReport, consider giving the repository a star!**
