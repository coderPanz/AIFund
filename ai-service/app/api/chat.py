"""
AI Fund Service - API Routes
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List, AsyncGenerator
import json
import asyncio

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str

# 预定义的回答模板
RESPONSES = {
    "科技": """
关于科技主题基金投资，我有以下建议：

## 推荐基金类型

1. **指数型科技基金**
   - 纳斯达克100指数基金：布局全球科技巨头
   - 科技ETF：跟踪科技板块整体表现

2. **主动管理型科技基金**
   - 关注基金经理的选股能力
   - 看重长期业绩表现

## 投资策略

- **分散投资**：不要集中于单一细分领域
- **定投策略**：科技股波动大，建议分批建仓
- **长期持有**：科技行业需要时间兑现成长

## 风险提示

科技板块估值较高，波动性大，请根据自身风险承受能力谨慎投资。
""",
    "债券": """
关于低风险债券基金，我推荐以下选择：

## 债券基金类型

1. **纯债基金**
   - 主要投资国债、金融债
   - 波动小，收益稳定

2. **信用债基金**
   - 投资企业债券
   - 收益略高，风险也略高

3. **短债基金**
   - 投资短期债券
   - 流动性好，风险最低

## 选择标准

- 基金规模10亿以上
- 最大回撤控制良好
- 费率较低

## 收益预期

债券基金年化收益一般在3%-6%之间。
""",
    "定投": """
关于指数基金定投，我的建议如下：

## 推荐指数

1. **宽基指数**
   - 沪深300：大盘蓝筹代表
   - 中证500：中盘成长代表
   - 创业板指：新兴产业代表

2. **行业指数**
   - 消费、医药、科技等长期看好行业

3. **海外指数**
   - 纳斯达克100
   - 标普500

## 定投策略

- 每月固定金额投资
- 设置止盈点（如30%）
- 市场大跌时增加定投

## 优势

指数基金费率低，透明度高，适合长期定投。
""",
    "配置": """
关于资产配置，我建议根据风险偏好进行分层配置：

## 保守型配置
- 债券基金：60-80%
- 股票基金：20-40%

## 平衡型配置
- 债券基金：40-50%
- 股票基金：40-50%
- 海外基金：10%

## 进取型配置
- 股票基金：60-80%
- 海外基金：10-20%
- 债券基金：10-20%

## 配置原则

1. 分散投资，不集中于单一资产
2. 定期再平衡
3. 根据人生阶段调整

建议您完成风险测评，获取个性化配置建议。
"""
}

async def generate_stream(text: str) -> AsyncGenerator[str, None]:
    """生成流式响应"""
    for char in text:
        yield char
        await asyncio.sleep(0.02)

def get_response(message: str) -> str:
    """根据消息内容返回对应回复"""
    message_lower = message.lower()

    for keyword, response in RESPONSES.items():
        if keyword in message_lower:
            return response

    # 默认回复
    return """
感谢您的咨询！我可以帮助您：

1. **基金推荐** - 根据您的投资目标推荐合适的基金
2. **基金分析** - 分析基金的投资价值和风险特征
3. **投资建议** - 提供资产配置和定投策略建议

请告诉我您的投资需求，例如：
- "我想投资科技主题基金"
- "低风险的债券基金有哪些"
- "如何进行指数基金定投"
- "帮我规划资产配置"

我会为您提供专业的建议。
"""

@router.post("/message")
async def chat_message(request: ChatRequest):
    """普通聊天接口"""
    response = get_response(request.message)
    return ChatResponse(response=response)

@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """流式聊天接口"""
    response = get_response(request.message)

    async def event_generator():
        async for char in generate_stream(response):
            yield char

    return StreamingResponse(
        event_generator(),
        media_type="text/plain; charset=utf-8"
    )

@router.get("/suggestions")
async def get_suggestions():
    """获取推荐问题"""
    return {
        "suggestions": [
            "我想投资科技主题基金，有什么推荐？",
            "低风险的债券基金有哪些？",
            "想定投指数基金，选哪个好？",
            "如何构建一个稳健的资产组合？"
        ]
    }