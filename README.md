# Expancify AI

AI-powered expense management assistant for tracking, categorizing, and analyzing personal or team spending.

## Overview

Expancify AI helps you:
- Record expenses quickly
- Auto-categorize transactions using AI
- Generate spending insights and summaries
- Monitor budgets and identify unusual spending patterns

This project is designed for students who want a modern tracker finance .

## Features

- **Expense tracking**: Add, edit, and delete expense records
- **Smart categorization**: AI-assisted transaction tagging
- **Budget visibility**: Category-wise and total budget usage
- **Analytics dashboard**: Spending trends and breakdowns
- **Search & filtering**: Find expenses by date, category, amount, or keywords
- **Export-ready data**: Prepare records for reporting and analysis

## Tech Stack

Typical setup:
- **Frontend**: React
- **Backend**: Node.js and Express.j
- **Database**:  MongoDB 
- **AI layer**: LLM API integration for categorization and insights
- **Auth**: JWT 

## Project Structure

```text
Expancify_ai/
├─ frontend/              # UI application (if split architecture)
├─ backend/               # API and business logic
└─ README.md
```

## Getting Started

### Prerequisites

- Git
- Node.js (LTS recommended)
- npm 
- Database instance (if required by the backend)
- API key for the AI provider (if applicable)

### 1) Clone the repository

```bash
git clone https://github.com/KunalChoudhary03/Expancify_ai.git
cd Expancify_ai
```

### 2) Install dependencies



If split into frontend/backend:

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 3) Configure environment variables

Create a `.env` file (or `.env.local`) in the relevant app directory.

Example:

```env
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=your_database_connection_string

# Auth
JWT_SECRET=replace_with_secure_value

# AI Provider
OPENAI_API_KEY=your_api_key
```

Only include variables your code actually uses.

### 4) Run the app

Single app:

```bash
npm run dev
```

Frontend + backend (separate terminals):

```bash
# terminal 1
cd backend
npm run dev
```

```bash
# terminal 2
cd frontend
npm run dev
```

### 5) Open in browser

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000` (or configured port)

## Available Scripts

Use scripts defined in `package.json`. Common examples:

- `npm run dev` — start development server
- `npm run build` — production build
- `npm start` — run production server
- `npm test` — run tests
- `npm run lint` — run lint checks

## API Notes (if backend exists)

Typical expense endpoints:

- `POST /expenses` — create expense
- `GET /expenses` — list expenses
- `GET /expenses/:id` — get one expense
- `PUT /expenses/:id` — update expense
- `DELETE /expenses/:id` — delete expense
- `POST /expenses/categorize` — AI categorization.

## Development Guidelines

- Keep secrets in `.env` files, never commit credentials
- Validate user input before persistence
- Add tests for expense calculations and AI categorization fallback logic
- Prefer deterministic defaults when AI output is unavailable

## Troubleshooting

- **App fails to start**: verify Node version and install dependencies again
- **Database connection errors**: check `DATABASE_URL` and DB availability
- **AI responses failing**: verify API key, provider limits, and network access
- **CORS/auth issues**: verify backend CORS config and token handling

## Contribution

1. Fork the repository
2. Create a feature branch
3. Commit with clear messages
4. Open a pull request with:
   - problem statement
   - implementation details
   - test evidence/screenshots

## License

Add the project license here (e.g., MIT) once finalized.
