# 📁 專案檔案結構

```
lenny-podcast-knowledge-mcp-github/
│
├── 📄 README.md                      # 主要專案說明（含使用範例）
├── 📄 QUICKSTART.md                  # 5分鐘快速開始指南 ⭐ 從這裡開始
├── 📄 GITHUB_PUBLISH_GUIDE.md        # 詳細的發布步驟
├── 📄 CONTRIBUTING.md                # 貢獻指南
├── 📄 LICENSE                        # MIT 授權
├── 📄 package.json                   # npm 依賴和腳本
├── 📄 tsconfig.json                  # TypeScript 設定
├── 📄 .gitignore                     # Git 忽略檔案
├── 🚀 publish.sh                     # 自動發布腳本
│
├── 📂 src/
│   └── index.ts                      # MCP server 主程式
│
├── 📂 knowledge/                     # 知識庫（JSON格式）
│   ├── frameworks.json               # 5個核心框架
│   │   ├── RICE Prioritization
│   │   ├── Jobs to be Done (JTBD)
│   │   ├── North Star Metric
│   │   ├── 40% Rule for PMF
│   │   └── Kano Model
│   │
│   └── best-practices.json           # 15+個最佳實踐
│       ├── user-research (3個)
│       ├── product-market-fit (2個)
│       ├── prioritization (2個)
│       ├── hiring (2個)
│       ├── growth (2個)
│       ├── leadership (2個)
│       ├── metrics (1個)
│       ├── pricing (1個)
│       └── onboarding (1個)
│
├── 📂 scripts/                       # 工具腳本
│   ├── extract-knowledge.ts          # 基礎提取工具
│   └── extract-with-ai.ts            # AI驅動的知識提取（需要API key）
│
└── 📂 .github/
    └── workflows/
        └── ci.yml                    # GitHub Actions CI/CD
```

## 📝 重要檔案說明

### 核心檔案（必須）

| 檔案 | 用途 | 重要性 |
|------|------|--------|
| **README.md** | 專案主頁，包含使用說明和範例 | ⭐⭐⭐⭐⭐ |
| **src/index.ts** | MCP server 實作 | ⭐⭐⭐⭐⭐ |
| **knowledge/*.json** | 知識庫內容 | ⭐⭐⭐⭐⭐ |
| **package.json** | npm 設定和依賴 | ⭐⭐⭐⭐⭐ |
| **LICENSE** | MIT 授權 | ⭐⭐⭐⭐ |

### 文檔檔案（推薦）

| 檔案 | 用途 | 重要性 |
|------|------|--------|
| **QUICKSTART.md** | 快速開始指南 | ⭐⭐⭐⭐⭐ |
| **CONTRIBUTING.md** | 貢獻指南 | ⭐⭐⭐⭐ |
| **GITHUB_PUBLISH_GUIDE.md** | 詳細發布步驟 | ⭐⭐⭐ |

### 工具檔案（可選）

| 檔案 | 用途 | 重要性 |
|------|------|--------|
| **publish.sh** | 自動發布腳本 | ⭐⭐⭐ |
| **scripts/extract-with-ai.ts** | AI知識提取 | ⭐⭐ |
| **.github/workflows/ci.yml** | 自動測試 | ⭐⭐ |

## 🎯 各檔案的作用

### 1. README.md
- 專案的門面，最重要的檔案
- 包含：什麼是這個專案、如何使用、範例
- 使用者會先看這個

### 2. QUICKSTART.md ⭐ 從這裡開始
- 最簡單的開始指南
- 5分鐘內就能發布到 GitHub
- 適合急著發布的人

### 3. knowledge/*.json
- 實際的知識內容
- 框架、最佳實踐都在這裡
- 這是專案的核心價值

### 4. src/index.ts
- MCP server 的實作
- 定義工具和回應邏輯
- 讀取 knowledge/ 並提供給 Claude

### 5. publish.sh
- 一鍵發布腳本
- 自動設定 git、更新使用者名稱
- 省時省力

## 📊 檔案大小

```
總大小: ~5-10 MB（不含 node_modules）

knowledge/              ~100 KB
src/                    ~50 KB
scripts/                ~30 KB
文檔                    ~50 KB
設定檔                  ~10 KB
```

## 🚀 使用流程

### 發布到 GitHub
```
1. 讀 QUICKSTART.md
2. 執行 publish.sh
3. git push
4. 完成！
```

### 本地使用
```
1. npm install
2. npm run build
3. 設定 Claude Desktop
4. 使用！
```

### 擴展知識庫
```
1. 編輯 knowledge/*.json
2. 或執行 npm run extract（需要 API key）
3. npm run build
4. git commit && git push
```

## ✅ 發布前檢查清單

確認這些檔案都存在且正確：

- [ ] README.md - 完整且清楚
- [ ] QUICKSTART.md - 簡單易懂
- [ ] CONTRIBUTING.md - 有貢獻指南
- [ ] LICENSE - MIT License
- [ ] package.json - 依賴完整
- [ ] knowledge/frameworks.json - 至少5個框架
- [ ] knowledge/best-practices.json - 至少15個實踐
- [ ] src/index.ts - 編譯無誤
- [ ] .gitignore - 包含 node_modules, dist
- [ ] .github/workflows/ci.yml - CI 設定

## 🎓 檔案優先順序

### 如果時間有限，專注在：

**必須有：**
1. README.md
2. knowledge/frameworks.json
3. knowledge/best-practices.json
4. src/index.ts
5. package.json

**建議有：**
6. QUICKSTART.md
7. CONTRIBUTING.md
8. LICENSE
9. publish.sh

**可選：**
10. GITHUB_PUBLISH_GUIDE.md
11. scripts/extract-with-ai.ts
12. .github/workflows/ci.yml

## 🔧 自訂建議

你可以根據需求：

**簡化版：**
- 移除 scripts/
- 移除 .github/workflows/
- 只保留核心功能

**完整版：**
- 保留所有檔案
- 加入更多測試
- 加入更多文檔

**目前版本：** 完整版（推薦）
- 所有功能都有
- 文檔完整
- 易於貢獻

---

**需要幫助？** 查看各個檔案內的說明，或參考 QUICKSTART.md 快速開始！
