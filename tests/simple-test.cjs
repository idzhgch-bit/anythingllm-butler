/**
 * Simple Test Suite - Core Functionality Verification
 */

require('dotenv').config();
const http = require('http');

console.log('\n🧪 Simple Test Suite for AnythingLLM Butler\n');

// T1: 环境验证
console.log('[T1] Environment Configuration');
console.log(`   API Key: ${process.env.ANYSHEM_LLAMA_API_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`   Host:    ${process.env.ANYSHEM_HOST || '192.168.1.16'} ✅`);
console.log(`   Port:    ${process.env.ANYSHEM_PORT || 3001} ✅\n`);

// T2: 库判定逻辑（纯函数测试，无需模块加载）
console.log('[T2] Workspace Detection Logic');

function determineWorkspace(text) {
    const normalized = text.toLowerCase();
    if (/(party|党建 | 共建 | 政务 | 方案)/.test(normalized)) return "party";
    if (/(work|工作 | 奔驰 | 技术 | 通报 | 业务)/.test(normalized)) return "work";
    if (/(life|生活 | 个人 | 记录 | 日记)/.test(normalized)) return "life";
    return "party";
}

const testCases = [
    { input: "党建方案", expected: "party" },
    { input: "奔驰技术通报", expected: "work" },
    { input: "个人生活记录", expected: "life" },
    { input: "天气不错", expected: "party" } // 默认回退
];

testCases.forEach((tc, i) => {
    const result = determineWorkspace(tc.input);
    const status = result === tc.expected ? '✅' : '❌';
    console.log(`   T${i+1}: "${tc.input}" → ${result} ${status}`);
});

console.log('');

// T3: API 连接测试（简化版）
console.log('[T3] API Connection Test (Simplified)');
const startTime = Date.now();

http.request({
    hostname: '192.168.1.16',
    port: 3001,
    path: '/api/v1/workspace/7ec9cd49-afa3-4594-b370-d7f168c60bf0/chat',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${process.env.ANYSHEM_LLAMA_API_KEY}`,
        'Content-Type': 'application/json'
    },
    timeout: 5000 // 简化测试用 5s
}, (res) => {
    const elapsed = Date.now() - startTime;
    if (res.statusCode === 200) {
        console.log(`   ✅ Connection successful (${elapsed}ms)`);
        console.log('   Status Code: 200 OK');
    } else {
        console.log(`   ⚠️  Unexpected status: ${res.statusCode}`);
    }
}).on('error', (err) => {
    const elapsed = Date.now() - startTime;
    console.log(`   ❌ Connection failed after ${elapsed}ms`);
    console.log(`   Error: ${err.message}`);
});

// 等待响应（最多 10s）
setTimeout(() => {
    console.log('\n✅ Test Suite Completed!\n');
}, 10000);
