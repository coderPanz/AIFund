"""
AI Fund Service - Portfolio Recommendation API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os

router = APIRouter()

class RiskAssessmentRequest(BaseModel):
    answers: List[int]

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

# 加载配置数据
def load_portfolio_data():
    data_path = os.path.join(
        os.path.dirname(__file__),
        "../../../data/funds/portfolios.json"
    )
    if os.path.exists(data_path):
        with open(data_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"portfolios": {}}

# 风险等级描述
RISK_PROFILES = {
    1: {"type": "保守型", "description": "您倾向于低风险投资，适合以债券、货币基金为主的稳健配置。"},
    2: {"type": "稳健型", "description": "您可以承受适度风险，适合股债平衡型的配置方案。"},
    3: {"type": "平衡型", "description": "您追求风险与收益的平衡，适合股债均衡配置。"},
    4: {"type": "成长型", "description": "您能承受较高风险追求更高收益，适合偏股型配置。"},
    5: {"type": "进取型", "description": "您追求较高收益，能承受较大波动，适合积极型配置。"}
}

@router.post("/risk-assessment")
async def calculate_risk_level(request: RiskAssessmentRequest):
    """计算风险等级"""
    if not request.answers:
        raise HTTPException(status_code=400, detail="请完成风险测评问卷")

    # 计算平均分
    total_score = sum(request.answers)
    avg_score = total_score / len(request.answers)

    # 映射到风险等级
    risk_level = max(1, min(5, round(avg_score)))

    profile = RISK_PROFILES.get(risk_level, RISK_PROFILES[3])

    return {
        "level": risk_level,
        "type": profile["type"],
        "description": profile["description"]
    }

@router.get("/suggestion/{risk_level}")
async def get_portfolio_suggestion(risk_level: int):
    """获取配置建议"""
    if risk_level < 1 or risk_level > 5:
        raise HTTPException(status_code=400, detail="风险等级必须在1-5之间")

    data = load_portfolio_data()
    portfolio = data.get("portfolios", {}).get(str(risk_level))

    if not portfolio:
        # 返回默认配置
        portfolio = get_default_portfolio(risk_level)

    return portfolio

def get_default_portfolio(risk_level: int) -> dict:
    """获取默认配置"""
    default_portfolios = {
        1: {
            "id": "conservative",
            "name": "稳健保守型配置",
            "riskLevel": 1,
            "expectedReturn": 4.5,
            "expectedRisk": -5.0,
            "allocations": [
                {"fundCode": "050025", "fundName": "博时信用债券A", "ratio": 60, "reason": "核心债券配置"},
                {"fundCode": "519678", "fundName": "银河稳健债券A", "ratio": 30, "reason": "补充债券配置"},
                {"fundCode": "000961", "fundName": "沪深300ETF", "ratio": 10, "reason": "适度权益配置"}
            ]
        },
        3: {
            "id": "balanced",
            "name": "平衡型配置",
            "riskLevel": 3,
            "expectedReturn": 9.0,
            "expectedRisk": -18.0,
            "allocations": [
                {"fundCode": "519778", "fundName": "交银定期支付双息平衡混合", "ratio": 30, "reason": "核心平衡配置"},
                {"fundCode": "000961", "fundName": "沪深300ETF", "ratio": 30, "reason": "核心宽基指数"},
                {"fundCode": "163406", "fundName": "兴全合润混合", "ratio": 20, "reason": "主动管理增强"},
                {"fundCode": "050025", "fundName": "博时信用债券A", "ratio": 20, "reason": "债券配置"}
            ]
        },
        5: {
            "id": "aggressive",
            "name": "进取型配置",
            "riskLevel": 5,
            "expectedReturn": 15.0,
            "expectedRisk": -40.0,
            "allocations": [
                {"fundCode": "004854", "fundName": "广发高端制造股票A", "ratio": 30, "reason": "高端制造主题"},
                {"fundCode": "270050", "fundName": "广发纳斯达克100指数A", "ratio": 25, "reason": "海外科技配置"},
                {"fundCode": "110011", "fundName": "易方达中小盘混合", "ratio": 25, "reason": "主动管理增强"},
                {"fundCode": "000961", "fundName": "沪深300ETF", "ratio": 20, "reason": "宽基指数底仓"}
            ]
        }
    }

    return default_portfolios.get(risk_level, default_portfolios[3])

@router.get("/risk-profiles")
async def get_risk_profiles():
    """获取所有风险等级描述"""
    return RISK_PROFILES