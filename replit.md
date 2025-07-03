# QR Code Converter

## Overview

This is a full-stack web application for converting URLs to QR codes and decoding QR codes back to URLs. The application is built using a modern tech stack with React on the frontend, Express.js on the backend, and PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **File Upload**: Multer for handling image uploads
- **QR Code Generation**: QRCode library for generating QR codes
- **QR Code Decoding**: Jimp and qrcode-reader for image processing and QR decoding
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Database Design
- **Primary Database**: PostgreSQL (configured via Neon serverless)
- **Schema**: Single table `qr_activities` tracking user actions
- **Fallback Storage**: In-memory storage for development/testing

## Key Components

### Frontend Components
1. **UrlToQr**: Component for converting URLs to QR codes
2. **QrToUrl**: Component for uploading and decoding QR code images
3. **RecentActivity**: Component displaying recent conversion history
4. **UI Components**: Comprehensive set of reusable UI components from Shadcn/ui

### Backend Services
1. **QR Generation API**: `/api/generate-qr` - Converts URL to QR code data URL
2. **QR Decoding API**: `/api/decode-qr` - Decodes uploaded QR code images
3. **Activity Tracking**: Stores user activities for recent history
4. **File Processing**: Handles image uploads and processing

## Data Flow

1. **URL to QR Generation**:
   - User enters URL in frontend form
   - Frontend validates URL format
   - POST request to `/api/generate-qr` with URL
   - Backend generates QR code using QRCode library
   - Activity logged to database
   - QR code data URL returned to frontend

2. **QR to URL Decoding**:
   - User uploads image file via frontend
   - Frontend sends multipart form data to `/api/decode-qr`
   - Backend processes image using Jimp
   - QR code decoded using qrcode-reader
   - Activity logged to database
   - Decoded URL returned to frontend

3. **Activity History**:
   - Recent activities fetched from `/api/activities`
   - Activities can be cleared via DELETE to `/api/activities`
   - Real-time updates using TanStack Query

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database ORM
- **qrcode**: QR code generation library
- **jimp**: Image processing library
- **qrcode-reader**: QR code decoding library
- **multer**: File upload middleware

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library

## Deployment Strategy

### Build Process
- **Development**: `npm run dev` - Runs both frontend and backend in development mode
- **Production Build**: `npm run build` - Builds frontend with Vite and backend with esbuild
- **Database Migration**: `npm run db:push` - Pushes schema changes to database

### Environment Requirements
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)

### File Structure
- `client/`: React frontend application
- `server/`: Express.js backend application
- `shared/`: Shared TypeScript types and schemas
- `dist/`: Built application files

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```