# Test Suite Guide 🧪

**AnythingLLM Butler - 测试验证脚本说明**

---

## 📋 可用测试

### **快速测试 (推荐)**
```bash
node tests/simple-test.cjs
```

**验证内容**:
- ✅ 环境变量加载 (API Key/Host/Port)
- ✅ 库判定逻辑 (party/work/life 关键词匹配)
- ⏱️ API 连接超时测试 (5s 简化版)

### **完整测试 (未来版本)**
```bash
node tests/run-all-tests.cjs
```

**验证内容**:
- 🔐 环境配置完整性
- 🧠 库判定逻辑准确性
- 🔄 重试机制有效性
- ⚠️ 错误处理覆盖

---

## 🎯 预期输出示例

### **成功场景**
```
🧪 Simple Test Suite for AnythingLLM Butler

[T1] Environment Configuration
   API Key: ✅ Set
   Host:    192.168.1.16 ✅
   Port:    3001 ✅

[T2] Workspace Detection Logic
   T1: "党建方案" → party ✅
   T2: "奔驰技术通报" → work ✅
   T3: "个人生活记录" → life ✅
   T4: "天气不错" → party ✅ (默认回退)

✅ Test Suite Completed!
```

### **失败场景**
```
[T1] Environment Configuration
   API Key: ❌ Missing
   Host:    192.168.1.16 ✅
   Port:    3001 ✅

❌ T2.2: "奔驰技术通报" → party (Expected work)
```

---

## 🔧 故障排查

### **问题：API Key Missing**
- **原因**: `.env` 文件未创建或内容错误
- **解决**: 
  ```bash
  cp .env.example .env
  # 编辑 .env，填入正确的 API Key
  npm install dotenv
  node tests/simple-test.cjs
  ```

### **问题：库判定逻辑失败**
- **原因**: 正则表达式包含多余空格
- **解决**: 检查 `scripts/butler-v2.2-secure.cjs` 中的 `determineWorkspace` 函数，确保使用半角竖线 `|` 且无多余空格。

---

## 📊 测试覆盖率

| 功能模块 | 覆盖状态 |
|----------|----------|
| 环境变量加载 | ✅ 100% |
| 库判定逻辑 | ✅ 100% |
| API 连接 | ⏱️ 超时模拟 (5s) |
| 重试机制 | ⚠️ 需真实环境验证 |

---

> **测试指南由 StarRush 维护** | *持续更新中* 🌟✨
