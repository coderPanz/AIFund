# AI 基金投资平台 MVP

一个基于 AI 的基金投资助手平台，帮助普通投资者解决"不会选基金、不知道如何配置资产"的问题。

## 功能特性

- **基金库浏览** - 多维度筛选和排序基金
- **AI 选基助手** - 对话式智能选基推荐
- **资产配置** - 风险测评 + 个性化配置建议
- **基金详情** - 净值走势、业绩指标、AI 分析

## 技术栈

### 前端
- React 19 + TypeScript
- Vite
- TanStack Query
- ECharts
- Tailwind CSS

### BFF 层
- Node.js + Hono.js
- TypeScript

### AI 服务
- Python + FastAPI
- Pydantic

### 数据层
- 静态 JSON 数据（MVP 阶段）

## 项目结构

```
AIFund/
├── frontend/           # React 前端应用
│   ├── src/
│   │   ├── components/ # UI 组件
│   │   ├── pages/      # 页面组件
│   │   ├── api/        # API 接口
│   │   ├── types/      # TypeScript 类型
│   │   └── utils/      # 工具函数
│   └── ...
├── backend/            # Node.js BFF 层
│   ├── src/
│   │   ├── routes/     # API 路由
│   │   └── index.ts    # 入口文件
│   └── ...
├── ai-service/         # Python AI 服务
│   ├── app/
│   │   ├── api/        # API 路由
│   │   ├── models/     # 数据模型
│   │   └── main.py     # 入口文件
│   └── ...
├── data/               # 静态数据
│   ├── funds/          # 基金数据
│   ├── market/         # 市场数据
│   └── prompts/        # AI Prompt 模板
└── scripts/            # 启动脚本
```

## 快速开始

### 环境要求

- Node.js >= 18
- Python >= 3.10
- pnpm / npm / yarn

### 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend && npm install

# 安装后端依赖
cd ../backend && npm install

# 安装 AI 服务依赖
cd ../ai-service && pip install -r requirements.txt
```

### 启动开发服务器

```bash
# 方式1：同时启动前端和后端
npm run dev

# 方式2：分别启动
# 终端1 - 启动 BFF 层
cd backend && npm run dev

# 终端2 - 启动前端
cd frontend && npm run dev

# 终端3 - 启动 AI 服务（可选）
cd ai-service && python -m uvicorn app.main:app --reload --port 8000
```

### 访问地址

- 前端：http://localhost:3000
- BFF API：http://localhost:3001/api
- AI 服务：http://localhost:8000

## API 接口

### 基金相关

| 接口 | 方法 | 描述 |
|-----|------|------|
| `/api/funds` | GET | 获取基金列表 |
| `/api/funds/:code` | GET | 获取基金详情 |
| `/api/funds/:code/nav` | GET | 获取净值历史 |

### AI 相关

| 接口 | 方法 | 描述 |
|-----|------|------|
| `/api/ai/chat` | POST | AI 选基对话 |
| `/api/ai/suggestions` | GET | 获取推荐问题 |

### 资产配置

| 接口 | 方法 | 描述 |
|-----|------|------|
| `/api/portfolio/risk-assessment` | POST | 提交风险测评 |
| `/api/portfolio/suggestion` | GET | 获取配置建议 |

### 市场数据

| 接口 | 方法 | 描述 |
|-----|------|------|
| `/api/market/overview` | GET | 获取市场概览 |

## 后续规划

### v1.0
- [ ] 用户系统（登录/收藏）
- [ ] 实时数据更新
- [ ] 基金对比功能
- [ ] 定投计算器

### v2.0
- [ ] 实时行情推送
- [ ] 多账户管理
- [ ] 社区功能
- [ ] 移动端适配

### v3.0
- [ ] 券商对接
- [ ] 智能定投策略
- [ ] 投顾资质

## 免责声明

本平台提供的所有信息和建议仅供参考，不构成投资建议。投资有风险，入市需谨慎。

## License

MIT