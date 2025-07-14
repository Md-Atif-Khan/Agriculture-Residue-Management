# Agriculture Residue Management - Agent Guide

## Build/Test Commands
- **Frontend**: `cd frontEnd && npm start` (dev server), `npm run build` (production), `npm test` (Jest tests)
- **Backend**: `cd backend && npm run dev:server` (main API server on port 8000), `npm run dev:auction` (auction server on port 8001)  
- **AuctionServer**: `cd AuctionServer && npm run dev` (standalone auction server on port 8001)
- **Seed Admin**: `cd backend && npm run seed:admin` (creates admin user)

## Architecture
- **Frontend**: React 18 with Router, Context API, Axios, Socket.io client (port 3000)
- **Backend**: Express.js API server (port 8000) + Socket.io auction server (port 8001)
- **AuctionServer**: Standalone auction server with Express + Socket.io (port 8001)
- **Database**: MongoDB at `mongodb://localhost:27017/stubbleburning`
- **Authentication**: JWT tokens with middleware, stored in localStorage

## Code Style
- **Backend**: CommonJS modules (`require/module.exports`), camelCase naming, async/await patterns
- **Frontend**: ES6 modules (`import/export`), functional components with hooks, camelCase for variables
- **Error Handling**: Try/catch blocks, consistent error responses (`res.status(500).json({msg: 'Server error'})`)
- **Imports**: Group external modules first, then internal modules (models, middleware, utils)
- **Auth**: JWT with `x-auth-token` header, middleware pattern for route protection
- **Components**: Functional components with hooks, Context API for global state
- **Database**: Mongoose models with validation, ObjectId references for relationships
