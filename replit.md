# replit.md

## Overview

This is a modern full-stack web application called "Minutely AI Academy" - an AI-powered learning platform for technology skills. The system uses Express.js for the backend, React with TypeScript for the frontend, PostgreSQL with Drizzle ORM for the database, and integrates with Supabase for authentication and real-time features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React 18 with TypeScript, Vite for bundling
- **Backend**: Express.js with TypeScript, running on Node.js
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **Authentication**: Supabase Auth integration
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, React Context for auth

## Key Components

### Frontend Architecture
- **React SPA** with React Router for client-side routing
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Type Safety**: Full TypeScript implementation with strict mode
- **Build System**: Vite with React plugin and custom Replit integrations

### Backend Architecture
- **Express Server** with TypeScript and ES modules
- **Database Layer**: Drizzle ORM with Neon serverless PostgreSQL
- **API Design**: RESTful API with /api prefix for all endpoints
- **Memory Storage**: Fallback in-memory storage for development
- **Middleware**: Express JSON parsing, custom request logging

### Authentication & Authorization
- **Supabase Integration**: Complete auth system with user profiles
- **Role-Based Access**: Student, instructor, admin, and agency roles
- **Context Provider**: React context for auth state management
- **Protected Routes**: Role-based route protection

### Database Schema
- **Users & Profiles**: Extended user profiles with roles and metadata
- **Courses & Modules**: Hierarchical content structure with progress tracking
- **Jobs & Agencies**: Job board functionality with agency management
- **AI Features**: Chat logs, interactions, and recommendations
- **Community**: Forums, battles, and social features

### UI/UX Components
- **Design System**: Consistent component library with dark/light theme support
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Interactive Elements**: Rich forms, modals, tabs, and data tables
- **AI Integration**: Chat interfaces, study companions, and content generation

## Data Flow

1. **Authentication Flow**: Supabase handles auth, React context manages state
2. **API Communication**: Frontend uses TanStack Query for server state
3. **Database Operations**: Drizzle ORM provides type-safe database queries
4. **Real-time Features**: Supabase subscriptions for live updates
5. **File Uploads**: Supabase storage for media and document handling

## External Dependencies

### Core Dependencies
- **Database**: Neon serverless PostgreSQL via @neondatabase/serverless
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Auth Provider**: Supabase for authentication and real-time features
- **UI Components**: Extensive use of Radix UI primitives
- **Styling**: Tailwind CSS with class-variance-authority for component variants

### Development Tools
- **Build Tools**: Vite, esbuild for production builds
- **Type Checking**: TypeScript with strict configuration
- **Database Migrations**: Drizzle Kit for schema management
- **Replit Integration**: Custom Vite plugins for Replit environment

### AI & Content
- **AI Services**: Placeholder for OpenAI integration (aiService.ts)
- **Content Generation**: AI-powered course and quiz generation
- **Speech Recognition**: Browser-based speech-to-text functionality

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **Database**: Uses DATABASE_URL environment variable
- **Replit Integration**: Custom error overlays and development banners

### Production Build
- **Frontend**: Vite builds optimized static files to dist/public
- **Backend**: esbuild bundles server code to dist/
- **Database**: Drizzle migrations via `db:push` command
- **Environment**: NODE_ENV-based configuration switching

### Key Configuration Files
- **vite.config.ts**: Frontend build configuration with path aliases
- **drizzle.config.ts**: Database configuration and migration settings
- **tsconfig.json**: TypeScript configuration with path mapping
- **tailwind.config.ts**: Styling configuration with custom theme

The application is designed to be highly scalable with clear separation of concerns, type safety throughout, and modern development practices.