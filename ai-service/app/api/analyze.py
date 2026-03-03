"""
AI Fund Service - Fund Analysis API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import json
import os

router = APIRouter()

class FundAnalysisRequest(BaseModel):
    fund_code: str
    analysis_type: Optional[str] = "comprehensive"  # comprehensive, risk, performance

class HoldingInfo(BaseModel):
    name: str
    ratio: float
    type: str

class FundAnalysisResponse(BaseModel):
    fund_code: str
    fund_name: str
    analysis: str
    risk_level: int
    strengths: List[str]
    risks: List[str]

# 加载基金数据
def load_fund_data():
    data_path = os.path.join(
        os.path.dirname(__file__),
        "../../../data/funds/funds.json"
    )
    if os.path.exists(data_path):
        with open(data_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"funds": []}

def analyze_fund(fund: dict) -> dict:
    """分析基金并生成AI解读"""
    metrics = fund.get("metrics", {})

    # 优势分析
    strengths = []
    if metrics.get("sharpeRatio", 0) > 1:
        strengths.append("夏普比率较高，风险调整后收益优秀")
    if metrics.get("maxDrawdown", 0) > -20:
        strengths.append("最大回撤控制良好")
    if metrics.get("threeYearReturn", 0) > 30:
        strengths.append("三年业绩表现优异")
    if fund.get("scale", 0) > 100:
        strengths.append("基金规模适中，流动性好")

    # 风险分析
    risks = []
    if metrics.get("maxDrawdown", 0) < -30:
        risks.append("历史最大回撤较大，波动性高")
    if metrics.get("volatility", 0) > 20:
        risks.append("基金波动率较高")
    if fund.get("riskLevel", 3) >= 4:
        risks.append("基金风险等级较高")

    # 生成分析报告
    analysis = f"""
## {fund.get('name', '')}（{fund.get('code', '')}）分析报告

### 基本信息
- 基金类型：{fund.get('type', '')}
- 基金经理：{fund.get('manager', '')}
- 基金公司：{fund.get('company', '')}
- 基金规模：{fund.get('scale', 0):.2f}亿元

### 业绩表现
- 近一年收益：{metrics.get('oneYearReturn', 0):.2f}%
- 近三年收益：{metrics.get('threeYearReturn', 0):.2f}%
- 年化收益：{metrics.get('annualizedReturn', 0):.2f}%

### 风险指标
- 最大回撤：{metrics.get('maxDrawdown', 0):.2f}%
- 波动率：{metrics.get('volatility', 0):.2f}%
- 夏普比率：{metrics.get('sharpeRatio', 0):.2f}

### 投资建议
该基金适合{'风险承受能力较强的' if fund.get('riskLevel', 3) >= 4 else '追求稳健收益的'}投资者，
建议{'定投或分批建仓' if fund.get('riskLevel', 3) >= 4 else '长期持有'}。
"""

    return {
        "strengths": strengths or ["基金经理经验丰富"],
        "risks": risks or ["市场系统性风险"],
        "analysis": analysis
    }

@router.post("/fund")
async def analyze_fund_endpoint(request: FundAnalysisRequest):
    """分析单个基金"""
    data = load_fund_data()
    fund = next(
        (f for f in data.get("funds", []) if f.get("code") == request.fund_code),
        None
    )

    if not fund:
        raise HTTPException(status_code=404, detail="基金不存在")

    analysis_result = analyze_fund(fund)

    return FundAnalysisResponse(
        fund_code=fund.get("code"),
        fund_name=fund.get("name"),
        analysis=analysis_result["analysis"],
        risk_level=fund.get("riskLevel", 3),
        strengths=analysis_result["strengths"],
        risks=analysis_result["risks"]
    )

@router.post("/compare")
async def compare_funds(fund_codes: List[str]):
    """比较多个基金"""
    data = load_fund_data()
    funds = [f for f in data.get("funds", []) if f.get("code") in fund_codes]

    if not funds:
        raise HTTPException(status_code=404, detail="未找到指定基金")

    comparison = []
    for fund in funds:
        metrics = fund.get("metrics", {})
        comparison.append({
            "code": fund.get("code"),
            "name": fund.get("name"),
            "type": fund.get("type"),
            "oneYearReturn": metrics.get("oneYearReturn", 0),
            "maxDrawdown": metrics.get("maxDrawdown", 0),
            "sharpeRatio": metrics.get("sharpeRatio", 0)
        })

    return {
        "funds": comparison,
        "recommendation": "建议综合考虑收益、风险和投资目标选择适合的基金"
    }