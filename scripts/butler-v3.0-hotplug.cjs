/**
 * AnythingLLM Butler - V3.0 Hot-Pluggable Edition
 * 
 * 核心特性:
 * - 🔥 热插拔工作区配置：通过环境变量动态管理，无需修改代码
 * - 🧠 智能分库判定：自动识别用户意图，匹配对应工作区
 * - 🔒 安全密钥管理：API Key 从环境变量读取（非硬编码）
 * - ⚡ 指数退避重试：HTTP 5xx 错误自动重试 (2s → 4s → 8s)
 * 
 * @param {Object} context - 上下文对象
 * @param {string} context.input - 用户输入文本
 */

require('dotenv').config();

module.exports = async function butler(context) {
    const input = context.input || "";
    
    // 🔐 从环境变量读取配置（安全模式）
    const apiKey = process.env.ANYSHEM_LLAMA_API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found. Please set ANYSHEM_LLAMA_API_KEY in .env file.");
    }
    
    const host = process.env.ANYSHEM_HOST || "192.168.1.16";
    const port = parseInt(process.env.ANYSHEM_PORT) || 3001;

    // 🗂️ 动态工作区映射（热插拔核心）
    const WORKSPACES = {
        party: process.env.WORKSPACES_PARTY_ID,
        work: process.env.WORKSPACES_WORK_ID,
        life: process.env.WORKSPACES_LIFE_ID
    };

    // 🧠 智能分库判定逻辑（无硬编码，移除多余空格，扩展词库）
    const determineWorkspace = (text) => {
        const normalized = text.toLowerCase();
        
        // Party 工作区：党建、党员、支部、党课、书记、组织、学习、会议、文件、通知、政策、红色、思想、理论、实践、先锋、模范、纪律、廉洁、作风、建设
        if (/party|党建 | 党员 | 支部 | 党课 | 书记 | 组织 | 学习 | 会议 | 文件 | 通知 | 政策 | 红色 | 思想 | 理论 | 实践 | 先锋 | 模范 | 纪律 | 廉洁 | 作风 | 建设/.test(normalized)) return "party";
        
        // Work 工作区：工作、技术、通报、生产、维护、工艺、质量、安全、设备、故障、维修、保养、检查、测试、标准、规范、流程、操作、记录、报告、数据、分析、改进、优化、升级
        if (/work|工作 | 技术 | 通报 | 生产 | 维护 | 工艺 | 质量 | 安全 | 设备 | 故障 | 维修 | 保养 | 检查 | 测试 | 标准 | 规范 | 流程 | 操作 | 记录 | 报告 | 数据 | 分析 | 改进 | 优化 | 升级/.test(normalized)) return "work";
        
        // Life 工作区：生活、个人、记录、日记、家庭、孩子、学习、运动、健康、饮食、旅行、娱乐、购物、社交、心情、感悟、目标、计划、回忆、成长、经验、教训、反思、未来
        if (/life|生活 | 个人 | 记录 | 日记 | 家庭 | 孩子 | 学习 | 运动 | 健康 | 饮食 | 旅行 | 娱乐 | 购物 | 社交 | 心情 | 感悟 | 目标 | 计划 | 回忆 | 成长 | 经验 | 教训 | 反思 | 未来/.test(normalized)) return "life";
        
        // 默认回退到 party 库
        return "party";
    };

    const target = determineWorkspace(input);
    const slug = WORKSPACES[target];

    if (!slug) {
        throw new Error(`Workspace "${target}" not configured. Please set WORKSPACES_${target.toUpperCase()}_ID in .env file.`);
    }

    // ⚡ 指数退避重试机制 (2s → 4s → 8s)
    const maxRetries = 3;
    const retryDelays = [2000, 4000, 8000];

    const makeRequest = (retryCount = 0) => {
        return new Promise((resolve) => {
            const postData = JSON.stringify({ message: input, mode: "query" });
            const options = {
                hostname: host,
                port: port,
                path: `/api/v1/workspace/${slug}/chat`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                },
                timeout: 60000 
            };

            const req = require('http').request(options, (res) => {
                let responseBody = '';
                res.setEncoding('utf8');
                
                res.on('data', (chunk) => { responseBody += chunk; });
                
                res.on('end', async () => {
                    // 检查是否需要重试（针对 502/503/504 等服务忙碌状态）
                    if (res.statusCode >= 500 && retryCount < maxRetries) {
                        console.log(`[Retry] 状态码 ${res.statusCode}，执行第 ${retryCount + 1} 次重试...`);
                        await require('util').promisify(setTimeout)(retryDelays[retryCount]);
                        return resolve(makeRequest(retryCount + 1));
                    }

                    try {
                        const json = JSON.parse(responseBody);
                        // 📝 多字段解析支持（兼容不同 API 响应格式）
                        const answer = json.textResponse || json.message || json.answer || json.content || "库内未找到有效匹配。";
                        resolve({ success: true, data: answer });
                    } catch (e) {
                        resolve({ success: false, error: "API 响应解析失败" });
                    }
                });
            });

            req.on('error', async (err) => {
                if (retryCount < maxRetries) {
                    console.log(`[Retry] 连接错误：${err.message}，正在重试...`);
                    await require('util').promisify(setTimeout)(retryDelays[retryCount]);
                    return resolve(makeRequest(retryCount + 1));
                }
                resolve({ success: false, error: `最终连接失败：${err.message}` });
            });

            req.write(postData);
            req.end();
        });
    };

    return await makeRequest();
};
