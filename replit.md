# Minutely AI Academy - Full-Stack Learning Platform

## Overview

This is a comprehensive full-stack learning platform called "Minutely AI Academy" built with React, Express.js, and PostgreSQL. The platform focuses on AI-powered education, offering courses in AI, DevOps, web development, and other technical skills. It features user authentication, course management, progress tracking, gamification, and AI-assisted learning.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for authentication, TanStack Query for server state
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple

## Key Components

### Authentication System
- User registration and login functionality
- Role-based access control (student, instructor, admin, agency)
- Protected routes and authorization middleware
- Session-based authentication with PostgreSQL storage

### Course Management
- Course creation and publishing by instructors
- Multi-level course structure (courses → modules → lessons)
- Video content support with progress tracking
- Quiz and assessment system
- Course categorization and filtering

### User Roles & Dashboards
- **Students**: Course enrollment, progress tracking, gamification
- **Instructors**: Course creation, student analytics, revenue tracking
- **Admins**: Platform management, user oversight, content moderation
- **Agencies**: Team management, bulk course purchases

### AI Integration
- AI-powered learning assistant for student support
- Course recommendation engine
- Interactive prompt engineering challenges ("Battle" feature)
- Knowledge base ("Codex") with AI-generated content

### Gamification System
- XP points and leveling system
- Achievement badges and certifications
- Learning streaks and progress milestones
- Leaderboards and social features

## Data Flow

1. **User Registration/Login**: Users authenticate through the auth system, with sessions stored in PostgreSQL
2. **Course Discovery**: Users browse courses with filtering and search capabilities
3. **Enrollment**: Students enroll in courses, creating enrollment records
4. **Learning Progress**: Video watch time, quiz completions, and module progress tracked in real-time
5. **AI Assistance**: Students can interact with AI assistant for course-related questions
6. **Analytics**: User behavior and learning data aggregated for instructors and admins

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database schema and query builder

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components via shadcn/ui
- **Lucide React**: Icon library

### Development Tools
- **TypeScript**: Type safety across the entire codebase
- **ESLint/Prettier**: Code formatting and linting
- **Vite**: Fast development server and build tool

### Third-Party Services
- **Supabase**: Used for some authentication and real-time features
- **OpenAI API**: AI assistant functionality (configured but not fully implemented)

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR (Hot Module Replacement)
- Express server running in development mode with tsx
- Environment variables for database connection and API keys

### Production Build
- Frontend built with Vite and served as static files
- Backend compiled with esbuild for optimal performance
- Single-server deployment with Express serving both API and static files

### Database Migration
- Drizzle migrations stored in `/migrations` directory
- Schema defined in `shared/schema.ts` for type safety
- Push-based deployment with `drizzle-kit push` command

The application is designed for scalability with proper separation of concerns, type safety throughout, and a modular component structure that supports multiple user types and complex learning workflows.