"""
AI Fund Service Models
"""
from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str

class FundInfo(BaseModel):
    code: str
    name: str
    type: str
    manager: str
    company: str
    scale: float

class FundMetrics(BaseModel):
    annualizedReturn: float
    sharpeRatio: float
    maxDrawdown: float
    volatility: float
    oneYearReturn: float
    threeYearReturn: float

class Allocation(BaseModel):
    fundCode: str
    fundName: str
    ratio: float
    reason: str

class PortfolioSuggestion(BaseModel):
    id: str
    name: str
    riskLevel: int
    expectedReturn: float
    expectedRisk: float
    allocations: List[Allocation]