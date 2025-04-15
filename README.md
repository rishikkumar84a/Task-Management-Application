# TaskFlow - Kanban Task Management Application

A modern Trello-like task management application built with Next.js, Tailwind CSS, and PostgreSQL. TaskFlow provides a visual, drag-and-drop interface for organizing tasks across customizable columns.

## Features

- **Kanban Board Interface**: Organize tasks with a visual drag-and-drop interface
- **Task Management**: Create tasks with titles, descriptions, priorities, due dates, and labels
- **User Authentication**: Secure login/registration with email/password or OAuth providers
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instantly reflect changes across the board

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Drag and Drop**: react-beautiful-dnd
- **Form Handling**: react-hook-form
- **Notifications**: react-hot-toast

## Prerequisites

- Node.js (v16+)
- PostgreSQL database

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional OAuth providers
# GITHUB_ID=""
# GITHUB_SECRET=""
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
```

### 4. Set up the database

```bash
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
/app                   # Next.js App Router
  /api                 # API Routes
  /components          # Reusable components
  /board               # Board pages
  /dashboard           # Dashboard pages
  /login               # Authentication pages
  /register            # Registration pages
  /providers           # React context providers
/lib                   # Utility functions
/prisma                # Prisma schema and migrations
```

## Authentication

The application supports two authentication methods:

1. **Email/Password**: Traditional login with email and password
2. **OAuth**: Sign in with GitHub or Google (requires API keys)

## Database Schema

The application uses the following main data models:

- **User**: User account information
- **Board**: Kanban boards created by users
- **Column**: Columns within a board (e.g., To Do, In Progress, Done)
- **Task**: Individual tasks with various properties
- **Label**: Color-coded labels that can be applied to tasks

## Deployment

This application can be deployed to platforms like Vercel or Netlify for the frontend, with a PostgreSQL database from providers like Heroku, Railway, or Supabase.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 