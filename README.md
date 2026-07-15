# 魔方计时器 (Cube Timer)

<div align="center">

![项目状态](https://img.shields.io/badge/状态-活跃-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![版本](https://img.shields.io/badge/版本-v1.2.3-brightgreen)
![浏览器兼容](https://img.shields.io/badge/浏览器-Chrome%20%7C%20Edge%20%7C%20Firefox%20%7C%20Safari-orange)

一个功能强大、界面美观的多魔方类型计时器，支持多种异形魔方计时和统计。

[在线演示](https://dianshengtimer.asia/) · [功能特性](#-功能特性) · [使用指南](#-使用指南) · [贡献指南](#-贡献指南)

</div>

---

## 📖 项目简介

魔方计时器是一款专为魔方爱好者设计的多功能计时工具，支持标准三阶魔方以及多种异形魔方的计时、统计和数据管理。采用纯前端技术实现，无需安装，直接在浏览器中使用即可。

### ✨ 核心亮点

- 🎯 **多魔方类型支持** - 支持转角三阶、双子八面体、转角八面体、二阶转面八面体、二阶魔轮·四分轮、二阶魔轮·八分轮等多种异形魔方
- ⏱️ **专业计时功能** - 支持观察时间（15秒）、长按启动计时，符合比赛标准
- 📊 **完整统计分析** - 自动计算 Ao5、Ao12、Ao50、Ao100 等统计数据
- 🌍 **多语言支持** - 支持简体中文、繁体中文、英文三种语言
- 🎨 **主题切换** - 提供深色/浅色两种主题，可自由选择
- 💾 **数据导出** - 支持成绩和打乱公式导出为文件
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🔒 **本地存储** - 所有数据存储在浏览器本地，保护隐私
- 📦 **零依赖** - 纯前端实现，无需后端服务器
- 🖼️ **2D /伪3D 转动图示** - 同步展示 2D 展开图和可拖动旋转伪 3D 模型，便检查打乱状态向

---

## 🚀 功能特性

### 计时功能

- **计时操作**：
  - 长按 0.5 秒后松开开始计时
  - 计时中点击或按空格键停止
  - 支持全屏计时模式
- **时间记录**：自动记录每次成绩，支持手动设置为 +2 或 DNF
- **历史管理**：查看、编辑、删除历史记录

### 统计分析

- **实时统计**：
  - 单次成绩
  - Ao5（最近5次平均）
  - Ao12（最近12次平均）
  - Ao50（最近50次平均）
  - Ao100（最近100次平均）
- **历史最佳**：自动追踪各类型的最佳成绩
- **数据导出**：支持导出所有成绩为 CSV 格式

### 打乱系统

- **智能打乱**：为每种魔方类型生成符合规则的打乱公式
- **批量生成**：支持批量生成指定数量的打乱公式
- **打乱导出**：可导出打乱公式列表用于比赛或练习
- **打乱历史**：支持查看上一条/下一条打乱公式

### 用户体验

- **多语言**：简体中文 / 繁体中文 / English
- **主题切换**：深色模式 / 浅色模式
- **声音反馈**：计时过程中的音效提示
- **复制功能**：一键复制打乱公式
- **坐标说明**：提供魔方转动方式图示

---

## 🛠️ 技术栈

- **前端框架**：纯原生 JavaScript（Vanilla JS）
- **UI 技术**：HTML5 + CSS3 + SVG + Canvas
- **图标库**：Font Awesome 6.4.0
- **数据存储**：localStorage（浏览器本地存储）
- **设计模式**：
  - 面向对象编程（OOP）
  - 模块化架构
  - 注册器模式

---

## 📦 项目结构

```
dianshengtimer/
├── index.html              # 主 HTML 文件
├── README.md               # 项目说明文档
├── version.json            # 唯一版本源（Semantic Versioning）
├── package.json            # 版本管理命令与项目元数据
├── .githooks/
│   └── pre-commit          # 提交前自动递增并同步版本
├── scripts/
│   └── version.mjs         # 版本检查、同步、递增与 Git 暂存脚本
├── css/
│   └── styles.css          # 所有样式文件（主题、响应式、动画）
├── js/
│   ├── constants.js        # 常量定义（含自动同步的 APP_VERSION）
│   ├── storage.js          # localStorage 封装
│   ├── i18n.js             # 国际化功能（多语言支持）
│   ├── ui-helper.js        # UI 辅助工具
│   └── main.js             # 核心业务逻辑
└── pictures/               # 图片资源
    ├── diansheng.png       # Logo
    └── font-awesome/       # Font Awesome 图标库
```

### 核心模块说明

#### `constants.js`

- 魔方类型常量定义
- 颜色配置
- 渲染配置
- 应用配置项

#### `storage.js`

- 安全的 localStorage 封装
- 数据读写接口

#### `i18n.js`

- 多语言字典（zh-CN, zh-TW, en）
- 文本翻译和更新功能
- 语言切换管理

#### `main.js`

- **魔方模型类**：定义各种魔方的数据结构和旋转逻辑
- **打乱生成器类**：为每种魔方生成符合规则的打乱公式
- **视图渲染器类**：使用 Canvas 和 SVG 渲染 2D / 伪3D 魔方视图
- **主应用类**：整合所有功能，管理应用状态和用户交互

#### 版本管理文件

- **`version.json`**：项目唯一版本源
- **`scripts/version.mjs`**：执行版本检查、同步、patch/minor/major 递增和指定版本设置
- **`.githooks/pre-commit`**：提交应用代码时自动调用版本脚本并暂存同步结果
- **`package.json`**：提供 `version:check`、`version:sync`、`version:patch`、`version:minor`、`version:major`、`version:set` 和 `hooks:install` 命令

## 💻 环境要求

### 浏览器兼容性

| 浏览器        | 最低版本 | 推荐版本 |
| ------------- | -------- | -------- |
| Chrome        | 90+      | 最新版   |
| Edge          | 90+      | 最新版   |
| Firefox       | 88+      | 最新版   |
| Safari        | 14+      | 最新版   |
| iOS Safari    | 14+      | 最新版   |
| Chrome Mobile | 90+      | 最新版   |

### 需要的现代 JavaScript 特性

- ES6+（class, arrow functions, template literals, destructuring, spread operator）
- DOM API（classList, dataset, querySelector, querySelectorAll）
- Storage API（localStorage）
- CSS3（Flexbox, Grid, CSS Variables, Transitions）

---

## 🚀 使用方式

### 方式一：下载直接使用

1. 下载项目文件
2. 用浏览器打开 `index.html`
3. 开始使用！

### 方式二：在线使用

访问 https://dianshengtimer.asia/ 即可在线使用，无需下载

---

## 📖 使用指南

### 基本操作

#### 计时流程

1. **准备阶段**：查看打乱公式，观察魔方状态
2. **开始计时**：长按空格键或屏幕 0.5 秒，待时间变绿后松手可开始计时
3. **停止计时**：再次按空格键或点击屏幕停止计时
4. **记录成绩**：成绩自动保存到历史记录

#### 切换魔方类型

1. 点击顶部"魔方类型"下拉菜单
2. 选择需要的魔方类型
3. 系统自动切换视图和打乱生成器

#### 导出数据

**导出成绩**：

1. 点击"成绩"按钮打开统计面板
2. 点击"导出所有成绩"按钮
3. 选择保存位置，CSV 文件自动下载

**导出打乱公式**：

1. 在"导出公式数量"中选择数量（5/12/50/100）
2. 在"起始编号"中输入起始编号
3. 点击"导出打乱公式"按钮
4. TXT 文件自动下载

### 高级功能

#### 查看统计

- **当前统计**：显示当前会话的实时统计数据
- **历史最佳**：显示各类型的最佳成绩
- **历史记录**：查看所有历史成绩记录

#### 修改记录

- 点击历史记录中的成绩
- 可以设置为 +2、DNF 或清除惩罚
- 可以删除该条记录

#### 主题和语言

- 点击右上角设置按钮（⚙️）
- 选择主题：深色/浅色
- 选择语言：简体中文/繁体中文/English

---

## 🎯 支持的魔方类型

**转角三阶**、**双子八面体**、**转角八面体**、**二阶转面八面体**、**二阶魔轮·四分轮**、**二阶魔轮·八分轮**

---

## 🔧 开发指南

### 添加新的魔方类型

项目采用模块化设计，添加新魔方类型非常简单。详细步骤请参考代码中的注释。

#### 核心步骤

1. **定义魔方模型**：继承 `BaseCubeModel`，实现 `initializeCube()` 和 `rotate()`
2. **创建打乱生成器**：继承 `BaseScrambleGenerator`，实现 `generate()`
3. **实现视图渲染器**：继承 `BaseViewRenderer`，实现 `render()`
4. **注册魔方类型**：使用 `cubeRegistry.register()` 注册
5. **更新 UI**：在 HTML 中添加选择器选项和视图容器
6. **添加翻译**：在 `i18n.js` 中添加多语言文本

### 代码结构

```
BaseCubeModel (基类)
├── CornerCube3x3 (转角三阶)
├── OctahedronCube (双子八面体)
├── CornerOctaCube (转角八面体)
├── TwinOctahedronCube (二阶转面八面体)
├── SquareCircle4Cube (二阶魔轮·四分轮)
└── SquareCircle8Cube (二阶魔轮·八分轮)

BaseScrambleGenerator (基类)
├── CornerScrambleGenerator
├── OctahedronScrambleGenerator
├── CornerOctaScrambleGenerator
├── TwinOctahedronScrambleGenerator
├── SquareCircle4ScrambleGenerator
└── SquareCircle8ScrambleGenerator

BaseViewRenderer (基类)
├── CornerViewRenderer
├── OctahedronViewRenderer
├── CornerOctaViewRenderer
├── TwinOctahedronViewRenderer
├── SquareCircle4ViewRenderer
└── SquareCircle8ViewRenderer
```

---

## 📝 数据存储

所有数据存储在浏览器的 `localStorage` 中：

- `cube-timer-records`：时间记录（按魔方类型分组）
- `cubeTimerTheme`：主题设置
- `cubeTimerLanguage`：语言设置
- `cube-timer-sound-enabled`：音效开关状态

**注意**：清除浏览器缓存会丢失所有数据，建议定期导出备份。

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交 Issue

在提交 Issue 前，请先搜索已有的 Issue，避免重复。 

### 代码规范

- 使用 ES6+ 语法
- 遵循现有的代码风格
- 添加必要的注释
- 确保代码在所有支持的浏览器中正常运行

---

## 📄 许可证

本项目采用 MIT 许可证开源。

Copyright (c) 2026 郭毅

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🙏 致谢

感谢点盛玩具有限公司的硬件支持，感谢为该项目提出宝贵意见的所有魔友们！

---

## 📮 联系方式

- **作者**：爱玩魔方的化学课代表（郭毅）
- **邮箱**：g2762859919@163.com
- **B站主页**：[爱玩魔方的化学课代表](https://space.bilibili.com/1145897182?)
- **GitHub**：[Cuber-yi-72/DianshengTimer](https://github.com/Cuber-yi-72/DianshengTimer)

---

## 🙏 致谢

特别感谢以下个人和组织对本项目的支持和贡献：

- **点盛魔方公司** - 感谢点盛魔方公司对魔方运动的支持和对本项目的贡献
- **所有魔友** - 感谢广大魔方爱好者提供的宝贵建议和反馈

---

## 👥 贡献者

- **爱玩魔方的化学课代表（郭毅）** - 项目创始人，核心开发
- **点盛玩具有限公司** - 技术支持和产品建议

---

## 📜 更新日志

### v1.2.1 (2026-07-15)

#### 🔀 八面体打乱视图与 3D 方向

- ✨ 三种八面体新增“切换打乱视图”，支持前后剖开（默认）与左右剖开
- 🖱️ 修新视角 视角下的拖动坐标左右镜像斜

#### 📱 界面、链接与版本管理

- 🎛️ 手机端打乱公式独占一行，复制、转动方式和视图切换按钮统一放到公式下方操作栏
- 🔗 网页底部新增作者 B站主页与 GitHub 仓库入口

### v1.2.0 (2026-07-11)

#### 🧊 2D / 伪3D 转动方式视图

- ✨ “转动方式”弹窗升级为 2D 展开图与可拖动伪 3D 模型并排显示
- 🧭 为立方体和三种八面体建立统一空间坐标、朝外法线、背面剔除与标准初始观察角度
- 🎨 修复立方体左右面互换、部分面额外旋转 180°、八面体面位置与纹理方向问题
- 💡 调整伪 3D 光照算法，取消最亮面仍强制覆盖 20% 黑色的问题，使颜色更接近 2D
- ⭕ 二阶魔轮圆盘新增凸起结构，使用分片圆柱侧壁代替深色薄层堆叠，避免圆周发黑
- 🐛 修复转角三阶 `D` 操作错误使用上边条带、遗漏前面并污染底面状态的问题
- 📐 修复桌面端转角三阶 2D 展开图未垂直居中的问题
- 🧹 移除临时色块编号和“拖动可旋转 3D 模型”提示，保持界面简洁

### v1.1.0 (2026-07-08)

#### 🛠️ 代码质量与工程优化

- 🧹 清除全部 ~50 处 `console.log` 调试日志，新增 `APP_CONFIG.DEBUG` 开关统一控制
- 🔒 统一存储接口：所有 `localStorage` 操作改用 `StorageHelper` + `APP_CONFIG.STORAGE_KEYS`
- 🗑️ 清理死代码：空 `if` 块、旧版 `calculateAverage`/`calculateRollingAverage`、重复 `restoreTheme` 定义
- 🌐 魔方类型下拉菜单改用 `data-i18n` 属性驱动翻译，新增类型不再需要改 JS
- 🐛 修复 Ao5/Ao12/Ao50/Ao100 的 DNF 计算逻辑：含 1 DNF 时正确去掉最好成绩；DNF 上限与 `removeCount` 对齐（Ao50 允许 5 个、Ao100 允许 10 个）
- 🏷️ 引入版本号 + pre-commit hook 自动递增，浏览器自动拉取最新资源

### v1.0.1 (2026-06-29)

#### 🎲 版本更新

- ✨ 新增二阶魔轮·四分轮、二阶魔轮·八分轮两款魔方
- 📐 统一所有魔方类型 2D 视图的尺寸与配色方案
- 🔄 新增各魔方类型转动方式的图示说明

### v1.0.0 (2026-03-10)

#### 🎉 首次发布

- ✨ 支持转角三阶、双子八面体、转角八面体、二阶转面八面体四种魔方类型
- ⏱️ 实现专业计时功能，支持观察时间和长按启动
- 📊 完整统计分析系统（Ao5、Ao12、Ao50、Ao100）
- 🌍 多语言支持（简体中文、繁体中文、英文）
- 🎨 深色/浅色主题切换
- 💾 成绩和打乱公式导出功能
- 📱 响应式设计，完美适配移动端
- 🖼️ 2D 魔方视图显示
- 🔒 本地数据存储，保护隐私

---

## 🔮 未来计划

- [ ] 添加更多魔方类型支持
- [ ] 支持自定义打乱公式
- [ ] 开发移动端 APP

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐️**

Made with ❤️ by 爱玩魔方的化学课代表

</div>