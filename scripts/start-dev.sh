#!/bin/bash

# AI Fund Platform - Development Start Script

echo "🚀 Starting AI Fund Platform..."

# Check if dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check Python dependencies
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "📦 Installing Python dependencies..."
    cd ai-service && pip install -r requirements.txt && cd ..
fi

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "Starting services..."
echo "  - Frontend: http://localhost:3000"
echo "  - Backend:  http://localhost:3001"
echo ""

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Start frontend in background
cd frontend && npm run dev &
FRONTEND_PID=$!

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

wait