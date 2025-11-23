# Word Archive

## Overview

Word Archive is a personal vocabulary collection application that allows users to build and manage their vocabulary entries. The application provides a clean, reading-focused interface for adding, editing, and organizing vocabulary terms with definitions and example sentences. Built with a focus on excellent readability and minimal cognitive load, it follows Material Design principles adapted for educational purposes.

The application uses a modern full-stack architecture with React on the frontend and Express on the backend, with PostgreSQL as the database. Users can create accounts, authenticate, and manage their personal vocabulary collections in a distraction-free, scholarly aesthetic environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript and Vite for build tooling

**Routing**: Wouter for client-side routing with protected and public route components

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. Query keys follow REST-style patterns (e.g., `['/api/entries']`).

**UI Component Library**: Shadcn UI (New York style) with Radix UI primitives and Tailwind CSS for styling. All components are locally defined in `client/src/components/ui/` for full customization.

**Design System**:
- Typography: Noto Serif font family loaded via Google Fonts CDN
- Color scheme: Custom HSL-based color system with light/dark theme support
- Spacing: Tailwind utility-first approach with standard units (2, 4, 6, 8)
- Layout: Max-width containers (max-w-4xl) for optimal reading experience
- Design philosophy: Material Design principles adapted for reading-focused applications

**Form Handling**: React Hook Form with Zod validation and @hookform/resolvers for schema integration

**Authentication Flow**: 
- Context-based auth provider with session management
- Protected routes redirect to login when unauthenticated
- Public routes (login/register) redirect to home when authenticated
- Session state managed via React Query with `/api/auth/me` endpoint

**Theme System**: Custom theme provider with localStorage persistence supporting light/dark modes

### Backend Architecture

**Runtime**: Node.js with TypeScript

**Framework**: Express.js with session-based authentication

**Session Management**: express-session with optional connect-pg-simple for PostgreSQL session storage

**Development Mode**: Custom Vite middleware integration for HMR and SSR in development (`server/index-dev.ts`)

**Production Mode**: Static file serving from built assets (`server/index-prod.ts`)

**API Design**: RESTful API with the following endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication  
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/me` - Current user session
- `GET /api/entries` - List user's vocabulary entries
- `POST /api/entries` - Create new entry
- `PUT /api/entries/:id` - Update existing entry
- `DELETE /api/entries/:id` - Delete entry

**Authentication**: 
- bcrypt for password hashing (10 salt rounds)
- Session-based authentication with httpOnly cookies
- Middleware function `requireAuth` protects authenticated routes
- User ID stored in session data

**Data Access Layer**: Storage abstraction interface (`IStorage`) with `DatabaseStorage` implementation using Drizzle ORM

**Validation**: Zod schemas shared between client and server via `shared/schema.ts`

### Data Storage

**Database**: PostgreSQL via Neon serverless with WebSocket support

**ORM**: Drizzle ORM with schema-first approach

**Schema Design**:

```typescript
users table:
- id (UUID, primary key, auto-generated)
- username (text, unique, not null)
- password (text, not null - bcrypt hashed)

vocabulary_entries table:
- id (UUID, primary key, auto-generated)
- userId (UUID, foreign key to users, cascade delete)
- term (text, not null)
- definition (text, not null)
- example (text, not null)
- createdAt (timestamp, default now)
- updatedAt (timestamp, default now)
```

**Relations**: 
- One-to-many relationship between users and vocabulary entries
- Cascade delete ensures entries are removed when user is deleted

**Migrations**: Managed via drizzle-kit with migrations stored in `/migrations` directory

### External Dependencies

**Database**: 
- @neondatabase/serverless - Neon PostgreSQL serverless driver with WebSocket support
- drizzle-orm - TypeScript ORM for type-safe database queries
- drizzle-kit - Migration and schema management tooling

**Authentication**:
- bcrypt - Password hashing
- express-session - Session middleware
- connect-pg-simple - PostgreSQL session store (optional)

**Frontend Libraries**:
- @tanstack/react-query - Server state management
- wouter - Lightweight routing
- react-hook-form - Form state management
- zod - Schema validation
- @hookform/resolvers - Integration between react-hook-form and zod

**UI Components**:
- @radix-ui/* - Comprehensive set of accessible UI primitives
- tailwindcss - Utility-first CSS framework
- class-variance-authority - Component variant management
- tailwind-merge - Conflict-free Tailwind class merging

**Development Tools**:
- vite - Frontend build tool and dev server
- tsx - TypeScript execution for Node.js
- @replit/vite-plugin-* - Replit-specific development plugins

**Fonts**: Google Fonts CDN for Noto Serif font family (all weights, regular and italic)