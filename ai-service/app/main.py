"""
AI Fund Investment Service
Main FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, analyze, portfolio
import os

app = FastAPI(
    title="AI Fund Investment Service",
    description="AI-powered fund analysis and recommendation service",
    version="0.1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["Analyze"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-fund-service"}

@app.get("/")
async def root():
    return {
        "service": "AI Fund Investment Service",
        "version": "0.1.0",
        "docs": "/docs"
    }