# H2O 导航页

极简风格的个人导航页，支持多搜索引擎、分类管理、拖拽排序、数据导入导出与分享。

## 技术栈

- **框架**：React 19 + TypeScript
- **构建工具**：Vite 8
- **UI 组件**：shadcn/ui（基于 Radix UI）
- **样式**：Tailwind CSS 4
- **数据库**：Supabase（直连，无后端）
- **图标**：Lucide React

## 功能特性

- **分类导航**：Tab 式分类切换，每行最多 10 个链接
- **多搜索引擎**：内置 Google、Bing、百度、DuckDuckGo，支持自定义添加
- **拖拽排序**：链接卡片支持拖拽调整顺序
- **自动获取图标**：单个或一键批量获取网站 favicon
- **数据导入导出**：JSON 格式导入导出导航配置
- **分享码**：生成分享码，他人可通过分享码导入你的导航配置
- **设备 ID**：自动生成设备 ID，数据与设备绑定
- **亮色/暗色主题**：支持主题切换

## 快速开始

### 环境要求

- Node.js 18+
- Supabase 账号

### 1. 克隆项目

```bash
git clone <repo-url>
cd h2o-web-page
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env`，填入你的 Supabase 项目信息：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 创建数据库表

在 Supabase SQL Editor 中执行以下 SQL：

```sql
CREATE TABLE navigation (
  id BIGSERIAL PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL DEFAULT '{}',
  share_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_navigation_device_id ON navigation(device_id);
CREATE INDEX idx_navigation_share_code ON navigation(share_code);
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173`

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 运行 ESLint 检查 |

## 项目结构

```
src/
├── components/
│   ├── ui/            # shadcn/ui 基础组件
│   ├── DataEditor.tsx # 数据编辑器（分类/链接/搜索引擎管理）
│   ├── ImportExport.tsx
│   ├── NavCard.tsx    # 导航链接卡片
│   ├── NavSection.tsx # 导航分类区块
│   ├── SearchBox.tsx  # 搜索框 + 引擎选择
│   ├── ShareDialog.tsx
│   └── ThemeToggle.tsx
├── hooks/
│   └── useNavigation.ts  # 导航数据状态管理
├── lib/
│   ├── deviceId.ts   # 设备 ID 生成
│   ├── storage.ts    # Supabase 数据存取
│   ├── supabase.ts   # Supabase 客户端
│   ├── types.ts      # 类型定义
│   └── utils.ts      # 工具函数
├── App.tsx           # 主应用组件
├── main.tsx          # 入口文件
└── index.css         # 全局样式
```

## 数据格式

导航数据以 JSON 格式存储在 Supabase 中：

```json
{
  "pageInfo": {
    "title": "H2O导航页"
  },
  "sections": [
    {
      "name": "常用工具",
      "sortOrder": 0,
      "items": [
        {
          "title": "GitHub",
          "description": "",
          "url": "https://github.com",
          "icon": "https://www.google.com/s2/favicons?domain=github.com&sz=64",
          "sortOrder": 0
        }
      ]
    }
  ],
  "appConfig": {
    "theme": "light",
    "layout": "horizontal",
    "iconSize": "medium"
  },
  "searchEngines": [
    {
      "name": "Google",
      "urlTemplate": "https://www.google.com/search?q={query}",
      "sortOrder": 0
    }
  ]
}
```

## 使用说明

- **右键卡片**：编辑或删除链接
- **拖拽卡片**：调整链接顺序
- **点击设置图标**：打开数据编辑器，管理分类、链接和搜索引擎
- **点击下载图标**：导入/导出 JSON 数据
- **点击分享图标**：生成分享码或通过分享码导入配置
