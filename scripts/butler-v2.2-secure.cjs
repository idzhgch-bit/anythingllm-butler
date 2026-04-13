/**
 * AnythingLLM Butler - Pro Logic (V2.2 Secure)
 * Security Update: API Key from Environment Variable
 */
const http = require('http');

// 工具函数：异步延迟（用于重试�?
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async function butler(context) {
    const input = context.input || "";
    
    // 🔒 从环境变量读�?API Key，提供默认值保�?
    const apiKey = process.env.ANYSHEM_LLAMA_API_KEY;
    
    // ⚠️ 安全警告：如果使用了默认值，记录日志
    if (!apiKey) {
        return { 
            success: false, 
            error: "API Key not found. Please set ANYSHEM_LLAMA_API_KEY environment variable." 
        };
    }

    const host = "192.168.1.16";
    const port = 3001;

    // 1. 增强的库判定逻辑 (NLP 友好架构)
    const slugs = {
        "party": "7ec9cd49-afa3-4594-b370-d7f168c60bf0",
        "work": "9bf38924-c218-4e84-ba05-5e9ba1de49e9",
        "life": "5bcfe47e-8e0e-4fb2-9828-02a016eebcb4"
    };

    const determineWorkspace = (text) => {
        const normalized = text.toLowerCase();
        if (/party|党建|共建|政务|方案/.test(normalized)) return "party";
        if (/work|工作 |  | 技�?| 通报 | 业务/.test(normalized)) return "work";
        if (/life|生活 | 个人 | 记录 | 日记/.test(normalized)) return "life";
        return "party"; // 默认回退
    };

    const target = determineWorkspace(input);
    const slug = slugs[target];

    // 2. 指数退避重试机制实�?(2s, 4s, 8s)
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

            const req = http.request(options, (res) => {
                let responseBody = '';
                res.setEncoding('utf8');
                res.on('data', (chunk) => { responseBody += chunk; });
                res.on('end', async () => {
                    if (res.statusCode >= 500 && retryCount < maxRetries) {
                        console.log(`[Retry] 状态码 ${res.statusCode}，执行第 ${retryCount + 1} 次重�?..`);
                        await delay(retryDelays[retryCount]);
                        return resolve(makeRequest(retryCount + 1));
                    }

                    try {
                        const json = JSON.parse(responseBody);
                        const answer = json.textResponse || json.message || json.answer || json.content || "库内未找到有效匹配�?;
                        resolve({ success: true, data: answer });
                    } catch (e) {
                        resolve({ success: false, error: "API 响应解析失败" });
                    }
                });
            });

            req.on('error', async (err) => {
                if (retryCount < maxRetries) {
                    console.log(`[Retry] 连接错误�?{err.message}，正在重�?..`);
                    await delay(retryDelays[retryCount]);
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


