# Blog Platform & File Storage

A modern, full-stack blog platform and file storage application built with Next.js, Convex, and TailwindCSS. It features a rich text editor powered by Tiptap, content management features, and robust file storage capabilities.

## 🚀 Features

- **Rich Text Editor**: Comprehensive editor built with Tiptap supporting markdown, images, tables, YouTube embeds, syntax highlighting, and more.
- **Content Management**: Create, edit, publish, and manage blog posts with full SEO metadata, categorization, reading time estimation, and analytics tracking.
- **File Storage**: Upload and manage files (images, PDFs, CSVs) with shareable links, integrated with Convex storage.
- **Authentication**: Secure user authentication powered by NextAuth.
- **Modern UI/UX**: Responsive design with TailwindCSS, Lucide icons, Dark/Light theme toggling, and smooth skeleton loading states.
- **Real-time Database**: Powered by Convex for instant syncing and fast, reactive data mutations.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Frontend**: React 18
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Backend**: [Convex](https://www.convex.dev/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Docker ready

## 📦 Getting Started

### Prerequisites

Ensure you have Node.js and npm (or yarn/pnpm) installed. You'll also need a Convex project and authentication providers configured.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd blog-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy the example environment file and configure your credentials.
   ```bash
   cp .env.example .env.local
   ```
   **Required Environment Variables (see `.env.example`):**
   - Convex deployment URL & keys
   - NextAuth secret and provider credentials (e.g., GitHub, Google)

4. Initialize Convex:
   ```bash
   npx convex dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```
   *Note: The app runs on port `3001` by default.*

6. Open [http://localhost:3001](http://localhost:3001) in your browser.

## 🐳 Docker Deployment

The application includes a `Dockerfile` and `docker-compose.yml` for easy containerized deployment.

```bash
# Build and run with Docker Compose
docker-compose up -d --build
```

The app will be available on port `3001`. Ensure your production environment variables are properly set in the Docker environment.

## 📝 License

© OneClickResult. All rights reserved.
