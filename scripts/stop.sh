#!/bin/bash

# AI Fund Platform - Stop Script

echo "🛑 Stopping AI Fund Platform..."

# Kill any running node processes on our ports
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo "✅ All services stopped."