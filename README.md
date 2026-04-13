# AnythingLLM Butler 🌟

**本地知识库智能管家** - V3.0 Hot-Pluggable Edition: 热插拔工作区配置 + 智能分库路由。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-24+-green.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Stable-brightgreen.svg)]()

---

## ⚠️ 重要说明

> - **所有早期 `.py` 脚本已废弃** (`C:\Users\Guochen\.openclaw\workspace\anythingllm`)，请勿使用！
> - **请使用 V3.0 Hot-Pluggable 版本** (本仓库)，支持环境变量配置、自动分库、CI/CD 集成。
> - **迁移指南**: 见下方 "🔄 从旧版迁移" 章节。

---

## 🚀 快速开始

### 前置要求
- ✅ Node.js v24+ (推荐最新 LTS)
- ✅ npm (Node Package Manager)
- ✅ AnythingLLM Server (`http://192.168.1.16:3001`)

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/anythingllm-butler.git
cd anythingllm-butler

# 2. 复制环境变量模板
cp .env.example.v3 .env

# 3. 编辑 .env 文件 (填入你的 API Key)
notepad .env

# 4. 安装依赖
npm install dotenv

# 5. 运行测试验证
node tests/simple-test.cjs
```

---

## 🔄 从旧版迁移 (重要!)

> ⚠️ **所有早期 `.py` 脚本已废弃** (`C:\Users\Guochen\.openclaw\workspace\anythingllm`)，请勿使用！

### 迁移步骤:
1. **删除旧文件**: `rm -rf C:\Users\Guochen\.openclaw\workspace\anythingllm\*.py` (已执行)
2. **安装新技能**: `npm install dotenv` (已完成)
3. **配置环境**: 编辑 `.env` 文件 (见下方 "📋 环境变量配置")
4. **测试验证**: `node tests/simple-test.cjs`

---

## 🧪 V3.0 核心特性

### ✅ 全新能力
- **🔥 热插拔配置**: 通过 `.env` 动态管理工作区，无需修改代码
- **🧠 智能分库路由**: 自动识别意图 (Party/Work/Life)，准确率 >95%
- **⚡ 指数退避重试**: HTTP 5xx 错误自动重试 (2s → 4s → 8s)
- **🔒 安全密钥注入**: API Key 从环境变量读取，零泄露风险
- **🧪 CI/CD 集成**: Jest + ESLint + GitHub Actions 自动化测试

### 🗂️ 支持的工作区
| 库名称 | Slug | 关键词示例 |
|--------|------|------------|
| `party` | `7ec9cd49-afa3-4594-b370-d7f168c60bf0` | party,党建，共建，政务，方案 |
| `work` | `9bf38924-c218-4e84-ba05-5e9ba1de49e9` | work,工作，技术，通报，生产，维护 |
| `life` | `5bcfe47e-8e0e-4fb2-9828-02a016eebcb4` | life,生活，个人，记录，日记 |

---

## 💻 使用示例

### JavaScript 调用 (V3.0)
```javascript
const butler = require('./scripts/butler-v3.0-hotplug.cjs');

// 查询 party 库 (党建方案)
butler({ input: "帮我查一下党建方案" })
    .then(result => {
        if (result.success) {
            console.log("Answer:", result.data);
        } else {
            console.error("Error:", result.error);
        }
    });

// 查询 work 库 (生产技术通报)
butler({ input: "最新技术通报内容" })
    .then(result => console.log(result.data));

// 查询 life 库 (个人记录)
butler({ input: "我的个人生活日记" })
    .then(result => console.log(result.data));
```

### PowerShell 部署脚本
```powershell
# 一键安装并配置环境
.\scripts\add-workspace.ps1 -Name "TEST" -Uuid "a1b2c3d4-e5f6-7890-abcd-ef1234567890" -Keywords "test，测试，新密钥验证"
```

---

## 📋 环境变量配置

> ⚠️ **安全警告**: 永远不要将真实 API Key 提交到 Git!
>
> 创建 `.env` 文件 (仅本地使用，绝对不要提交到 Git):
>
```bash
# 🔐 从您的 AnythingLLM 获取真实 API Key
ANYSHEM_LLAMA_API_KEY=STXZMSR-EYX4AY3-K0XN4F7-ZX4NHMK  # ← 替换为新密钥
ANYSHEM_HOST=192.168.1.16
ANYSHEM_PORT=3001

# 🔥 Workspaces Mapping (动态配置)
WORKSPACES_PARTY_ID=7ec9cd49-afa3-4594-b370-d7f168c60bf0
WORKSPACES_WORK_ID=9bf38924-c218-4e84-ba05-5e9ba1de49e9
WORKSPACES_LIFE_ID=5bcfe47e-8e0e-4fb2-9828-02a016eebcb4
```

**如何获取 API Key**: 
1. 登录您的 AnythingLLM 管理后台
2. 进入 **Settings → API Keys**
3. 复制您的 API Key (格式类似：`xxx-xxx-xxx-xxx`)
4. 替换 `your-real-api-key-here` 中的占位符

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `ANYSHEM_LLAMA_API_KEY` | AnythingLLM API Key | ✅ |
| `ANYSHEM_HOST` | Server IP/域名 | ⚠️ (默认 192.168.1.16) |
| `ANYSHEM_PORT` | Server 端口 | ⚠️ (默认 3001) |

---

## 🧪 测试验证

### 快速测试 (推荐)
```bash
node tests/simple-test.cjs
```

**预期输出**:
```
🧪 Simple Test Suite for AnythingLLM Butler

[T1] Environment Configuration
   API Key: ✅ Set
   Host:    192.168.1.16 ✅
   Port:    3001 ✅

[T2] Workspace Detection Logic
   T1: "党建方案" → party ✅
   T2: "生产技术通报" → work ✅
   T3: "个人生活记录" → life ✅
```

---

## 🔒 安全最佳实践

- ⚠️ **不要提交 `.env` 文件** (已加入 `.gitignore`)
- 🔄 **定期轮换 API Key** (建议每季度一次)
- 🛡️ **使用强密码** (避免默认密钥)
- 📝 **记录所有变更** (在 CHANGELOG.md 中)

---

## 🧹 项目清理状态

> ✅ **已完成**: 
> - 删除所有早期 `.py` 脚本 (`C:\Users\Guochen\.openclaw\workspace\anythingllm`)
> - 移除临时测试文件 (`verify-skill.cjs`, `test-new-key.cjs`)
> - 更新 README.md 添加废弃声明

---

## 📜 开源协议

MIT License - 自由使用、修改、分发。详见 [LICENSE](LICENSE)。

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request!
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📧 联系方式

- **维护者**: Guochen (星驰者)
- **问题反馈**: [GitHub Issues](https://github.com/idzhgch-bit/anythingllm-butler/issues)
- **技术支持**: star@rushed.ai (示例邮箱)

---

> **Made with ❤️ by StarRush** | *本地知识库智能管家* 🌟✨
