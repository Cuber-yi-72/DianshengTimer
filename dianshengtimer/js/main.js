    // ===== DOM元素缓存 =====
    const DOM_CACHE = {
        // 初始化时缓存所有需要的DOM元素
        elements: {},

        init() {
            this.elements = {
                // 设置相关
                settingsModal: document.getElementById('settingsModal'),
                settingsBtn: document.getElementById('settingsBtn'),
                settingsOverlay: document.getElementById('settingsOverlay'),
                settingsCloseBtn: document.getElementById('settingsCloseBtn'),
                themeDarkBtn: document.getElementById('themeDarkBtn'),
                themeLightBtn: document.getElementById('themeLightBtn'),
                langSCBtn: document.getElementById('langSCBtn'),
                langTCBtn: document.getElementById('langTCBtn'),
                langENBtn: document.getElementById('langENBtn'),

                // 计时器相关
                timerDisplay: document.getElementById('timerDisplay'),
                timerStartBtn: document.getElementById('timerStartBtn'),
                fullscreenTimer: document.getElementById('fullscreenTimer'),
                fullscreenDisplay: document.getElementById('fullscreenDisplay'),
                fullscreenInfo: document.getElementById('fullscreenInfo'),
                fullscreenHint: document.getElementById('fullscreenHint'),
                fullscreenExitBtn: document.getElementById('fullscreenExitBtn'),
                escHint: document.getElementById('escHint'),

                // 魔方类型和控制
                cubeTypeSelect: document.getElementById('cubeTypeSelect'),
                prevScrambleBtn: document.getElementById('prevScrambleBtn'),
                nextScrambleBtn: document.getElementById('nextScrambleBtn'),
                

                // 打乱显示
                scrambleNumber: document.getElementById('scrambleNumber'),
                scrambleContent: document.getElementById('scrambleContent'),
                copyBtn: document.getElementById('copyBtn'),
                coordinateBtn: document.getElementById('coordinateBtn'),

                // 统计相关
                currentTime: document.getElementById('currentTime'),
                currentAo5: document.getElementById('currentAo5'),
                currentAo12: document.getElementById('currentAo12'),
                currentAo50: document.getElementById('currentAo50'),
                currentAo100: document.getElementById('currentAo100'),
                bestTime: document.getElementById('bestTime'),
                bestAo5: document.getElementById('bestAo5'),
                bestAo12: document.getElementById('bestAo12'),
                bestAo50: document.getElementById('bestAo50'),
                bestAo100: document.getElementById('bestAo100'),

                // 历史记录
                historyTimesList: document.getElementById('historyTimesList'),
                historySummary: document.getElementById('historySummary'),
                historyResetBtn: document.getElementById('historyResetBtn'),
                exportBestAo5Btn: document.getElementById('exportBestAo5Btn'),

                // 导出
                generateCount: document.getElementById('generateCount'),
                startNumber: document.getElementById('startNumber'),
                exportScramblesBtn: document.getElementById('exportScramblesBtn')
            };
        },

        get(key) {
            return this.elements[key];
        }
    };

    // ===== localStorage安全操作封装 =====

    // ===== 语言字典 =====
    function t(key, params = {}) {
        let text = translations[currentLanguage][key] || translations['zh-CN'][key] || key;
        // 替换参数
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    }

    // 切换语言（使用安全的localStorage操作）
    function setLanguage(lang) {
        if (translations[lang]) {
            currentLanguage = lang;
            StorageHelper.setItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE, lang);
            updateAllText();
        }
    }

    // 更新所有文本（使用DOM缓存优化性能）
    function updateAllText() {
        // 更新标题
        document.title = t('title');

        // 更新带有data-i18n属性的元素（只查询一次）
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                element.title = t(key);
            } else {
                element.textContent = t(key);
            }
        });

        // 使用缓存的DOM元素
        const cache = DOM_CACHE.elements;

        // 更新页面标题
        const headerTitle = document.querySelector('.header-title');
        if (headerTitle) headerTitle.textContent = t('headerTitle');

        // 更新设置按钮
        if (cache.settingsBtn) cache.settingsBtn.title = t('settings');

        // 更新魔方类型选择器
        if (cache.cubeTypeSelect) {
            cache.cubeTypeSelect.options[0].textContent = t('cornerCube');
            cache.cubeTypeSelect.options[1].textContent = t('twinOctahedron');
            cache.cubeTypeSelect.options[2].textContent = t('cornerOctahedron');
            cache.cubeTypeSelect.options[3].textContent = t('twinOctahedron2x2');
        }

        // 更新上一条/下一条按钮
        if (cache.prevScrambleBtn) cache.prevScrambleBtn.textContent = t('prevScramble');
        if (cache.nextScrambleBtn) cache.nextScrambleBtn.textContent = t('nextScramble');

        // 更新循环次数
        if (cache.cycleSelect) {
            }

        // 更新复制按钮
        if (cache.copyBtn) cache.copyBtn.textContent = t('copy');

        // 更新坐标按钮
        if (cache.coordinateBtn) cache.coordinateBtn.textContent = t('coordinate');

        // 更新统计卡片标题
        const currentStatsTitle = document.querySelector('.current-stats-card .stats-card-title');
        const bestStatsTitle = document.querySelector('.best-stats-card .stats-card-title');
        if (currentStatsTitle) currentStatsTitle.textContent = t('currentStats');
        if (bestStatsTitle) bestStatsTitle.textContent = t('bestStats');

        // 更新历史成绩
        const historyTitle = document.querySelector('.history-times-title span');
        if (historyTitle) historyTitle.textContent = t('history');
        if (cache.historyResetBtn) {
            cache.historyResetBtn.textContent = t('reset');
            cache.historyResetBtn.title = t('clearData');
        }
        if (cache.exportBestAo5Btn) cache.exportBestAo5Btn.textContent = t('exportAll');

        // 更新历史记录列表
        if (cache.historyTimesList && cache.historyTimesList.innerHTML.includes('暂无时间记录')) {
            cache.historyTimesList.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">' + t('noRecords') + '</div>';
        }

        // 更新魔方类型映射
        window.cubeTypeNameMap = {
            'corner': t('cornerCubeFull'),
            'cornerOcta': t('cornerOctahedronFull'),
            'octahedron': t('twinOctahedronFull'),
            'twinOctahedron': t('twinOctahedron2x2Full')
        };

        // 更新开始按钮
        if (cache.timerStartBtn) cache.timerStartBtn.innerHTML = '<i class="fas fa-play"></i> ' + t('start');

        // 更新面标签
        const faceU = document.querySelector('.face-label-U');
        const faceL = document.querySelector('.face-label-L');
        const faceF = document.querySelector('.face-label-F');
        const faceR = document.querySelector('.face-label-R');
        const faceB = document.querySelector('.face-label-B');
        const faceD = document.querySelector('.face-label-D');
        if (faceU) faceU.textContent = t('faceU');
        if (faceL) faceL.textContent = t('faceL');
        if (faceF) faceF.textContent = t('faceF');
        if (faceR) faceR.textContent = t('faceR');
        if (faceB) faceB.textContent = t('faceB');
        if (faceD) faceD.textContent = t('faceD');

        // 更新导出标签
        const exportCountLabel = document.querySelector('.export-count-label');
        const startIdLabel = document.querySelector('.start-id-label');
        if (exportCountLabel) exportCountLabel.textContent = t('exportCount');
        if (startIdLabel) startIdLabel.textContent = t('startId');
        if (cache.exportScramblesBtn) cache.exportScramblesBtn.textContent = t('exportScrambles');

        // 更新全屏提示
        if (cache.fullscreenInfo) cache.fullscreenInfo.textContent = t('observing');
        if (cache.fullscreenHint) cache.fullscreenHint.textContent = t('clickToStart');
        if (cache.escHint) cache.escHint.innerHTML = t('escHint');

        // 更新退出全屏按钮
        if (cache.fullscreenExitBtn) cache.fullscreenExitBtn.title = t('exitFullscreen');

        // 更新声音按钮
        const soundBtn = document.getElementById('soundBtn');
        if (soundBtn) {
            const isMuted = soundBtn.classList.contains('muted');
            soundBtn.title = isMuted ? t('soundOff') : t('soundOn');
        }

        // 更新历史摘要
        if (window.app && window.app.getCurrentTimes) {
            const currentTimes = window.app.getCurrentTimes();
            window.app.updateHistoryTimesList(currentTimes);
        }

        // 更新设置弹窗中的文本
        updateSettingsModalText();
    }

    // 初始化语言设置（使用StorageHelper）
    function initLanguage() {
        const savedLang = StorageHelper.getItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE, 'zh-CN');
        if (savedLang && translations[savedLang]) {
            currentLanguage = savedLang;
        }
        updateAllText();
    }

    // 更新设置弹窗中的文本
    function updateSettingsModalText() {
        document.getElementById('settingsTitle').textContent = t('settings');
        document.getElementById('themeTitle').textContent = t('theme');
        document.getElementById('languageTitle').textContent = t('language');
        document.getElementById('darkThemeText').textContent = t('darkTheme');
        document.getElementById('lightThemeText').textContent = t('lightTheme');
        document.getElementById('langSCText').textContent = t('languageSC');
        document.getElementById('langTCText').textContent = t('languageTC');
        document.getElementById('langENText').textContent = t('languageEN');
        
        // 更新当前选中的主题和语言
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        document.querySelectorAll('.theme-option-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === currentTheme);
        });
        
        document.querySelectorAll('.lang-option-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
        });
    }

    // 显示设置弹窗
    function showSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.add('active');
            updateSettingsModalText();
        }
    }

    // 隐藏设置弹窗
    function hideSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // 初始化设置弹窗事件
    function initSettingsModal() {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsOverlay = document.getElementById('settingsOverlay');
        const settingsCloseBtn = document.getElementById('settingsCloseBtn');
        
        // 打开设置弹窗
        if (settingsBtn) {
            settingsBtn.addEventListener('click', showSettingsModal);
        }
        
        // 关闭设置弹窗
        if (settingsOverlay) {
            settingsOverlay.addEventListener('click', hideSettingsModal);
        }
        if (settingsCloseBtn) {
            settingsCloseBtn.addEventListener('click', hideSettingsModal);
        }
        
        // ESC键关闭弹窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideSettingsModal();
            }
        });
        
        // 主题切换
        document.querySelectorAll('.theme-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                setTheme(theme);
            });
        });
        
        // 语言切换
        document.querySelectorAll('.lang-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                setLanguage(lang);
            });
        });
    }

    // 设置主题（使用StorageHelper）
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('cubeTimerTheme', theme);
        updateSettingsModalText();
    }

    // 在页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', () => {
        // 初始化DOM缓存
        DOM_CACHE.init();

        initSettingsModal();

        // 恢复保存的主题
        const savedTheme = localStorage.getItem('cubeTimerTheme') || 'dark';
        if (savedTheme) {
            setTheme(savedTheme);
        }
    });

    // ===== 模块化架构 - 魔方类型注册器 =====
    class CubeTypeRegistry {
        constructor() {
            this.cubeTypes = new Map();
            this.models = new Map();
            this.scrambleGenerators = new Map();
            this.viewRenderers = new Map();
        }

        /**
         * 注册新的魔方类型
         * @param {string} type - 魔方类型标识符
         * @param {Object} config - 配置对象，包含：
         *   - name: 显示名称
         *   - model: 魔方模型类
         *   - scrambleGenerator: 打乱生成器类
         *   - viewRenderer: 视图渲染器类
         *   - controlPanelId: 控制面板DOM ID
         *   - viewId: 视图DOM ID
         */
        register(type, config) {
            this.cubeTypes.set(type, config);
            this.models.set(type, config.model);
            this.scrambleGenerators.set(type, config.scrambleGenerator);
            this.viewRenderers.set(type, config.viewRenderer);
        }

        getModel(type) {
            return this.models.get(type);
        }

        getScrambleGenerator(type) {
            return this.scrambleGenerators.get(type);
        }

        getViewRenderer(type) {
            return this.viewRenderers.get(type);
        }

        getConfig(type) {
            return this.cubeTypes.get(type);
        }

        getAllTypes() {
            return Array.from(this.cubeTypes.keys());
        }

        getAllConfigs() {
            return Array.from(this.cubeTypes.values());
        }
    }

    // ===== 模块化架构 - 魔方模型基类 =====
    class BaseCubeModel {
        constructor() {
            this.rotationHistory = [];
        }

        // 子类必须实现的方法
        initializeCube() {
            throw new Error('initializeCube must be implemented by subclass');
        }

        reset() {
            this.initializeCube();
            this.rotationHistory = [];
        }

        // 子类必须实现的方法
        rotate(move) {
            throw new Error('rotate must be implemented by subclass');
        }
    }

    // ===== 模块化架构 - 打乱生成器基类 =====
    class BaseScrambleGenerator {
        constructor() {
            this.config = {};
        }

        // 子类必须实现的方法
        generate() {
            throw new Error('generate must be implemented by subclass');
        }

        // 批量生成（用于导出）
        generateBatch(count) {
            return Array.from({ length: count }, () => this.generate());
        }

        // 子类可选实现
        setConfig(config) {
            this.config = { ...this.config, ...config };
        }
    }

    // ===== 模块化架构 - 视图渲染器基类 =====
    class BaseViewRenderer {
        constructor(containerId) {
            this.containerId = containerId;
            this.container = document.getElementById(containerId);
        }

        // 子类必须实现的方法
        render(model) {
            throw new Error('render must be implemented by subclass');
        }

        // 获取容器元素
        getContainer() {
            return this.container;
        }
    }

    // ===== 转角三阶魔方核心数据结构 =====
    class CornerCube3x3 extends BaseCubeModel {
        constructor() {
            super();
            this.colorMap = CORNER_CUBE_COLOR_MAP;
            this.initializeCube();
        }

        initializeCube() {
            this.faces = {
                top: Array(CORNER_CUBE.FACE_SIZE).fill('white'),
                bottom: Array(CORNER_CUBE.FACE_SIZE).fill('yellow'),
                front: Array(CORNER_CUBE.FACE_SIZE).fill('green'),
                back: Array(CORNER_CUBE.FACE_SIZE).fill('blue'),
                left: Array(CORNER_CUBE.FACE_SIZE).fill('orange'),
                right: Array(CORNER_CUBE.FACE_SIZE).fill('red')
            };
        }
        
        // 旋转操作
        rotate(rotation, animate = false) {
            const moveMap = {
                'F': () => this.rotateFrontClockwise(),
                'F\'': () => this.rotateFrontCounterClockwise(),
                'F2': () => { this.rotateFrontClockwise(); this.rotateFrontClockwise(); },
                'UFL': () => this.rotateUFL(),
                'UFL\'': () => this.rotateUFLCounterClockwise(),
                'R': () => this.rotateRightClockwise(),
                'R\'': () => this.rotateRightCounterClockwise(),
                'R2': () => { this.rotateRightClockwise(); this.rotateRightClockwise(); },
                'UFR': () => this.rotateUFR(),
                'UFR\'': () => this.rotateUFRCounterClockwise(),
                'B': () => this.rotateBackClockwise(),
                'B\'': () => this.rotateBackCounterClockwise(),
                'B2': () => { this.rotateBackClockwise(); this.rotateBackClockwise(); },
                'L': () => this.rotateLeftClockwise(),
                'L\'': () => this.rotateLeftCounterClockwise(),
                'L2': () => { this.rotateLeftClockwise(); this.rotateLeftClockwise(); },
                'U': () => this.rotateUpClockwise(),
                'U\'': () => this.rotateUpCounterClockwise(),
                'U2': () => { this.rotateUpClockwise(); this.rotateUpClockwise(); },
                'D': () => this.rotateDownClockwise(),
                'D\'': () => this.rotateDownCounterClockwise(),
                'D2': () => { this.rotateDownClockwise(); this.rotateDownClockwise(); },
                'UBL': () => this.rotateUBL(),
                'UBL\'': () => this.rotateUBLCounterClockwise(),
                'UBR': () => this.rotateUBR(),
                'UBR\'': () => this.rotateUBRCounterClockwise(),
                'DFL': () => this.rotateDFL(),
                'DFL\'': () => this.rotateDFLCounterClockwise(),
                'DFR': () => this.rotateDFR(),
                'DFR\'': () => this.rotateDFRCounterClockwise(),
                'DBL': () => this.rotateDBL(),
                'DBL\'': () => this.rotateDBLCounterClockwise(),
                'DBR': () => this.rotateDBR(),
                'DBR\'': () => this.rotateDBRCounterClockwise(),
                'x2': () => this.performX2Rotation()
            };

            const move = moveMap[rotation];
            if (move) {
                move();
                this.rotationHistory.push(rotation);
            }
        }
        
// x2翻面操作
        /**
         * 执行X2旋转（魔方绕X轴旋转180度）
         * 该操作将魔方整体翻转，相当于"上下颠倒"
         *
         * 面布局说明（标准三阶魔方）:
         * - Top (Y): 顶面 - 白色
         * - Bottom (W): 底面 - 黄色
         * - Front (G): 前面 - 绿色
         * - Back (B): 后面 - 蓝色
         * - Left (O): 左面 - 橙色
         * - Right (R): 右面 - 红色
         *
         * X2旋转效果:
         * 1. 左右面（橙红）内部特定位置交换（保持相对关系）
         * 2. 顶底面（白黄）完全交换
         * 3. 前后面（绿蓝）特定对应位置交叉交换
         */
        performX2Rotation() {
            // 步骤1: 红橙面内部进行特定交换
            // 这是因为转角魔方的特殊结构，左右面在X2旋转时需要内部调整
            this.swapRedOrangeFaceRegions(this.faces.left);  // 橙色面（左）
            this.swapRedOrangeFaceRegions(this.faces.right); // 红色面（右）

            // 步骤2: 黄白面完全交换
            // X2旋转后，顶面变成底面，底面变成顶面
            const tempTop = [...this.faces.top];
            this.faces.top = [...this.faces.bottom];
            this.faces.bottom = tempTop;

            // 步骤3: 蓝绿面特定对应位置交叉交换
            // 前后面在X2旋转时不仅交换位置，还需要特定的内部调整
            this.swapBlueGreenFaces();
        }

        /**
         * 红橙面内部特定位置交换
         *
         * 面结构说明（转角三阶）:
         * 每个面有17个位置，编号1-17，布局如下：
         *
         *     1   2   3
         *    4   5   6
         *   7   8   9   10
         *    11  12  13
         *   14  15  16  17
         *
         * 交换规则（对称交换）:
         * - 对角线交换: 1↔5, 2↔4, 6↔13, 7↔12, 8↔14, 9↔16, 10↔15, 11↔17
         * - 中心点保持: 3↔3（实际上不变）
         *
         * 这个交换模式是为了保持转角魔方的几何特性
         *
         * @param {Array} face - 面的颜色数组（17个元素）
         */
        swapRedOrangeFaceRegions(face) {
            // 第一行: 对角线交换 (1↔5, 2↔4)
            const temp1 = face[0];   // 保存位置1
            const temp2 = face[4];   // 保存位置5
            face[0] = temp2;         // 位置5 -> 位置1
            face[4] = temp1;         // 位置1 -> 位置5

            const temp3 = face[1];   // 保存位置2
            const temp4 = face[3];   // 保存位置4
            face[1] = temp4;         // 位置4 -> 位置2
            face[3] = temp3;         // 位置2 -> 位置4

            // 中心位置: 3↔3（实际上保持不变，保持代码一致性）
            const temp5 = face[2];   // 保存位置3
            face[2] = temp5;         // 位置3 -> 位置3（实际上是交换）

            // 第二行和第三行: 对角线交换 (6↔13, 7↔12, 8↔14)
            const temp6 = face[5];   // 保存位置6
            const temp7 = face[12];  // 保存位置13
            face[5] = temp7;         // 位置13 -> 位置6
            face[12] = temp6;        // 位置6 -> 位置13

            const temp8 = face[6];   // 保存位置7
            const temp9 = face[11];  // 保存位置12
            face[6] = temp9;         // 位置12 -> 位置7
            face[11] = temp8;        // 位置7 -> 位置12

            const temp10 = face[7];  // 保存位置8
            const temp11 = face[13]; // 保存位置14
            face[7] = temp11;        // 位置14 -> 位置8
            face[13] = temp10;       // 位置8 -> 位置14

            // 第四行和第五行: 对角线交换 (9↔16, 10↔15, 11↔17)
            const temp12 = face[8];  // 保存位置9
            const temp13 = face[15]; // 保存位置16
            face[8] = temp13;        // 位置16 -> 位置9
            face[15] = temp12;       // 位置9 -> 位置16

            const temp14 = face[9];  // 保存位置10
            const temp15 = face[14]; // 保存位置15
            face[9] = temp15;        // 位置15 -> 位置10
            face[14] = temp14;       // 位置10 -> 位置15

            const temp16 = face[10]; // 保存位置11
            const temp17 = face[16]; // 保存位置17
            face[10] = temp17;       // 位置17 -> 位置11
            face[16] = temp16;       // 位置11 -> 位置17
        }

        /**
         * 蓝绿面（前后面）特定对应位置交叉交换
         *
         * X2旋转时，前面（绿）和后面（蓝）需要交叉交换
         * 这意味着前面的某个位置要和后面的对称位置交换
         *
         * 面布局说明（标准三阶魔方）:
         * 每个面有17个位置，编号1-17，布局同上
         *
         * 交换规则（交叉交换）:
         * - 1↔5: 蓝1↔绿5, 蓝5↔绿1（交叉对角线）
         * - 2↔4: 蓝2↔绿4, 蓝4↔绿2（交叉对角线）
         * - 3↔3: 蓝3↔绿3（中心对称）
         * - 6↔13, 7↔12, 8↔14: 交叉交换（注意编号关系）
         * - 9↔16, 10↔15, 11↔17: 交叉交换
         *
         * 这个交换模式实现了前面和后面的180度旋转交换
         */
        swapBlueGreenFaces() {
            // 第一行: 交叉对角线交换
            // 蓝1↔绿5, 蓝5↔绿1
            const temp1 = this.faces.front[0];  // 保存蓝1
            const temp2 = this.faces.front[4];  // 保存蓝5
            this.faces.front[0] = this.faces.back[4];  // 绿5 -> 蓝1
            this.faces.front[4] = this.faces.back[0];  // 绿1 -> 蓝5
            this.faces.back[4] = temp1;  // 蓝1 -> 绿5
            this.faces.back[0] = temp2;  // 蓝5 -> 绿1

            // 蓝2↔绿4, 蓝4↔绿2
            const temp3 = this.faces.front[1];  // 保存蓝2
            const temp4 = this.faces.front[3];  // 保存蓝4
            this.faces.front[1] = this.faces.back[3];  // 绿4 -> 蓝2
            this.faces.front[3] = this.faces.back[1];  // 绿2 -> 蓝4
            this.faces.back[3] = temp3;  // 蓝2 -> 绿4
            this.faces.back[1] = temp4;  // 蓝4 -> 绿2

            // 中心点: 蓝3↔绿3（相互交换）
            const temp17 = this.faces.front[2];  // 保存蓝3
            this.faces.front[2] = this.faces.back[2];  // 绿3 -> 蓝3
            this.faces.back[2] = temp17;  // 蓝3 -> 绿3

            // 第二行和第三行: 交叉交换
            // 蓝6↔绿13, 蓝13↔绿6
            const temp5 = this.faces.front[5];  // 保存蓝6
            const temp6 = this.faces.front[12]; // 保存蓝13
            this.faces.front[5] = this.faces.back[12]; // 绿13 -> 蓝6
            this.faces.front[12] = this.faces.back[5];  // 绿6 -> 蓝13
            this.faces.back[12] = temp5;  // 蓝6 -> 绿13
            this.faces.back[5] = temp6;   // 蓝13 -> 绿6
            
            // 7-12交换：蓝7和绿12交换，蓝12和绿7交换
            const temp7 = this.faces.front[6];  // 保存蓝7
            const temp8 = this.faces.front[11]; // 保存蓝12
            this.faces.front[6] = this.faces.back[11]; // 绿12 -> 蓝7
            this.faces.front[11] = this.faces.back[6];  // 绿7 -> 蓝12
            this.faces.back[11] = temp7;  // 蓝7 -> 绿12
            this.faces.back[6] = temp8;   // 蓝12 -> 绿7
            
            // 8-14交换：蓝8和绿14交换，蓝14和绿8交换
            const temp9 = this.faces.front[7];  // 保存蓝8
            const temp10 = this.faces.front[13]; // 保存蓝14
            this.faces.front[7] = this.faces.back[13]; // 绿14 -> 蓝8
            this.faces.front[13] = this.faces.back[7];  // 绿8 -> 蓝14
            this.faces.back[13] = temp9;  // 蓝8 -> 绿14
            this.faces.back[7] = temp10;  // 蓝14 -> 绿8
            
            // 9-16交换：蓝9和绿16交换，蓝16和绿9交换
            const temp11 = this.faces.front[8];  // 保存蓝9
            const temp12 = this.faces.front[15]; // 保存蓝16
            this.faces.front[8] = this.faces.back[15]; // 绿16 -> 蓝9
            this.faces.front[15] = this.faces.back[8];  // 绿9 -> 蓝16
            this.faces.back[15] = temp11; // 蓝9 -> 绿16
            this.faces.back[8] = temp12;  // 蓝16 -> 绿9
            
            // 10-15交换：蓝10和绿15交换，蓝15和绿10交换
            const temp13 = this.faces.front[9];  // 保存蓝10
            const temp14 = this.faces.front[14]; // 保存蓝15
            this.faces.front[9] = this.faces.back[14]; // 绿15 -> 蓝10
            this.faces.front[14] = this.faces.back[9];  // 绿10 -> 蓝15
            this.faces.back[14] = temp13; // 蓝10 -> 绿15
            this.faces.back[9] = temp14;  // 蓝15 -> 绿10
            
            // 11-17交换：蓝11和绿17交换，蓝17和绿11交换
            const temp15 = this.faces.front[10]; // 保存蓝11
            const temp16 = this.faces.front[16]; // 保存蓝17
            this.faces.front[10] = this.faces.back[16]; // 绿17 -> 蓝11
            this.faces.front[16] = this.faces.back[10]; // 绿11 -> 蓝17
            this.faces.back[16] = temp15; // 蓝11 -> 绿17
            this.faces.back[10] = temp16; // 蓝17 -> 绿11
        }
        
        // 交换两个面的特定区域
        swapFaceRegions(face1, face2) {
            // 1，4互换
            const temp1 = face1[0];
            face1[0] = face2[3];
            face2[3] = temp1;
            
            // 6，7互换
            const temp2 = face1[5];
            face1[5] = face2[6];
            face2[6] = temp2;
            
            // 9，15互换
            const temp3 = face1[8];
            face1[8] = face2[14];
            face2[14] = temp3;
            
            // 11，17互换
            const temp4 = face1[10];
            face1[10] = face2[16];
            face2[16] = temp4;
            
            // 10，16互换
            const temp5 = face1[9];
            face1[9] = face2[15];
            face2[15] = temp5;
            
            // 2，5互换
            const temp6 = face1[1];
            face1[1] = face2[4];
            face2[4] = temp6;
            
            // 12，13互换
            const temp7 = face1[11];
            face1[11] = face2[12];
            face2[12] = temp7;
        }
        
        rotateFace180(face) {
            // 将面旋转180度
            const temp = [...face];
            face[0] = temp[16];
            face[1] = temp[15];
            face[2] = temp[14];
            face[3] = temp[13];
            face[4] = temp[12];
            face[5] = temp[11];
            face[6] = temp[10];
            face[7] = temp[9];
            face[8] = temp[8];
            face[9] = temp[7];
            face[10] = temp[6];
            face[11] = temp[5];
            face[12] = temp[4];
            face[13] = temp[3];
            face[14] = temp[2];
            face[15] = temp[1];
            face[16] = temp[0];
        }
        
        // 动画旋转效果 - 已移除以避免角度变化
        animateRotation(rotation) {
            // 空实现，避免魔方角度发生变化
        }
        
        // 前面顺时针旋转90度 - 按照新的转角魔方规则（修正方向）
        rotateFrontClockwise() {
            // 保存需要移动的色块
            const temp = this.faces.left[1]; // O2 (橙色面第2个区域)
            
            // O2-Y5-R4-W1-O2 循环（反转方向）
            this.faces.left[1] = this.faces.bottom[0]; // W1 -> O2位置
            this.faces.bottom[0] = this.faces.right[3]; // R4 -> W1位置
            this.faces.right[3] = this.faces.top[4]; // Y5 -> R4位置  
            this.faces.top[4] = temp; // O2 -> Y5位置
            
            // O13-Y16-R6-W9-O13 循环（反转方向）
            const temp2 = this.faces.left[12]; // O13
            this.faces.left[12] = this.faces.bottom[8]; // W9 -> O13位置
            this.faces.bottom[8] = this.faces.right[5]; // R6 -> W9位置
            this.faces.right[5] = this.faces.top[15]; // Y16 -> R6位置
            this.faces.top[15] = temp2; // O13 -> Y16位置
            
            // O14-Y17-R8-W11-O14 循环（反转方向）
            const temp3 = this.faces.left[13]; // O14
            this.faces.left[13] = this.faces.bottom[10]; // W11 -> O14位置
            this.faces.bottom[10] = this.faces.right[7]; // R8 -> W11位置
            this.faces.right[7] = this.faces.top[16]; // Y17 -> R8位置
            this.faces.top[16] = temp3; // O14 -> Y17位置
            
            // O12-Y15-R7-W10-O12 循环（反转方向）
            const temp4 = this.faces.left[11]; // O12
            this.faces.left[11] = this.faces.bottom[9]; // W10 -> O12位置
            this.faces.bottom[9] = this.faces.right[6]; // R7 -> W10位置
            this.faces.right[6] = this.faces.top[14]; // Y15 -> R7位置
            this.faces.top[14] = temp4; // O12 -> Y15位置
            
            // O5-Y4-R1-W2-O5 循环（反转方向）
            const temp5 = this.faces.left[4]; // O5 (左面第4个区域)
            this.faces.left[4] = this.faces.bottom[1]; // W2 -> O5位置
            this.faces.bottom[1] = this.faces.right[0]; // R1 -> W2位置
            this.faces.right[0] = this.faces.top[3]; // Y4 -> R1位置
            this.faces.top[3] = temp5; // O5 -> Y4位置
            
            // 前面面内转动：B9-B13-B16-B6-B9 循环
            const temp6 = this.faces.front[8]; // B9
            this.faces.front[8] = this.faces.front[5]; // B6 -> B9位置
            this.faces.front[5] = this.faces.front[15]; // B16 -> B6位置
            this.faces.front[15] = this.faces.front[12]; // B13 -> B16位置
            this.faces.front[12] = temp6; // B9 -> B13位置
            
            // 前面面内转动：B11-B14-B17-B8-B11 循环
            const temp7 = this.faces.front[10]; // B11
            this.faces.front[10] = this.faces.front[7]; // B8 -> B11位置
            this.faces.front[7] = this.faces.front[16]; // B17 -> B8位置
            this.faces.front[16] = this.faces.front[13]; // B14 -> B17位置
            this.faces.front[13] = temp7; // B11 -> B14位置
            
            // 前面面内转动：B10-B12-B15-B7-B10 循环
            const temp8 = this.faces.front[9]; // B10
            this.faces.front[9] = this.faces.front[6]; // B7 -> B10位置
            this.faces.front[6] = this.faces.front[14]; // B15 -> B7位置
            this.faces.front[14] = this.faces.front[11]; // B12 -> B15位置
            this.faces.front[11] = temp8; // B10 -> B12位置
            
            // 前面面内转动：B1-B2-B5-B4-B1 循环
            const temp9 = this.faces.front[0]; // B1
            this.faces.front[0] = this.faces.front[3]; // B4 -> B1位置
            this.faces.front[3] = this.faces.front[4]; // B5 -> B4位置
            this.faces.front[4] = this.faces.front[1]; // B2 -> B5位置
            this.faces.front[1] = temp9; // B1 -> B2位置
        }
        
        // 前面逆时针旋转90度
        rotateFrontCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateFrontClockwise();
            this.rotateFrontClockwise();
            this.rotateFrontClockwise();
        }
        
        // UFL转动逻辑 - 按照新的转角魔方规则（顺时针方向）
        rotateUFL() {
            // O10-Y15-B7-O10 循环（顺时针方向）
            const temp = this.faces.left[9]; // O10
            this.faces.left[9] = this.faces.front[6]; // B7 -> O10位置
            this.faces.front[6] = this.faces.top[14]; // Y15 -> B7位置
            this.faces.top[14] = temp; // O10 -> Y15位置
            
            // O2-Y4-B1-O2 循环（顺时针方向）
            const temp2 = this.faces.left[1]; // O2
            this.faces.left[1] = this.faces.front[0]; // B1 -> O2位置
            this.faces.front[0] = this.faces.top[3]; // Y4 -> B1位置
            this.faces.top[3] = temp2; // O2 -> Y4位置
            
            // O13-Y6-B9-O13 循环（顺时针方向）
            const temp3 = this.faces.left[12]; // O13
            this.faces.left[12] = this.faces.front[8]; // B9 -> O13位置
            this.faces.front[8] = this.faces.top[5]; // Y6 -> B9位置
            this.faces.top[5] = temp3; // O13 -> Y6位置
        }
        
        // UFL逆时针旋转90度
        rotateUFLCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateUFL();
            this.rotateUFL();
        }
        
        // UFR转动逻辑 - 按照新的转角魔方规则（顺时针方向）
        rotateUFR() {
            // B10-Y12-R7-B10 循环（顺时针方向）
            const temp = this.faces.front[9]; // B10 (蓝色面第10个区域)
            this.faces.front[9] = this.faces.right[6]; // R7 -> B10位置
            this.faces.right[6] = this.faces.top[11]; // Y12 -> R7位置
            this.faces.top[11] = temp; // B10 -> Y12位置
            
            // B2-Y5-R1-B2 循环（顺时针方向）
            const temp2 = this.faces.front[1]; // B2
            this.faces.front[1] = this.faces.right[0]; // R1 -> B2位置
            this.faces.right[0] = this.faces.top[4]; // Y5 -> R1位置
            this.faces.top[4] = temp2; // B2 -> Y5位置
            
            // B13-Y16-R9-B13 循环（顺时针方向）
            const temp3 = this.faces.front[12]; // B13
            this.faces.front[12] = this.faces.right[8]; // R9 -> B13位置
            this.faces.right[8] = this.faces.top[15]; // Y16 -> R9位置
            this.faces.top[15] = temp3; // B13 -> Y16位置
        }
        
        // UFR逆时针旋转90度
        rotateUFRCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateUFR();
            this.rotateUFR();
        }
        
        // UBL转动逻辑 - 按照新的转角魔方规则（反转方向）
        rotateUBL() {
            // G10-Y7-O7-G10 循环（反转方向）
            const temp = this.faces.back[9]; // G10
            this.faces.back[9] = this.faces.left[6]; // O7 -> G10位置
            this.faces.left[6] = this.faces.top[6]; // Y7 -> O7位置
            this.faces.top[6] = temp; // G10 -> Y7位置
            
            // G2-Y1-O1-G2 循环（反转方向）
            const temp2 = this.faces.back[1]; // G2
            this.faces.back[1] = this.faces.left[0]; // O1 -> G2位置
            this.faces.left[0] = this.faces.top[0]; // Y1 -> O1位置
            this.faces.top[0] = temp2; // G2 -> Y1位置
            
            // G13-Y9-O9-G13 循环（反转方向）
            const temp3 = this.faces.back[12]; // G13
            this.faces.back[12] = this.faces.left[8]; // O9 -> G13位置
            this.faces.left[8] = this.faces.top[8]; // Y9 -> O9位置
            this.faces.top[8] = temp3; // G13 -> Y9位置
        }
        
        // UBL逆时针旋转90度
        rotateUBLCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateUBL();
            this.rotateUBL();
        }
        
        // UBR转动逻辑 - 按照新的转角魔方规则（反转方向）
        rotateUBR() {
            // R10-Y10-G7-R10 循环（反转方向）
            const temp = this.faces.right[9]; // R10
            this.faces.right[9] = this.faces.back[6]; // G7 -> R10位置
            this.faces.back[6] = this.faces.top[9]; // Y10 -> G7位置
            this.faces.top[9] = temp; // R10 -> Y10位置
            
            // R2-Y2-G1-R2 循环（反转方向）
            const temp2 = this.faces.right[1]; // R2
            this.faces.right[1] = this.faces.back[0]; // G1 -> R2位置
            this.faces.back[0] = this.faces.top[1]; // Y2 -> G1位置
            this.faces.top[1] = temp2; // R2 -> Y2位置
            
            // R13-Y13-G9-R13 循环（反转方向）
            const temp3 = this.faces.right[12]; // R13
            this.faces.right[12] = this.faces.back[8]; // G9 -> R13位置
            this.faces.back[8] = this.faces.top[12]; // Y13 -> G9位置
            this.faces.top[12] = temp3; // R13 -> Y13位置
        }
        
        // UBR逆时针旋转90度
        rotateUBRCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateUBR();
            this.rotateUBR();
        }
        
        // DFL转动逻辑 - 按照新的转角魔方规则（顺时针方向）
        rotateDFL() {
            // O16-B6-W9-O16 循环（顺时针方向）
            const temp = this.faces.left[15]; // O16
            this.faces.left[15] = this.faces.bottom[8]; // W9 -> O16位置
            this.faces.bottom[8] = this.faces.front[5]; // B6 -> W9位置
            this.faces.front[5] = temp; // O16 -> B6位置
            
            // O5-B4-W1-O5 循环（顺时针方向）
            const temp2 = this.faces.left[4]; // O5
            this.faces.left[4] = this.faces.bottom[0]; // W1 -> O5位置
            this.faces.bottom[0] = this.faces.front[3]; // B4 -> W1位置
            this.faces.front[3] = temp2; // O5 -> B4位置
            
            // O12-B15-W7-O12 循环（顺时针方向）
            const temp3 = this.faces.left[11]; // O12
            this.faces.left[11] = this.faces.bottom[6]; // W7 -> O12位置
            this.faces.bottom[6] = this.faces.front[14]; // B15 -> W7位置
            this.faces.front[14] = temp3; // O12 -> B15位置
        }
        
        // DFL逆时针旋转90度
        rotateDFLCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateDFL();
            this.rotateDFL();
        }
        
        // DFR转动逻辑 - 按照新的转角魔方规则（反转方向）
        rotateDFR() {
            // B16-R6-W13-B16 循环（反转方向）
            const temp = this.faces.front[15]; // B16
            this.faces.front[15] = this.faces.bottom[12]; // W13 -> B16位置
            this.faces.bottom[12] = this.faces.right[5]; // R6 -> W13位置
            this.faces.right[5] = temp; // B16 -> R6位置
            
            // B5-R4-W2-B5 循环（反转方向）
            const temp2 = this.faces.front[4]; // B5
            this.faces.front[4] = this.faces.bottom[1]; // W2 -> B5位置
            this.faces.bottom[1] = this.faces.right[3]; // R4 -> W2位置
            this.faces.right[3] = temp2; // B5 -> R4位置
            
            // B12-R15-W10-B12 循环（反转方向）
            const temp3 = this.faces.front[11]; // B12
            this.faces.front[11] = this.faces.bottom[9]; // W10 -> B12位置
            this.faces.bottom[9] = this.faces.right[14]; // R15 -> W10位置
            this.faces.right[14] = temp3; // B12 -> R15位置
        }
        
        // DFR逆时针旋转90度
        rotateDFRCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateDFR();
            this.rotateDFR();
        }
        
        // DBL转动逻辑 - 按照新的转角魔方规则（反转方向）
        rotateDBL() {
            // W6-G16-O6-W6 循环（反转方向）
            const temp = this.faces.bottom[5]; // W6
            this.faces.bottom[5] = this.faces.left[5]; // O6 -> W6位置
            this.faces.left[5] = this.faces.back[15]; // G16 -> O6位置
            this.faces.back[15] = temp; // W6 -> G16位置
            
            // W4-G5-O4-W4 循环（反转方向）
            const temp2 = this.faces.bottom[3]; // W4
            this.faces.bottom[3] = this.faces.left[3]; // O4 -> W4位置
            this.faces.left[3] = this.faces.back[4]; // G5 -> O4位置
            this.faces.back[4] = temp2; // W4 -> G5位置
            
            // W15-G12-O15-W15 循环（反转方向）
            const temp3 = this.faces.bottom[14]; // W15
            this.faces.bottom[14] = this.faces.left[14]; // O15 -> W15位置
            this.faces.left[14] = this.faces.back[11]; // G12 -> O15位置
            this.faces.back[11] = temp3; // W15 -> G12位置
        }
        
        // DBL逆时针旋转90度
        rotateDBLCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateDBL();
            this.rotateDBL();
        }
        
        // DBR转动逻辑 - 按照新的转角魔方规则（反转方向）
        rotateDBR() {
            // R16-G6-W16-R16 循环（反转方向）
            const temp = this.faces.right[15]; // R16
            this.faces.right[15] = this.faces.bottom[15]; // W16 -> R16位置
            this.faces.bottom[15] = this.faces.back[5]; // G6 -> W16位置
            this.faces.back[5] = temp; // R16 -> G6位置
            
            // R5-G4-W5-R5 循环（反转方向）
            const temp2 = this.faces.right[4]; // R5
            this.faces.right[4] = this.faces.bottom[4]; // W5 -> R5位置
            this.faces.bottom[4] = this.faces.back[3]; // G4 -> W5位置
            this.faces.back[3] = temp2; // R5 -> G4位置
            
            // R12-G15-W12-R12 循环（反转方向）
            const temp3 = this.faces.right[11]; // R12
            this.faces.right[11] = this.faces.bottom[11]; // W12 -> R12位置
            this.faces.bottom[11] = this.faces.back[14]; // G15 -> W12位置
            this.faces.back[14] = temp3; // R12 -> G15位置
        }
        
        // DBR逆时针旋转90度
        rotateDBRCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateDBR();
            this.rotateDBR();
        }
        
        // 后面顺时针旋转90度 - 按照新的转角魔方规则（反转方向）
        rotateBackClockwise() {
            // R5-Y2-O1-W4-R5 循环（反转方向）
            const temp = this.faces.right[4]; // R5
            this.faces.right[4] = this.faces.bottom[3]; // W4 -> R5位置
            this.faces.bottom[3] = this.faces.left[0]; // O1 -> W4位置
            this.faces.left[0] = this.faces.top[1]; // Y2 -> O1位置
            this.faces.top[1] = temp; // R5 -> Y2位置
            
            // R12-Y10-O7-W15-R12 循环（反转方向）
            const temp2 = this.faces.right[11]; // R12
            this.faces.right[11] = this.faces.bottom[14]; // W15 -> R12位置
            this.faces.bottom[14] = this.faces.left[6]; // O7 -> W15位置
            this.faces.left[6] = this.faces.top[9]; // Y10 -> O7位置
            this.faces.top[9] = temp2; // R12 -> Y10位置
            
            // R14-Y11-O8-W17-R14 循环（反转方向）
            const temp3 = this.faces.right[13]; // R14
            this.faces.right[13] = this.faces.bottom[16]; // W17 -> R14位置
            this.faces.bottom[16] = this.faces.left[7]; // O8 -> W17位置
            this.faces.left[7] = this.faces.top[10]; // Y11 -> O8位置
            this.faces.top[10] = temp3; // R14 -> Y11位置
            
            // R13-Y9-O6-W16-R13 循环（反转方向）
            const temp4 = this.faces.right[12]; // R13
            this.faces.right[12] = this.faces.bottom[15]; // W16 -> R13位置
            this.faces.bottom[15] = this.faces.left[5]; // O6 -> W16位置
            this.faces.left[5] = this.faces.top[8]; // Y9 -> O6位置
            this.faces.top[8] = temp4; // R13 -> Y9位置
            
            // R2-Y1-O4-W5-R2 循环（反转方向）
            const temp5 = this.faces.right[1]; // R2
            this.faces.right[1] = this.faces.bottom[4]; // W5 -> R2位置
            this.faces.bottom[4] = this.faces.left[3]; // O4 -> W5位置
            this.faces.left[3] = this.faces.top[0]; // Y1 -> O4位置
            this.faces.top[0] = temp5; // R2 -> Y1位置
            
            // 后面面内转动：G1-G4-G5-G2-G1 循环（顺时针方向）
            const temp6 = this.faces.back[0]; // G1
            this.faces.back[0] = this.faces.back[3]; // G4 -> G1位置
            this.faces.back[3] = this.faces.back[4]; // G5 -> G4位置
            this.faces.back[4] = this.faces.back[1]; // G2 -> G5位置
            this.faces.back[1] = temp6; // G1 -> G2位置
            
            // 后面面内转动：G9-G6-G16-G13-G9 循环（顺时针方向）
            const temp7 = this.faces.back[8]; // G9
            this.faces.back[8] = this.faces.back[5]; // G6 -> G9位置
            this.faces.back[5] = this.faces.back[15]; // G16 -> G6位置
            this.faces.back[15] = this.faces.back[12]; // G13 -> G16位置
            this.faces.back[12] = temp7; // G9 -> G13位置
            
            // 后面面内转动：G11-G8-G17-G14-G11 循环（顺时针方向）
            const temp8 = this.faces.back[10]; // G11
            this.faces.back[10] = this.faces.back[7]; // G8 -> G11位置
            this.faces.back[7] = this.faces.back[16]; // G17 -> G8位置
            this.faces.back[16] = this.faces.back[13]; // G14 -> G17位置
            this.faces.back[13] = temp8; // G11 -> G14位置
            
            // 后面面内转动：G10-G7-G15-G12-G10 循环（顺时针方向）
            const temp9 = this.faces.back[9]; // G10
            this.faces.back[9] = this.faces.back[6]; // G7 -> G10位置
            this.faces.back[6] = this.faces.back[14]; // G15 -> G7位置
            this.faces.back[14] = this.faces.back[11]; // G12 -> G15位置
            this.faces.back[11] = temp9; // G10 -> G12位置
        }
        
        // 后面逆时针旋转90度
        rotateBackCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateBackClockwise();
            this.rotateBackClockwise();
            this.rotateBackClockwise();
        }
        
        // 右面顺时针旋转90度 - 按照新的转角魔方规则（修正方向）
        rotateRightClockwise() {
            // B2-Y2-G4-W2-B2 循环（反转方向）
            const temp = this.faces.front[1]; // B2 (蓝色面第2个区域)
            this.faces.front[1] = this.faces.bottom[1]; // W2 -> B2位置
            this.faces.bottom[1] = this.faces.back[3]; // G4 -> W2位置
            this.faces.back[3] = this.faces.top[1]; // Y2 -> G4位置
            this.faces.top[1] = temp; // B2 -> Y2位置
            
            // B13-Y13-G6-W13-B13 循环（反转方向）
            const temp2 = this.faces.front[12]; // B13
            this.faces.front[12] = this.faces.bottom[12]; // W13 -> B13位置
            this.faces.bottom[12] = this.faces.back[5]; // G6 -> W13位置
            this.faces.back[5] = this.faces.top[12]; // Y13 -> G6位置
            this.faces.top[12] = temp2; // B13 -> Y13位置
            
            // B14-Y14-G8-W14-B14 循环（反转方向）
            const temp3 = this.faces.front[13]; // B14
            this.faces.front[13] = this.faces.bottom[13]; // W14 -> B14位置
            this.faces.bottom[13] = this.faces.back[7]; // G8 -> W14位置
            this.faces.back[7] = this.faces.top[13]; // Y14 -> G8位置
            this.faces.top[13] = temp3; // B14 -> Y14位置
            
            // B12-Y12-G7-W12-B12 循环（反转方向）
            const temp4 = this.faces.front[11]; // B12
            this.faces.front[11] = this.faces.bottom[11]; // W12 -> B12位置
            this.faces.bottom[11] = this.faces.back[6]; // G7 -> W12位置
            this.faces.back[6] = this.faces.top[11]; // Y12 -> G7位置
            this.faces.top[11] = temp4; // B12 -> Y12位置
            
            // B5-Y5-G1-W5-B5 循环（反转方向）
            const temp5 = this.faces.front[4]; // B5
            this.faces.front[4] = this.faces.bottom[4]; // W5 -> B5位置
            this.faces.bottom[4] = this.faces.back[0]; // G1 -> W5位置
            this.faces.back[0] = this.faces.top[4]; // Y5 -> G1位置
            this.faces.top[4] = temp5; // B5 -> Y5位置
            
            // 右面面内转动：R9-R13-R16-R6-R9 循环
            const temp6 = this.faces.right[8]; // R9
            this.faces.right[8] = this.faces.right[5]; // R6 -> R9位置
            this.faces.right[5] = this.faces.right[15]; // R16 -> R6位置
            this.faces.right[15] = this.faces.right[12]; // R13 -> R16位置
            this.faces.right[12] = temp6; // R9 -> R13位置
            
            // 右面面内转动：R11-R14-R17-R8-R11 循环
            const temp7 = this.faces.right[10]; // R11
            this.faces.right[10] = this.faces.right[7]; // R8 -> R11位置
            this.faces.right[7] = this.faces.right[16]; // R17 -> R8位置
            this.faces.right[16] = this.faces.right[13]; // R14 -> R17位置
            this.faces.right[13] = temp7; // R11 -> R14位置
            
            // 右面面内转动：R10-R12-R15-R7-R10 循环
            const temp8 = this.faces.right[9]; // R10
            this.faces.right[9] = this.faces.right[6]; // R7 -> R10位置
            this.faces.right[6] = this.faces.right[14]; // R15 -> R7位置
            this.faces.right[14] = this.faces.right[11]; // R12 -> R15位置
            this.faces.right[11] = temp8; // R10 -> R12位置
            
            // 右面面内转动：R1-R2-R5-R4-R1 循环
            const temp9 = this.faces.right[0]; // R1
            this.faces.right[0] = this.faces.right[3]; // R4 -> R1位置
            this.faces.right[3] = this.faces.right[4]; // R5 -> R4位置
            this.faces.right[4] = this.faces.right[1]; // R2 -> R5位置
            this.faces.right[1] = temp9; // R1 -> R2位置
        }
        
        // 右面逆时针旋转90度
        rotateRightCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateRightClockwise();
            this.rotateRightClockwise();
            this.rotateRightClockwise();
        }
        
        // 左面顺时针旋转90度 - 按照新的转角魔方规则（反转方向）
        rotateLeftClockwise() {
            // G5-Y1-B1-W1-G5 循环（反转方向）
            const temp = this.faces.back[4]; // G5
            this.faces.back[4] = this.faces.bottom[0]; // W1 -> G5位置
            this.faces.bottom[0] = this.faces.front[0]; // B1 -> W1位置
            this.faces.front[0] = this.faces.top[0]; // Y1 -> B1位置
            this.faces.top[0] = temp; // G5 -> Y1位置
            
            // G12-Y7-B7-W7-G12 循环（反转方向）
            const temp2 = this.faces.back[11]; // G12
            this.faces.back[11] = this.faces.bottom[6]; // W7 -> G12位置
            this.faces.bottom[6] = this.faces.front[6]; // B7 -> W7位置
            this.faces.front[6] = this.faces.top[6]; // Y7 -> B7位置
            this.faces.top[6] = temp2; // G12 -> Y7位置
            
            // G14-Y8-B8-W8-G14 循环（反转方向）
            const temp3 = this.faces.back[13]; // G14
            this.faces.back[13] = this.faces.bottom[7]; // W8 -> G14位置
            this.faces.bottom[7] = this.faces.front[7]; // B8 -> W8位置
            this.faces.front[7] = this.faces.top[7]; // Y8 -> B8位置
            this.faces.top[7] = temp3; // G14 -> Y8位置
            
            // G13-Y6-B6-W6-G13 循环（反转方向）
            const temp4 = this.faces.back[12]; // G13
            this.faces.back[12] = this.faces.bottom[5]; // W6 -> G13位置
            this.faces.bottom[5] = this.faces.front[5]; // B6 -> W6位置
            this.faces.front[5] = this.faces.top[5]; // Y6 -> B6位置
            this.faces.top[5] = temp4; // G13 -> Y6位置
            
            // G2-Y4-B4-W4-G2 循环（反转方向）
            const temp5 = this.faces.back[1]; // G2
            this.faces.back[1] = this.faces.bottom[3]; // W4 -> G2位置
            this.faces.bottom[3] = this.faces.front[3]; // B4 -> W4位置
            this.faces.front[3] = this.faces.top[3]; // Y4 -> B4位置
            this.faces.top[3] = temp5; // G2 -> Y4位置
            
            // 左面面内转动：O1-O4-O5-O2-O1 循环（顺时针方向）
            const temp6 = this.faces.left[0]; // O1
            this.faces.left[0] = this.faces.left[3]; // O4 -> O1位置
            this.faces.left[3] = this.faces.left[4]; // O5 -> O4位置
            this.faces.left[4] = this.faces.left[1]; // O2 -> O5位置
            this.faces.left[1] = temp6; // O1 -> O2位置
            
            // 左面面内转动：O9-O6-O16-O13-O9 循环（顺时针方向）
            const temp7 = this.faces.left[8]; // O9
            this.faces.left[8] = this.faces.left[5]; // O6 -> O9位置
            this.faces.left[5] = this.faces.left[15]; // O16 -> O6位置
            this.faces.left[15] = this.faces.left[12]; // O13 -> O16位置
            this.faces.left[12] = temp7; // O9 -> O13位置
            
            // 左面面内转动：O11-O8-O17-O14-O11 循环（顺时针方向）
            const temp8 = this.faces.left[10]; // O11
            this.faces.left[10] = this.faces.left[7]; // O8 -> O11位置
            this.faces.left[7] = this.faces.left[16]; // O17 -> O8位置
            this.faces.left[16] = this.faces.left[13]; // O14 -> O17位置
            this.faces.left[13] = temp8; // O11 -> O14位置
            
            // 左面面内转动：O10-O7-O15-O12-O10 循环（顺时针方向）
            const temp9 = this.faces.left[9]; // O10
            this.faces.left[9] = this.faces.left[6]; // O7 -> O10位置
            this.faces.left[6] = this.faces.left[14]; // O15 -> O7位置
            this.faces.left[14] = this.faces.left[11]; // O12 -> O15位置
            this.faces.left[11] = temp9; // O10 -> O12位置
        }
        
        // 左面逆时针旋转90度
        rotateLeftCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateLeftClockwise();
            this.rotateLeftClockwise();
            this.rotateLeftClockwise();
        }
        
        // 上面顺时针旋转90度（反转方向）
        rotateUpClockwise() {
            // O1-G1-R1-B1-O1 循环（反转方向）
            const temp = this.faces.left[0]; // O1
            this.faces.left[0] = this.faces.front[0]; // B1 -> O1位置
            this.faces.front[0] = this.faces.right[0]; // R1 -> B1位置
            this.faces.right[0] = this.faces.back[0]; // G1 -> R1位置
            this.faces.back[0] = temp; // O1 -> G1位置
            
            // O9-G9-R9-B9-O9 循环（反转方向）
            const temp2 = this.faces.left[8]; // O9
            this.faces.left[8] = this.faces.front[8]; // B9 -> O9位置
            this.faces.front[8] = this.faces.right[8]; // R9 -> B9位置
            this.faces.right[8] = this.faces.back[8]; // G9 -> R9位置
            this.faces.back[8] = temp2; // O9 -> G9位置
            
            // O11-G11-R11-B11-O11 循环（反转方向）
            const temp3 = this.faces.left[10]; // O11
            this.faces.left[10] = this.faces.front[10]; // B11 -> O11位置
            this.faces.front[10] = this.faces.right[10]; // R11 -> B11位置
            this.faces.right[10] = this.faces.back[10]; // G11 -> R11位置
            this.faces.back[10] = temp3; // O11 -> G11位置
            
            // O10-G10-R10-B10-O10 循环（反转方向）
            const temp4 = this.faces.left[9]; // O10
            this.faces.left[9] = this.faces.front[9]; // B10 -> O10位置
            this.faces.front[9] = this.faces.right[9]; // R10 -> B10位置
            this.faces.right[9] = this.faces.back[9]; // G10 -> R10位置
            this.faces.back[9] = temp4; // O10 -> G10位置
            
            // O2-G2-R2-B2-O2 循环（反转方向）
            const temp5 = this.faces.left[1]; // O2
            this.faces.left[1] = this.faces.front[1]; // B2 -> O2位置
            this.faces.front[1] = this.faces.right[1]; // R2 -> B2位置
            this.faces.right[1] = this.faces.back[1]; // G2 -> R2位置
            this.faces.back[1] = temp5; // O2 -> G2位置
            
            // 上面面内转动：Y1-Y4-Y5-Y2-Y1 循环（顺时针方向）
            const temp6 = this.faces.top[0]; // Y1
            this.faces.top[0] = this.faces.top[3]; // Y4 -> Y1位置
            this.faces.top[3] = this.faces.top[4]; // Y5 -> Y4位置
            this.faces.top[4] = this.faces.top[1]; // Y2 -> Y5位置
            this.faces.top[1] = temp6; // Y1 -> Y2位置
            
            // 上面面内转动：Y9-Y6-Y16-Y13-Y9 循环（顺时针方向）
            const temp7 = this.faces.top[8]; // Y9
            this.faces.top[8] = this.faces.top[5]; // Y6 -> Y9位置
            this.faces.top[5] = this.faces.top[15]; // Y16 -> Y6位置
            this.faces.top[15] = this.faces.top[12]; // Y13 -> Y16位置
            this.faces.top[12] = temp7; // Y9 -> Y13位置
            
            // 上面面内转动：Y11-Y8-Y17-Y14-Y11 循环（顺时针方向）
            const temp8 = this.faces.top[10]; // Y11
            this.faces.top[10] = this.faces.top[7]; // Y8 -> Y11位置
            this.faces.top[7] = this.faces.top[16]; // Y17 -> Y8位置
            this.faces.top[16] = this.faces.top[13]; // Y14 -> Y17位置
            this.faces.top[13] = temp8; // Y11 -> Y14位置
            
            // 上面面内转动：Y10-Y7-Y15-Y12-Y10 循环（顺时针方向）
            const temp9 = this.faces.top[9]; // Y10
            this.faces.top[9] = this.faces.top[6]; // Y7 -> Y10位置
            this.faces.top[6] = this.faces.top[14]; // Y15 -> Y7位置
            this.faces.top[14] = this.faces.top[11]; // Y12 -> Y15位置
            this.faces.top[11] = temp9; // Y10 -> Y12位置
        }
        
        // 上面逆时针旋转90度
        rotateUpCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateUpClockwise();
            this.rotateUpClockwise();
            this.rotateUpClockwise();
        }
        
        // 下面顺时针旋转90度（反转方向）
        rotateDownClockwise() {
            // W1-R1-G1-O1-W1 循环（反转方向）
            const temp = this.faces.bottom[0]; // W1
            this.faces.bottom[0] = this.faces.right[0]; // R1 -> W1位置
            this.faces.right[0] = this.faces.back[0]; // G1 -> R1位置
            this.faces.back[0] = this.faces.left[0]; // O1 -> G1位置
            this.faces.left[0] = temp; // W1 -> O1位置
            
            // W9-R9-G9-O9-W9 循环（反转方向）
            const temp2 = this.faces.bottom[8]; // W9
            this.faces.bottom[8] = this.faces.right[8]; // R9 -> W9位置
            this.faces.right[8] = this.faces.back[8]; // G9 -> R9位置
            this.faces.back[8] = this.faces.left[8]; // O9 -> G9位置
            this.faces.left[8] = temp2; // W9 -> O9位置
            
            // W11-R11-G11-O11-W11 循环（反转方向）
            const temp3 = this.faces.bottom[10]; // W11
            this.faces.bottom[10] = this.faces.right[10]; // R11 -> W11位置
            this.faces.right[10] = this.faces.back[10]; // G11 -> R11位置
            this.faces.back[10] = this.faces.left[10]; // O11 -> G11位置
            this.faces.left[10] = temp3; // W11 -> O11位置
            
            // W10-R10-G10-O10-W10 循环（反转方向）
            const temp4 = this.faces.bottom[9]; // W10
            this.faces.bottom[9] = this.faces.right[9]; // R10 -> W10位置
            this.faces.right[9] = this.faces.back[9]; // G10 -> R10位置
            this.faces.back[9] = this.faces.left[9]; // O10 -> G10位置
            this.faces.left[9] = temp4; // W10 -> O10位置
            
            // W2-R2-G2-O2-W2 循环（反转方向）
            const temp5 = this.faces.bottom[1]; // W2
            this.faces.bottom[1] = this.faces.right[1]; // R2 -> W2位置
            this.faces.right[1] = this.faces.back[1]; // G2 -> R2位置
            this.faces.back[1] = this.faces.left[1]; // O2 -> G2位置
            this.faces.left[1] = temp5; // W2 -> O2位置
            
            // 下面面内转动：W1-W4-W5-W2-W1 循环（顺时针方向）
            const temp6 = this.faces.bottom[0]; // W1
            this.faces.bottom[0] = this.faces.bottom[3]; // W4 -> W1位置
            this.faces.bottom[3] = this.faces.bottom[4]; // W5 -> W4位置
            this.faces.bottom[4] = this.faces.bottom[1]; // W2 -> W5位置
            this.faces.bottom[1] = temp6; // W1 -> W2位置
            
            // 下面面内转动：W9-W6-W16-W13-W9 循环（顺时针方向）
            const temp7 = this.faces.bottom[8]; // W9
            this.faces.bottom[8] = this.faces.bottom[5]; // W6 -> W9位置
            this.faces.bottom[5] = this.faces.bottom[15]; // W16 -> W6位置
            this.faces.bottom[15] = this.faces.bottom[12]; // W13 -> W16位置
            this.faces.bottom[12] = temp7; // W9 -> W13位置
            
            // 下面面内转动：W11-W8-W17-W14-W11 循环（顺时针方向）
            const temp8 = this.faces.bottom[10]; // W11
            this.faces.bottom[10] = this.faces.bottom[7]; // W8 -> W11位置
            this.faces.bottom[7] = this.faces.bottom[16]; // W17 -> W8位置
            this.faces.bottom[16] = this.faces.bottom[13]; // W14 -> W17位置
            this.faces.bottom[13] = temp8; // W11 -> W14位置
            
            // 下面面内转动：W10-W7-W15-W12-W10 循环（顺时针方向）
            const temp9 = this.faces.bottom[9]; // W10
            this.faces.bottom[9] = this.faces.bottom[6]; // W7 -> W10位置
            this.faces.bottom[6] = this.faces.bottom[14]; // W15 -> W7位置
            this.faces.bottom[14] = this.faces.bottom[11]; // W12 -> W15位置
            this.faces.bottom[11] = temp9; // W10 -> W12位置
        }
        
        // 下面逆时针旋转90度
        rotateDownCounterClockwise() {
            // 执行三次顺时针旋转
            this.rotateDownClockwise();
            this.rotateDownClockwise();
            this.rotateDownClockwise();
        }
    }

    // ===== 双子八面体魔方核心数据结构 =====
    class OctahedronCube extends BaseCubeModel {
        constructor() {
            super();
            this.faceKeys = ['top1', 'top2', 'top3', 'top4', 'bottom1', 'bottom2', 'bottom3', 'bottom4'];
            this.defaultColors = OCTAHEDRON_DEFAULT_COLORS;
            this.initializeCube();
        }

        initializeCube() {
            this.faces = {};
            this.faceKeys.forEach((key, i) => {
                this.faces[key] = Array(OCTAHEDRON_CUBE.FACE_SIZE_TWIN).fill(this.defaultColors[i]);
            });
        }
        
        rotate(axis) {
            axis = axis.toLowerCase();
            const moveMap = {
                'u': () => this.rotateU(),
                'f': () => this.rotateF(),
                'r': () => this.rotateR(),
                'd': () => this.rotateD(),
                'b': () => this.rotateB(),
                'l': () => this.rotateL(),
                "u'": () => this.rotateUPrime(),
                "f'": () => this.rotateFPrime(),
                "r'": () => this.rotateRPrime(),
                "d'": () => this.rotateDPrime(),
                "b'": () => this.rotateBPrime(),
                "l'": () => this.rotateLPrime(),
                'u2': () => { this.rotateU(); this.rotateU(); },
                'f2': () => { this.rotateF(); this.rotateF(); },
                'r2': () => { this.rotateR(); this.rotateR(); },
                'd2': () => { this.rotateD(); this.rotateD(); },
                'b2': () => { this.rotateB(); this.rotateB(); },
                'l2': () => { this.rotateL(); this.rotateL(); }
            };

            const move = moveMap[axis];
            if (move) {
                move();
                this.rotationHistory.push(axis);
            }
        }
        
        rotateU() {
            const f = this.faces;
            let temp;
            
            temp = f.top4[3]; f.top4[3] = f.top1[5]; f.top1[5] = f.top2[3]; f.top2[3] = f.top3[5]; f.top3[5] = temp;
            temp = f.top4[5]; f.top4[5] = f.top1[3]; f.top1[3] = f.top2[5]; f.top2[5] = f.top3[3]; f.top3[3] = temp;
            temp = f.top4[4]; f.top4[4] = f.top1[4]; f.top1[4] = f.top2[4]; f.top2[4] = f.top3[4]; f.top3[4] = temp;
            temp = f.top4[6]; f.top4[6] = f.top1[6]; f.top1[6] = f.top2[6]; f.top2[6] = f.top3[6]; f.top3[6] = temp;
        }

        rotateF() {
            const f = this.faces;
            let temp;
            
            temp = f.top4[3]; f.top4[3] = f.top3[1]; f.top3[1] = f.bottom3[3]; f.bottom3[3] = f.bottom4[1]; f.bottom4[1] = temp;
            temp = f.top4[1]; f.top4[1] = f.top3[3]; f.top3[3] = f.bottom3[1]; f.bottom3[1] = f.bottom4[3]; f.bottom4[3] = temp;
            temp = f.top4[2]; f.top4[2] = f.top3[2]; f.top3[2] = f.bottom3[2]; f.bottom3[2] = f.bottom4[2]; f.bottom4[2] = temp;
            temp = f.top4[6]; f.top4[6] = f.top3[6]; f.top3[6] = f.bottom3[6]; f.bottom3[6] = f.bottom4[6]; f.bottom4[6] = temp;
        }

        rotateR() {
            const f = this.faces;
            let temp;
            
            temp = f.top4[5]; f.top4[5] = f.bottom4[1]; f.bottom4[1] = f.bottom1[5]; f.bottom1[5] = f.top1[1]; f.top1[1] = temp;
            temp = f.top4[1]; f.top4[1] = f.bottom4[5]; f.bottom4[5] = f.bottom1[1]; f.bottom1[1] = f.top1[5]; f.top1[5] = temp;
            temp = f.top4[0]; f.top4[0] = f.bottom4[0]; f.bottom4[0] = f.bottom1[0]; f.bottom1[0] = f.top1[0]; f.top1[0] = temp;
            temp = f.top4[6]; f.top4[6] = f.bottom4[6]; f.bottom4[6] = f.bottom1[6]; f.bottom1[6] = f.top1[6]; f.top1[6] = temp;
        }        

        rotateD() {
            const f = this.faces;
            let temp;
            
            temp = f.bottom1[3]; f.bottom1[3] = f.bottom4[5]; f.bottom4[5] = f.bottom3[3]; f.bottom3[3] = f.bottom2[5]; f.bottom2[5] = temp;
            temp = f.bottom1[5]; f.bottom1[5] = f.bottom4[3]; f.bottom4[3] = f.bottom3[5]; f.bottom3[5] = f.bottom2[3]; f.bottom2[3] = temp;
            temp = f.bottom1[4]; f.bottom1[4] = f.bottom4[4]; f.bottom4[4] = f.bottom3[4]; f.bottom3[4] = f.bottom2[4]; f.bottom2[4] = temp;
            temp = f.bottom1[6]; f.bottom1[6] = f.bottom4[6]; f.bottom4[6] = f.bottom3[6]; f.bottom3[6] = f.bottom2[6]; f.bottom2[6] = temp;
        }

        rotateB() {
            const f = this.faces;
            let temp;
            
            temp = f.top2[3]; f.top2[3] = f.top1[1]; f.top1[1] = f.bottom1[3]; f.bottom1[3] = f.bottom2[1]; f.bottom2[1] = temp;
            temp = f.top2[1]; f.top2[1] = f.top1[3]; f.top1[3] = f.bottom1[1]; f.bottom1[1] = f.bottom2[3]; f.bottom2[3] = temp;
            temp = f.top2[2]; f.top2[2] = f.top1[2]; f.top1[2] = f.bottom1[2]; f.bottom1[2] = f.bottom2[2]; f.bottom2[2] = temp;
            temp = f.top2[6]; f.top2[6] = f.top1[6]; f.top1[6] = f.bottom1[6]; f.bottom1[6] = f.bottom2[6]; f.bottom2[6] = temp;
        }

        rotateL() {
            const f = this.faces;
            let temp;
            
            temp = f.bottom3[5]; f.bottom3[5] = f.top3[1]; f.top3[1] = f.top2[5]; f.top2[5] = f.bottom2[1]; f.bottom2[1] = temp;
            temp = f.bottom3[1]; f.bottom3[1] = f.top3[5]; f.top3[5] = f.top2[1]; f.top2[1] = f.bottom2[5]; f.bottom2[5] = temp;
            temp = f.bottom3[0]; f.bottom3[0] = f.top3[0]; f.top3[0] = f.top2[0]; f.top2[0] = f.bottom2[0]; f.bottom2[0] = temp;
            temp = f.bottom3[6]; f.bottom3[6] = f.top3[6]; f.top3[6] = f.top2[6]; f.top2[6] = f.bottom2[6]; f.bottom2[6] = temp;
        }
        
        rotateUPrime() {
            const f = this.faces;
            let temp;
            
            temp = f.top4[3]; f.top4[3] = f.top3[5]; f.top3[5] = f.top2[3]; f.top2[3] = f.top1[5]; f.top1[5] = temp;
            temp = f.top4[5]; f.top4[5] = f.top3[3]; f.top3[3] = f.top2[5]; f.top2[5] = f.top1[3]; f.top1[3] = temp;
            temp = f.top4[4]; f.top4[4] = f.top3[4]; f.top3[4] = f.top2[4]; f.top2[4] = f.top1[4]; f.top1[4] = temp;
            temp = f.top4[6]; f.top4[6] = f.top3[6]; f.top3[6] = f.top2[6]; f.top2[6] = f.top1[6]; f.top1[6] = temp;
        }
        
        rotateFPrime() {
            const f = this.faces;
            let temp;
            
            temp = f.top4[3]; f.top4[3] = f.bottom4[1]; f.bottom4[1] = f.bottom3[3]; f.bottom3[3] = f.top3[1]; f.top3[1] = temp;
            temp = f.top4[1]; f.top4[1] = f.bottom4[3]; f.bottom4[3] = f.bottom3[1]; f.bottom3[1] = f.top3[3]; f.top3[3] = temp;
            temp = f.top4[2]; f.top4[2] = f.bottom4[2]; f.bottom4[2] = f.bottom3[2]; f.bottom3[2] = f.top3[2]; f.top3[2] = temp;
            temp = f.top4[6]; f.top4[6] = f.bottom4[6]; f.bottom4[6] = f.bottom3[6]; f.bottom3[6] = f.top3[6]; f.top3[6] = temp;
        }
        
        rotateRPrime() {
            const f = this.faces;
            let temp;
            
            temp = f.top4[5]; f.top4[5] = f.top1[1]; f.top1[1] = f.bottom1[5]; f.bottom1[5] = f.bottom4[1]; f.bottom4[1] = temp;
            temp = f.top4[1]; f.top4[1] = f.top1[5]; f.top1[5] = f.bottom1[1]; f.bottom1[1] = f.bottom4[5]; f.bottom4[5] = temp;
            temp = f.top4[0]; f.top4[0] = f.top1[0]; f.top1[0] = f.bottom1[0]; f.bottom1[0] = f.bottom4[0]; f.bottom4[0] = temp;
            temp = f.top4[6]; f.top4[6] = f.top1[6]; f.top1[6] = f.bottom1[6]; f.bottom1[6] = f.bottom4[6]; f.bottom4[6] = temp;
        }        

        rotateDPrime() {
            const f = this.faces;
            let temp;
            
            temp = f.bottom1[3]; f.bottom1[3] = f.bottom2[5]; f.bottom2[5] = f.bottom3[3]; f.bottom3[3] = f.bottom4[5]; f.bottom4[5] = temp;
            temp = f.bottom1[5]; f.bottom1[5] = f.bottom2[3]; f.bottom2[3] = f.bottom3[5]; f.bottom3[5] = f.bottom4[3]; f.bottom4[3] = temp;
            temp = f.bottom1[4]; f.bottom1[4] = f.bottom2[4]; f.bottom2[4] = f.bottom3[4]; f.bottom3[4] = f.bottom4[4]; f.bottom4[4] = temp;
            temp = f.bottom1[6]; f.bottom1[6] = f.bottom2[6]; f.bottom2[6] = f.bottom3[6]; f.bottom3[6] = f.bottom4[6]; f.bottom4[6] = temp;
        }

        rotateBPrime() {
            const f = this.faces;
            let temp;
            
            temp = f.top2[3]; f.top2[3] = f.bottom2[1]; f.bottom2[1] = f.bottom1[3]; f.bottom1[3] = f.top1[1]; f.top1[1] = temp;
            temp = f.top2[1]; f.top2[1] = f.bottom2[3]; f.bottom2[3] = f.bottom1[1]; f.bottom1[1] = f.top1[3]; f.top1[3] = temp;
            temp = f.top2[2]; f.top2[2] = f.bottom2[2]; f.bottom2[2] = f.bottom1[2]; f.bottom1[2] = f.top1[2]; f.top1[2] = temp;
            temp = f.top2[6]; f.top2[6] = f.bottom2[6]; f.bottom2[6] = f.bottom1[6]; f.bottom1[6] = f.top1[6]; f.top1[6] = temp;
        }

        rotateLPrime() {
            const f = this.faces;
            let temp;
            
            temp = f.bottom3[5]; f.bottom3[5] = f.bottom2[1]; f.bottom2[1] = f.top2[5]; f.top2[5] = f.top3[1]; f.top3[1] = temp;
            temp = f.bottom3[1]; f.bottom3[1] = f.bottom2[5]; f.bottom2[5] = f.top2[1]; f.top2[1] = f.top3[5]; f.top3[5] = temp;
            temp = f.bottom3[0]; f.bottom3[0] = f.bottom2[0]; f.bottom2[0] = f.top2[0]; f.top2[0] = f.bottom2[0]; f.bottom2[0] = temp;
            temp = f.bottom3[6]; f.bottom3[6] = f.bottom2[6]; f.bottom2[6] = f.top2[6]; f.top2[6] = f.bottom2[6]; f.bottom2[6] = temp;
        }      
        
        scramble(moves = 20) {
            const axes = ['u', 'f', 'r', 'd', 'b', 'l'];
            const angles = [90, -90];
            for (let i = 0; i < moves; i++) {
                const axis = axes[Math.floor(Math.random() * axes.length)];
                this.rotate(axis);
            }
        }
        
        reset() {
            this.initializeCube();
            this.rotationHistory = [];
        }
    }

    // ===== 二阶转面八面体魔方核心数据结构 =====
    class TwinOctahedronCube extends BaseCubeModel {
        constructor() {
            super();
            this.faceKeys = ['top1', 'top2', 'top3', 'top4', 'bottom1', 'bottom2', 'bottom3', 'bottom4'];
            this.defaultColors = OCTAHEDRON_DEFAULT_COLORS;
            this.initializeCube();
            this.rotationHistory = [];
        }

        initializeCube() {
            this.faces = {};
            this.faceKeys.forEach((key, i) => {
                this.faces[key] = Array(OCTAHEDRON_CUBE.FACE_SIZE_TWIN).fill(this.defaultColors[i]);
            });
        }
        
        rotate(axis) {
            switch(axis) {
                case 'RU': this.rotateRU(); break;
                case 'RD': this.rotateRD(); break;
                case 'LU': this.rotateLU(); break;
                case 'LD': this.rotateLD(); break;
                case "RU'": this.rotateRU(); this.rotateRU(); break;
                case "RD'": this.rotateRD(); this.rotateRD(); break;
                case "LU'": this.rotateLU(); this.rotateLU(); break;
                case "LD'": this.rotateLD(); this.rotateLD(); break;
            }
        }
        
        rotateRU() {
            const f = this.faces;
            let temp;

            // RU旋转逻辑: VII2-II3-V1-VII2 (正向)
            temp = f.bottom3[1]; f.bottom3[1] = f.bottom1[0]; f.bottom1[0] = f.top2[2]; f.top2[2] = temp; // 循环完成
            // VIII1-III3-I2-VIII1 (正向)
            temp = f.bottom4[0]; f.bottom4[0] = f.top1[1]; f.top1[1] = f.top3[2]; f.top3[2] = temp; // 循环完成
            // VIII2-III1-I3-VIII2 (正向)
            temp = f.bottom4[1]; f.bottom4[1] = f.top1[2]; f.top1[2] = f.top3[0]; f.top3[0] = temp; // 循环完成
            // VIII4-III4-I4-VIII4 (正向)
            temp = f.bottom4[3]; f.bottom4[3] = f.top1[3]; f.top1[3] = f.top3[3]; f.top3[3] = temp; // 循环完成
            // IV1-IV2-IV3-IV1 (正向)
            temp = f.top4[0]; f.top4[0] = f.top4[2]; f.top4[2] = f.top4[1]; f.top4[1] = temp;
        }

        rotateRD() {
            const f = this.faces;
            let temp;

            // RD旋转逻辑: III1-I2-VI3-III1 (正向)
            temp = f.top3[0]; f.top3[0] = f.bottom2[2]; f.bottom2[2] = f.top1[1]; f.top1[1] = temp; // 循环完成
            // VII2-IV1-V3-VII2 (正向)
            temp = f.bottom3[1]; f.bottom3[1] = f.bottom1[2]; f.bottom1[2] = f.top4[0]; f.top4[0] = temp; // 循环完成
            // VII3-IV2-V1-VII3 (正向)
            temp = f.bottom3[2]; f.bottom3[2] = f.bottom1[0]; f.bottom1[0] = f.top4[1]; f.top4[1] = temp; // 循环完成
            // VII4-IV4-V4-VII4 (正向)
            temp = f.bottom3[3]; f.bottom3[3] = f.bottom1[3]; f.bottom1[3] = f.top4[3]; f.top4[3] = temp; // 循环完成
            // VIII1-VIII2-VIII3-VIII1 (正向)
            temp = f.bottom4[0]; f.bottom4[0] = f.bottom4[2]; f.bottom4[2] = f.bottom4[1]; f.bottom4[1] = temp;
        }

        rotateLU() {
            const f = this.faces;
            let temp;

            // LU旋转逻辑: I3-VIII1-VI2-I3 (反向)
            temp = f.top1[2]; f.top1[2] = f.bottom2[1]; f.bottom2[1] = f.bottom4[0]; f.bottom4[0] = temp; // 循环完成
            // IV2-VII1-II3-IV2 (反向)
            temp = f.top4[1]; f.top4[1] = f.top2[2]; f.top2[2] = f.bottom3[0]; f.bottom3[0] = temp; // 循环完成
            // IV3-VII2-II1-IV3 (反向)
            temp = f.top4[2]; f.top4[2] = f.top2[0]; f.top2[0] = f.bottom3[1]; f.bottom3[1] = temp; // 循环完成
            // IV4-VII4-II4-IV4 (反向)
            temp = f.top4[3]; f.top4[3] = f.top2[3]; f.top2[3] = f.bottom3[3]; f.bottom3[3] = temp; // 循环完成
            // III1-III2-III3-III1 (反向)
            temp = f.top3[0]; f.top3[0] = f.top3[2]; f.top3[2] = f.top3[1]; f.top3[1] = temp;
        }

        rotateLD() {
            const f = this.faces;
            let temp;

            // LD旋转逻辑: IV2-V3-II1-IV2 (反向)
            temp = f.top4[1]; f.top4[1] = f.top2[0]; f.top2[0] = f.bottom1[2]; f.bottom1[2] = temp; // 循环完成
            // VIII1-VI3-III2-VIII1 (反向)
            temp = f.bottom4[0]; f.bottom4[0] = f.top3[1]; f.top3[1] = f.bottom2[2]; f.bottom2[2] = temp; // 循环完成
            // VIII3-VI2-III1-VIII3 (反向)
            temp = f.bottom4[2]; f.bottom4[2] = f.top3[0]; f.top3[0] = f.bottom2[1]; f.bottom2[1] = temp; // 循环完成
            // VIII4-VI4-III4-VIII4 (反向)
            temp = f.bottom4[3]; f.bottom4[3] = f.top3[3]; f.top3[3] = f.bottom2[3]; f.bottom2[3] = temp; // 循环完成
            // VII1-VII2-VII3-VII1 (反向)
            temp = f.bottom3[0]; f.bottom3[0] = f.bottom3[2]; f.bottom3[2] = f.bottom3[1]; f.bottom3[1] = temp;
        }

        scramble(moves = 20) {
            const axes = ['u', 'f', 'r', 'd', 'b', 'l'];
            const angles = [90, -90];
            for (let i = 0; i < moves; i++) {
                const axis = axes[Math.floor(Math.random() * axes.length)];
                this.rotate(axis);
            }
        }
        
        reset() {
            this.initializeCube();
            this.rotationHistory = [];
        }
    }

    // ===== 转角八面体魔方核心数据结构 =====
    class CornerOctaCube extends BaseCubeModel {
        constructor() {
            super();
            this.faceKeys = ['top1', 'top2', 'top3', 'top4', 'bottom1', 'bottom2', 'bottom3', 'bottom4'];
            this.defaultColors = OCTAHEDRON_DEFAULT_COLORS;
            this.initializeCube();
        }

        initializeCube() {
            this.faces = {};
            this.faceKeys.forEach((key, i) => {
                this.faces[key] = Array(OCTAHEDRON_CUBE.FACE_SIZE_CORNER).fill(this.defaultColors[i]);
            });
        }

        rotate(axis) {
            const moveMap = {
                'U': () => this.rotateU(),
                'u': () => this.rotateu(),
                'F': () => this.rotateF(),
                'f': () => this.rotatef(),
                'R': () => this.rotateR(),
                'r': () => this.rotater(),
                'D': () => this.rotateD(),
                'd': () => this.rotated(),
                'B': () => this.rotateB(),
                'b': () => this.rotateb(),
                'L': () => this.rotateL(),
                'l': () => this.rotatel(),
                "U'": () => { this.rotateU(); this.rotateU(); this.rotateU(); },
                "F'": () => { this.rotateF(); this.rotateF(); this.rotateF(); },
                "R'": () => { this.rotateR(); this.rotateR(); this.rotateR(); },
                "D'": () => { this.rotateD(); this.rotateD(); this.rotateD(); },
                "B'": () => { this.rotateB(); this.rotateB(); this.rotateB(); },
                "L'": () => { this.rotateL(); this.rotateL(); this.rotateL(); },
                "u'": () => { this.rotateu(); this.rotateu(); this.rotateu(); },
                "f'": () => { this.rotatef(); this.rotatef(); this.rotatef(); },
                "r'": () => { this.rotater(); this.rotater(); this.rotater(); },
                "d'": () => { this.rotated(); this.rotated(); this.rotated(); },
                "b'": () => { this.rotateb(); this.rotateb(); this.rotateb(); },
                "l'": () => { this.rotatel(); this.rotatel(); this.rotatel(); },
                'U2': () => { this.rotateU(); this.rotateU(); },
                'u2': () => { this.rotateu(); this.rotateu(); },
                'F2': () => { this.rotateF(); this.rotateF(); },
                'f2': () => { this.rotatef(); this.rotatef(); },
                'R2': () => { this.rotateR(); this.rotateR(); },
                'r2': () => { this.rotater(); this.rotater(); },
                'D2': () => { this.rotateD(); this.rotateD(); },
                'd2': () => { this.rotated(); this.rotated(); },
                'B2': () => { this.rotateB(); this.rotateB(); },
                'b2': () => { this.rotateb(); this.rotateb(); },
                'L2': () => { this.rotateL(); this.rotateL(); },
                'l2': () => { this.rotatel(); this.rotatel(); }
            };

            const move = moveMap[axis];
            if (move) {
                move();
                this.rotationHistory.push(axis);
            }
        }

        rotateU() {
            const f = this.faces;
            let temp;

            temp = f.top1[5]; f.top1[5] = f.top2[5]; f.top2[5] = f.top3[5]; f.top3[5] = f.top4[5]; f.top4[5] = temp;
            temp = f.top1[6]; f.top1[6] = f.top2[6]; f.top2[6] = f.top3[6]; f.top3[6] = f.top4[6]; f.top4[6] = temp;
            temp = f.top1[7]; f.top1[7] = f.top2[7]; f.top2[7] = f.top3[7]; f.top3[7] = f.top4[7]; f.top4[7] = temp;
            temp = f.top1[8]; f.top1[8] = f.top2[8]; f.top2[8] = f.top3[8]; f.top3[8] = f.top4[8]; f.top4[8] = temp;
        }

        rotateu() {
            const f = this.faces;
            let temp;

            temp = f.top1[8]; f.top1[8] = f.top2[8]; f.top2[8] = f.top3[8]; f.top3[8] = f.top4[8]; f.top4[8] = temp;
        }

        rotateF() {
            const f = this.faces;
            let temp;

            temp = f.top3[1]; f.top3[1] = f.bottom3[6]; f.bottom3[6] = f.bottom4[1]; f.bottom4[1] = f.top4[6]; f.top4[6] = temp;
            temp = f.top3[3]; f.top3[3] = f.bottom3[4]; f.bottom3[4] = f.bottom4[3]; f.bottom4[3] = f.top4[4]; f.top4[4] = temp;
            temp = f.top3[5]; f.top3[5] = f.bottom3[1]; f.bottom3[1] = f.bottom4[5]; f.bottom4[5] = f.top4[1]; f.top4[1] = temp;
            temp = f.top3[0]; f.top3[0] = f.bottom3[2]; f.bottom3[2] = f.bottom4[0]; f.bottom4[0] = f.top4[2]; f.top4[2] = temp;
        }

        rotatef() {
            const f = this.faces;
            let temp;

            temp = f.top3[0]; f.top3[0] = f.bottom3[2]; f.bottom3[2] = f.bottom4[0]; f.bottom4[0] = f.top4[2]; f.top4[2] = temp;
        }

        rotateR() {
            const f = this.faces;
            let temp;

            temp = f.bottom4[1]; f.bottom4[1] = f.bottom1[5]; f.bottom1[5] = f.top1[1]; f.top1[1] = f.top4[5]; f.top4[5] = temp;
            temp = f.bottom4[4]; f.bottom4[4] = f.bottom1[3]; f.bottom1[3] = f.top1[4]; f.top1[4] = f.top4[3]; f.top4[3] = temp;
            temp = f.bottom4[6]; f.bottom4[6] = f.bottom1[1]; f.bottom1[1] = f.top1[6]; f.top1[6] = f.top4[1]; f.top4[1] = temp;
            temp = f.bottom4[2]; f.bottom4[2] = f.bottom1[0]; f.bottom1[0] = f.top1[2]; f.top1[2] = f.top4[0]; f.top4[0] = temp;
        }

        rotater() {
            const f = this.faces;
            let temp;

            temp = f.bottom4[2]; f.bottom4[2] = f.bottom1[0]; f.bottom1[0] = f.top1[2]; f.top1[2] = f.top4[0]; f.top4[0] = temp;
        }

        rotateD() {
            const f = this.faces;
            let temp;

            temp = f.bottom3[5]; f.bottom3[5] = f.bottom2[5]; f.bottom2[5] = f.bottom1[5]; f.bottom1[5] = f.bottom4[5]; f.bottom4[5] = temp;
            temp = f.bottom3[6]; f.bottom3[6] = f.bottom2[6]; f.bottom2[6] = f.bottom1[6]; f.bottom1[6] = f.bottom4[6]; f.bottom4[6] = temp;
            temp = f.bottom3[7]; f.bottom3[7] = f.bottom2[7]; f.bottom2[7] = f.bottom1[7]; f.bottom1[7] = f.bottom4[7]; f.bottom4[7] = temp;
            temp = f.bottom3[8]; f.bottom3[8] = f.bottom2[8]; f.bottom2[8] = f.bottom1[8]; f.bottom1[8] = f.bottom4[8]; f.bottom4[8] = temp;
        }

        rotated() {
            const f = this.faces;
            let temp;

            temp = f.bottom3[8]; f.bottom3[8] = f.bottom2[8]; f.bottom2[8] = f.bottom1[8]; f.bottom1[8] = f.bottom4[8]; f.bottom4[8] = temp;
        }

        rotateB() {
            const f = this.faces;
            let temp;

            temp = f.top1[1]; f.top1[1] = f.bottom1[6]; f.bottom1[6] = f.bottom2[1]; f.bottom2[1] = f.top2[6]; f.top2[6] = temp;
            temp = f.top1[3]; f.top1[3] = f.bottom1[4]; f.bottom1[4] = f.bottom2[3]; f.bottom2[3] = f.top2[4]; f.top2[4] = temp;
            temp = f.top1[5]; f.top1[5] = f.bottom1[1]; f.bottom1[1] = f.bottom2[5]; f.bottom2[5] = f.top2[1]; f.top2[1] = temp;
            temp = f.top1[0]; f.top1[0] = f.bottom1[2]; f.bottom1[2] = f.bottom2[0]; f.bottom2[0] = f.top2[2]; f.top2[2] = temp;
        }

        rotateb() {
            const f = this.faces;
            let temp;

            temp = f.top1[0]; f.top1[0] = f.bottom1[2]; f.bottom1[2] = f.bottom2[0]; f.bottom2[0] = f.top2[2]; f.top2[2] = temp;
        }

        rotateL() {
            const f = this.faces;
            let temp;

            temp = f.top3[1]; f.top3[1] = f.top2[5]; f.top2[5] = f.bottom2[1]; f.bottom2[1] = f.bottom3[5]; f.bottom3[5] = temp;
            temp = f.top3[4]; f.top3[4] = f.top2[3]; f.top2[3] = f.bottom2[4]; f.bottom2[4] = f.bottom3[3]; f.bottom3[3] = temp;
            temp = f.top3[6]; f.top3[6] = f.top2[1]; f.top2[1] = f.bottom2[6]; f.bottom2[6] = f.bottom3[1]; f.bottom3[1] = temp;
            temp = f.top3[2]; f.top3[2] = f.top2[0]; f.top2[0] = f.bottom2[2]; f.bottom2[2] = f.bottom3[0]; f.bottom3[0] = temp;
        }

        rotatel() {
            const f = this.faces;
            let temp;

            temp = f.top3[2]; f.top3[2] = f.top2[0]; f.top2[0] = f.bottom2[2]; f.bottom2[2] = f.bottom3[0]; f.bottom3[0] = temp;
        }

        reset() {
            this.initializeCube();
            this.rotationHistory = [];
        }
    }

    // ===== 打乱生成器模块 =====
    
    // 转角三阶魔方打乱生成器
    class CornerScrambleGenerator extends BaseScrambleGenerator {
        constructor() {
            super();
            this.config = {
                cycles: 3,
                zeroProb: 0.15
            };
        }

        generate() {
            const layers = ['U', 'R', 'F', 'D', 'B', 'L'];
            const cornerPositions = ['UR', 'DR', 'DL', 'UL'];
            const version = 4;
            const zeroProb = this.config.zeroProb;
            const cycles = this.config.cycles;
            
            let scramble = [];
            let lastLayer = null;
            let lastDirection = null;
            let layerHistory = [];
            
            const getRandomLayer = () => {
                let available = layers.filter(l => !layerHistory.includes(l));
                if (available.length === 0) {
                    available = layers;
                    layerHistory = [];
                }
                return available[Math.floor(Math.random() * available.length)];
            };
            
            const getDirection = (layer) => {
                if (lastLayer === layer) {
                    const directions = ['', '2'];
                    if (lastDirection !== '\'\'' && lastDirection !== '2') {
                        directions.push('\'');
                    }
                    return directions[Math.floor(Math.random() * directions.length)];
                }
                return ['', '\'', '2'][Math.floor(Math.random() * 3)];
            };
            
            for (let cycle = 0; cycle < cycles; cycle++) {
                // 第一组层转动
                for (let i = 0; i < version; i++) {
                    const layer = getRandomLayer();
                    const direction = getDirection(layer);
                    scramble.push(layer + direction);
                    lastLayer = layer;
                    lastDirection = direction;
                    layerHistory.push(layer);
                    if (layerHistory.length > 4) layerHistory.shift();
                }
                
                // 第一组转角
                for (const pos of cornerPositions) {
                    const rand = Math.random();
                    if (rand < zeroProb) {
                        scramble.push(pos + '0');
                    } else if (rand < zeroProb + (1 - zeroProb) / 2) {
                        scramble.push(pos + '+');
                    } else {
                        scramble.push(pos + '-');
                    }
                }
                
                // x2翻面
                scramble.push('x2');
                
                // 第二组转角
                for (const pos of cornerPositions) {
                    const rand = Math.random();
                    if (rand < zeroProb) {
                        scramble.push(pos + '0');
                    } else if (rand < zeroProb + (1 - zeroProb) / 2) {
                        scramble.push(pos + '+');
                    } else {
                        scramble.push(pos + '-');
                    }
                }
                
                // 第二组层转动
                for (let i = 0; i < version; i++) {
                    const layer = getRandomLayer();
                    const direction = getDirection(layer);
                    scramble.push(layer + direction);
                    lastLayer = layer;
                    lastDirection = direction;
                    layerHistory.push(layer);
                    if (layerHistory.length > 4) layerHistory.shift();
                }
            }
            
            return scramble;
        }

        convertToMoves(scramble) {
            const converted = [];
            for (const move of scramble) {
                if (move === 'x2') {
                    converted.push('x2');
                } else if (move.startsWith('UR')) {
                    if (move.endsWith('+')) converted.push('UFR');
                    else if (move.endsWith('-')) converted.push('UFR\'');
                } else if (move.startsWith('UL')) {
                    if (move.endsWith('+')) converted.push('UFL');
                    else if (move.endsWith('-')) converted.push('UFL\'');
                } else if (move.startsWith('DR')) {
                    if (move.endsWith('+')) converted.push('DFR');
                    else if (move.endsWith('-')) converted.push('DFR\'');
                } else if (move.startsWith('DL')) {
                    if (move.endsWith('+')) converted.push('DFL');
                    else if (move.endsWith('-')) converted.push('DFL\'');
                } else {
                    converted.push(move);
                }
            }
            return converted;
        }

        getScrambleText(scramble) {
            let text = '';
            const version = 4;
            const cycles = this.config.cycles;
            const stepsPerCycle = 17;
            
            for (let cycle = 0; cycle < cycles; cycle++) {
                const startIdx = cycle * stepsPerCycle;
                for (let i = 0; i < version; i++) {
                    text += scramble[startIdx + i] + ' ';
                }
                for (let i = 0; i < 4; i++) {
                    text += scramble[startIdx + version + i] + ' ';
                }
                text += scramble[startIdx + version + 4] + ' ';
                for (let i = 0; i < 4; i++) {
                    text += scramble[startIdx + version + 5 + i] + ' ';
                }
                for (let i = 0; i < version; i++) {
                    text += scramble[startIdx + version + 9 + i] + ' ';
                }
                text += '; ';
            }
            return text.trim();
        }
    }

    // 双子八面体魔方打乱生成器
    class OctahedronScrambleGenerator extends BaseScrambleGenerator {
        generate() {
            const layers = ['U', 'R', 'F', 'D', 'B', 'L'];
            let scramble = [];
            let lastLayer = null;
            let layerHistory = [];
            
            const getRandomLayer = () => {
                let available = layers.filter(l => !layerHistory.includes(l));
                if (available.length === 0) {
                    available = layers;
                    layerHistory = [];
                }
                return available[Math.floor(Math.random() * available.length)];
            };
            
            const getDirection = () => {
                return ['', '\'', '2'][Math.floor(Math.random() * 3)];
            };
            
            for (let i = 0; i < 20; i++) {
                const layer = getRandomLayer();
                const direction = getDirection();
                scramble.push(layer + direction);
                lastLayer = layer;
                layerHistory.push(layer);
                if (layerHistory.length > 4) layerHistory.shift();
            }
            
            return scramble.join(' ');
        }
    }

    // 转角八面体魔方打乱生成器
    class CornerOctaScrambleGenerator extends BaseScrambleGenerator {
        constructor() {
            super();
            this.config = {
                includeCorners: true
            };
        }

        generate() {
            const includeCorners = this.config.includeCorners;
            const baseMoves = ['U', 'R', 'F', 'D', 'B', 'L'];
            const cornerMoves = ['u', 'r', 'f', 'd', 'b', 'l'];
            
            const opposites = {
                'U': 'D', 'D': 'U', 'F': 'B', 'B': 'F', 'R': 'L', 'L': 'R'
            };
            
            let scramble = [];
            let lastBaseMove = null;
            let secondLastBaseMove = null;
            
            const getRandomBaseMove = () => {
                let available = [...baseMoves];
                if (lastBaseMove) {
                    available = available.filter(m => m !== lastBaseMove);
                }
                if (secondLastBaseMove && lastBaseMove) {
                    if (opposites[secondLastBaseMove] === lastBaseMove) {
                        available = available.filter(m => opposites[m] !== secondLastBaseMove);
                    }
                }
                if (available.length === 0) {
                    return baseMoves[Math.floor(Math.random() * baseMoves.length)];
                }
                return available[Math.floor(Math.random() * available.length)];
            };
            
            const getRandomDirection = () => {
                return ['', '\'', '2'][Math.floor(Math.random() * 3)];
            };
            
            const minSteps = 25;
            const maxSteps = 30;
            
            // 生成面转动步骤
            for (let i = 0; i < minSteps + Math.floor(Math.random() * (maxSteps - minSteps + 1)); i++) {
                const baseMove = getRandomBaseMove();
                const direction = getRandomDirection();
                scramble.push(baseMove + direction);
                secondLastBaseMove = lastBaseMove;
                lastBaseMove = baseMove;
            }
            
            // 将小角打乱统一放在最后
            if (includeCorners) {
                // 随机选择0~6个不同的角块移动
                const numCornerMoves = Math.floor(Math.random() * 7);
                const shuffledCornerMoves = [...cornerMoves].sort(() => Math.random() - 0.5);
                const selectedCornerMoves = shuffledCornerMoves.slice(0, numCornerMoves);
                for (const cornerMove of selectedCornerMoves) {
                    const direction = getRandomDirection();
                    scramble.push(cornerMove + direction);
                }
            }
            
            return scramble.join(' ');
        }
    }

    // 二阶转面八面体魔方打乱生成器
    class TwinOctahedronScrambleGenerator extends BaseScrambleGenerator {
        constructor() {
            super();
            this.config = {
                includeCorners: true
            };
        }

        generate() {
            // 定义所有可用的操作（内部使用RU,RD,LU,LD）
            const allMoves = ['RU', 'RD', 'LU', 'LD', "RU'", "RD'", "LU'", "LD'"];

            // 定义同向组（同一方向，如RU和RU'，也包括RU和RU）
            const sameDirection = {
                'RU': ["RU'", "RU"],
                'RD': ["RD'", "RD"],
                'LU': ["LU'", "LU"],
                'LD': ["LD'", "LD"],
                "RU'": ["RU", "RU'"],
                "RD'": ["RD", "RD'"],
                "LU'": ["LU", "LU'"],
                "LD'": ["LD", "LD'"]
            };

            // 显示映射：RU->R, RD->F, LU->U, LD->L
            const displayMap = {
                'RU': 'R', "RU'": "R'",
                'RD': 'F', "RD'": "F'",
                'LU': 'U', "LU'": "U'",
                'LD': 'L', "LD'": "L'"
            };

            let scramble = [];
            let displayScramble = [];
            let lastMove = null;

            // 生成8步打乱公式
            for (let i = 0; i < 8; i++) {
                let availableMoves = allMoves.filter(move => {
                    // 限制：同一方向不能连续使用（包括相同的操作）
                    if (lastMove && sameDirection[lastMove].includes(move)) {
                        return false;
                    }

                    return true;
                });

                // 如果没有可用操作，使用所有操作（避免死循环）
                if (availableMoves.length === 0) {
                    availableMoves = allMoves;
                }

                // 随机选择一个可用操作
                const selectedMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                scramble.push(selectedMove);
                displayScramble.push(displayMap[selectedMove]);
                lastMove = selectedMove;
            }

            return displayScramble.join(' ');
        }
    }

    // ===== 视图渲染器模块 =====
    
    // 转角三阶魔方视图渲染器
    class CornerViewRenderer extends BaseViewRenderer {
        constructor(containerId) {
            super(containerId);
            this.canvasCache = new Map();  // 缓存 Canvas 元素
            this.canvasContextCache = new Map();  // 缓存 Canvas 上下文
        }

        render(model) {
            const faceElements = {
                top: document.getElementById('face-top'),
                bottom: document.getElementById('face-bottom'),
                front: document.getElementById('face-front'),
                back: document.getElementById('face-back'),
                left: document.getElementById('face-left'),
                right: document.getElementById('face-right')
            };

            Object.entries(faceElements).forEach(([faceName, faceElement]) => {
                if (!faceElement) return;

                // 检查是否已有 Canvas
                if (!this.canvasCache.has(faceName)) {
                    const label = faceElement.querySelector('.face-label');
                    faceElement.innerHTML = '';
                    if (label) faceElement.appendChild(label);

                    const canvas = document.createElement('canvas');
                    canvas.width = RENDER_CONFIG.CANVAS_SIZE;
                    canvas.height = RENDER_CONFIG.CANVAS_SIZE;
                    canvas.style.width = '100%';
                    canvas.style.height = '100%';

                    const ctx = canvas.getContext('2d');
                    faceElement.appendChild(canvas);

                    this.canvasCache.set(faceName, canvas);
                    this.canvasContextCache.set(faceName, ctx);
                }

                // 清除 Canvas 并重新绘制
                const ctx = this.canvasContextCache.get(faceName);
                const canvas = this.canvasCache.get(faceName);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.drawCornerCubeFace(ctx, model.faces[faceName], faceName);
            });
        }

        drawCornerCubeFace(ctx, faceColors, faceName) {
            const a = 1;
            const scale = RENDER_CONFIG.CANVAS_SCALE;
            const sqrt2_a = a * Math.sqrt(2);
            const three_minus_sqrt2_a = 3 * a - sqrt2_a;
            const toCanvasX = (x) => x * scale;
            const toCanvasY = (y) => 150 - y * scale;
            const linspace = (start, end, n) => {
                const arr = [];
                const step = (end - start) / (n - 1);
                for (let i = 0; i < n; i++) arr.push(start + step * i);
                return arr;
            };
            const fliplr = (arr) => arr.slice().reverse();
            const fillPolygon = (points, colorIndex) => {
                ctx.beginPath();
                ctx.moveTo(toCanvasX(points[0][0]), toCanvasY(points[0][1]));
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(toCanvasX(points[i][0]), toCanvasY(points[i][1]));
                }
                ctx.closePath();
                ctx.fillStyle = CORNER_CUBE_COLOR_MAP[faceColors[colorIndex]];
                ctx.fill();
                ctx.strokeStyle = RENDER_CONFIG.STROKE_COLOR;
                ctx.lineWidth = 1;
                ctx.stroke();
            };
            fillPolygon([[0,2],[1,2],[1,3],[0,3]], 0);
            fillPolygon([[2,2],[3,2],[3,3],[2,3]], 1);
            fillPolygon([[1,1],[2,1],[2,2],[1,2]], 2);
            fillPolygon([[0,0],[1,0],[1,1],[0,1]], 3);
            fillPolygon([[2,0],[3,0],[3,1],[2,1]], 4);
            const x6 = linspace(0, 1, 30);
            const y6_curve = x6.map(x => Math.sqrt(Math.max(2 - x*x, 0)));
            const pts6 = [[0,1], ...x6.map((x, i) => [x, y6_curve[i]])];
            fillPolygon(pts6, 5);
            const x7 = linspace(0, 1, 30);
            const y7_curve = x7.map(x => 3 - Math.sqrt(Math.max(2 - x*x, 0)));
            const pts7 = [[0,2], ...x7.map((x, i) => [x, y7_curve[i]])];
            fillPolygon(pts7, 6);
            const x8 = linspace(0, 1, 30);
            const y8_c1 = x8.map(x => Math.sqrt(Math.max(2 - x*x, 0)));
            const y8_c2 = x8.map(x => 3 - Math.sqrt(Math.max(2 - x*x, 0)));
            const pts8 = [...x8.map((x, i) => [x, y8_c2[i]]), ...fliplr(x8).map((x, i) => [x, fliplr(y8_c1)[i]])];
            fillPolygon(pts8, 7);
            const x9 = linspace(1, sqrt2_a, 30);
            const y9_curve = x9.map(x => 3 - Math.sqrt(Math.max(2 - x*x, 0)));
            const pts9 = [[1,3], ...x9.map((x, i) => [x, y9_curve[i]])];
            fillPolygon(pts9, 8);
            const x10 = linspace(three_minus_sqrt2_a, 2, 30);
            const y10_curve = x10.map(x => 3 - Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts10 = [[2,3], ...x10.map((x, i) => [x, y10_curve[i]])];
            fillPolygon(pts10, 9);
            const x11L = linspace(sqrt2_a, 1, 30);
            const y11L_c = x11L.map(x => 3 - Math.sqrt(Math.max(2 - x*x, 0)));
            const x11R = linspace(three_minus_sqrt2_a, 2, 30);
            const y11R_c = x11R.map(x => 3 - Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts11 = [...x11R.map((x, i) => [x, y11R_c[i]]), ...fliplr(x11L).map((x, i) => [x, fliplr(y11L_c)[i]])];
            fillPolygon(pts11, 10);
            const x12 = linspace(2, 3, 30);
            const y12_curve = x12.map(x => Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts12 = [[3,1], ...x12.map((x, i) => [x, y12_curve[i]])];
            fillPolygon(pts12, 11);
            const x13 = linspace(2, 3, 30);
            const y13_curve = x13.map(x => 3 - Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts13 = [[3,2], ...x13.map((x, i) => [x, y13_curve[i]])];
            fillPolygon(pts13, 12);
            const x14 = linspace(2, 3, 30);
            const y14_c3 = x14.map(x => Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const y14_c4 = x14.map(x => 3 - Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts14 = [...x14.map((x, i) => [x, y14_c4[i]]), ...fliplr(x14).map((x, i) => [x, fliplr(y14_c3)[i]])];
            fillPolygon(pts14, 13);
            const x15 = linspace(1, sqrt2_a, 30);
            const y15_curve = x15.map(x => Math.sqrt(Math.max(2 - x*x, 0)));
            const pts15 = [[1,0], ...x15.map((x, i) => [x, y15_curve[i]])];
            fillPolygon(pts15, 14);
            const x16 = linspace(three_minus_sqrt2_a, 2, 30);
            const y16_curve = x16.map(x => Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts16 = [[2,0], ...x16.map((x, i) => [x, y16_curve[i]])];
            fillPolygon(pts16, 15);
            const x17L = linspace(sqrt2_a, 1, 30);
            const y17L_c = x17L.map(x => Math.sqrt(Math.max(2 - x*x, 0)));
            const x17R = linspace(three_minus_sqrt2_a, 2, 30);
            const y17R_c = x17R.map(x => Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts17 = [...x17R.map((x, i) => [x, y17R_c[i]]), ...fliplr(x17L).map((x, i) => [x, fliplr(y17L_c)[i]])];
            fillPolygon(pts17, 16);
        }
    }

    // 双子八面体魔方视图渲染器
    class OctahedronViewRenderer extends BaseViewRenderer {
        constructor(containerId) {
            super(containerId);
            this.faceKeys = ['top1', 'top2', 'top3', 'top4', 'bottom1', 'bottom2', 'bottom3', 'bottom4'];
            this.pathCache = new Map();  // 缓存路径元素
            this.isInitialized = false;
        }

        render(model) {
            // 首次渲染时创建所有路径元素
            if (!this.isInitialized) {
                this.initializePaths();
                this.isInitialized = true;
            }

            // 只更新颜色
            this.faceKeys.forEach(faceKey => {
                const paths = this.pathCache.get(faceKey);
                if (!paths) return;

                const colors = model.faces[faceKey];
                paths.forEach((path, index) => {
                    const colorIndex = index < colors.length ? index : index % colors.length;
                    path.setAttribute('fill', this.colorToHex(colors[colorIndex]));
                });
            });
        }

        initializePaths() {
            this.faceKeys.forEach(faceKey => {
                const faceGroup = document.querySelector(`.face-group[data-face="${faceKey}"]`);
                if (!faceGroup) return;

                faceGroup.innerHTML = '';
                const paths = [];
                const colors = Array(7).fill(0);  // 创建临时颜色数组用于初始化

                // 创建路径并添加到 DOM
                this.createFaceGeometry(faceGroup, faceKey, colors, paths);
                this.pathCache.set(faceKey, paths);
            });
        }

        createFaceGeometry(faceGroup, faceKey, colors, paths = null) {
            const isTopFace = faceKey.startsWith('top');
            const scale = RENDER_CONFIG.SVG_SCALE_TWIN;
            const projectionFactor = RENDER_CONFIG.PROJECTION_FACTOR;
            const a = 1.5 * scale;
            const points3D = [
                [a, 0, 0], [0, a, 0], [0, 0, a],
                [7/9*a, 2/9*a, 0], [2/9*a, 7/9*a, 0],
                [0, 7/9*a, 2/9*a], [0, 2/9*a, 7/9*a],
                [2/9*a, 0, 7/9*a], [7/9*a, 0, 2/9*a],
                [5/9*a, 2/9*a, 2/9*a],
                [2/9*a, 5/9*a, 2/9*a],
                [2/9*a, 2/9*a, 5/9*a]
            ];
            const quads = [
                [0, 3, 9, 8], [3, 4, 10, 9], [1, 4, 10, 5],
                [5, 6, 11, 10], [2, 7, 11, 6], [7, 8, 9, 11]
            ];
            const tri = [9, 10, 11];
            const needsMirror = faceKey === 'top1' || faceKey === 'top3' || faceKey === 'bottom1' || faceKey === 'bottom3';

            let projectedPoints;
            if (isTopFace) {
                projectedPoints = points3D.map(p => {
                    let x = (p[0] - p[1]) * projectionFactor;
                    const y = (p[0] + p[1] - p[2] * 0.5) * projectionFactor;
                    if (needsMirror) x = -x;
                    return [x, y];
                });
            } else {
                projectedPoints = points3D.map(p => {
                    let x = (p[0] - p[1]) * projectionFactor;
                    const y = (-p[0] - p[1] + p[2] * 0.5) * projectionFactor;
                    if (needsMirror) x = -x;
                    return [x, y];
                });
            }

            const adjustedPoints = projectedPoints.map(p => [p[0] + 150, p[1] + 150]);
            let peripheralIndex = 0;

            quads.forEach((quad, index) => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const [a, b, c, d] = quad;
                const pathData = `M ${adjustedPoints[a][0]} ${adjustedPoints[a][1]} L ${adjustedPoints[b][0]} ${adjustedPoints[b][1]} L ${adjustedPoints[c][0]} ${adjustedPoints[c][1]} L ${adjustedPoints[d][0]} ${adjustedPoints[d][1]} Z`;
                path.setAttribute('d', pathData);
                path.setAttribute('class', 'face-piece');
                path.setAttribute('fill', this.colorToHex(colors[peripheralIndex] || 0));

                faceGroup.appendChild(path);  // 始终添加到 DOM
                if (paths) {
                    paths.push(path);  // 同时添加到缓存
                }
                peripheralIndex++;
            });

            const trianglePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const triangleData = `M ${adjustedPoints[tri[0]][0]} ${adjustedPoints[tri[0]][1]} L ${adjustedPoints[tri[1]][0]} ${adjustedPoints[tri[1]][1]} L ${adjustedPoints[tri[2]][0]} ${adjustedPoints[tri[2]][1]} Z`;
            trianglePath.setAttribute('d', triangleData);
            trianglePath.setAttribute('class', 'face-piece');
            trianglePath.setAttribute('fill', this.colorToHex(colors[6] || 0));

            faceGroup.appendChild(trianglePath);  // 始终添加到 DOM
            if (paths) {
                paths.push(trianglePath);  // 同时添加到缓存
            }
        }

        colorToHex(color) {
            return '#' + color.toString(16).padStart(6, '0');
        }
    }

    // 转角八面体魔方视图渲染器
    class CornerOctaViewRenderer extends BaseViewRenderer {
        constructor(containerId) {
            super(containerId);
            this.faceKeys = ['top1', 'top2', 'top3', 'top4', 'bottom1', 'bottom2', 'bottom3', 'bottom4'];
            this.pathCache = new Map();  // 缓存路径元素
            this.isInitialized = false;
        }

        render(model) {
            // 首次渲染时创建所有路径元素
            if (!this.isInitialized) {
                this.initializePaths();
                this.isInitialized = true;
            }

            // 只更新颜色
            this.faceKeys.forEach(faceKey => {
                const paths = this.pathCache.get(faceKey);
                if (!paths) return;

                const colors = model.faces[faceKey];
                paths.forEach((path, index) => {
                    const colorIndex = index < colors.length ? index : index % colors.length;
                    path.setAttribute('fill', this.colorToHex(colors[colorIndex]));
                });
            });
        }

        initializePaths() {
            this.faceKeys.forEach(faceKey => {
                const faceGroup = document.querySelector(`#cornerOcta-twod-container .face-group[data-face="${faceKey}"]`);
                if (!faceGroup) return;

                faceGroup.innerHTML = '';
                const paths = [];
                const colors = Array(9).fill(0);  // 创建临时颜色数组用于初始化

                // 创建路径并添加到 DOM
                this.createFaceGeometry(faceGroup, faceKey, colors, paths);
                this.pathCache.set(faceKey, paths);
            });
        }

        createFaceGeometry(faceGroup, faceKey, colors, paths = null) {
            const isTopFace = faceKey.startsWith('top');
            const scale = RENDER_CONFIG.SVG_SCALE_CORNER;
            const a = scale;
            const points = [
                [0, 0], [a, 0], [2*a, 0], [3*a, 0],
                [0.5*a, Math.sqrt(3)/2*a], [1.5*a, Math.sqrt(3)/2*a], [2.5*a, Math.sqrt(3)/2*a],
                [a, Math.sqrt(3)*a], [2*a, Math.sqrt(3)*a], [1.5*a, 3*Math.sqrt(3)/2*a]
            ];
            const triangles = [
                [0, 1, 4], [1, 2, 5], [2, 3, 6], [1, 4, 5],
                [2, 5, 6], [4, 5, 7], [5, 6, 8], [5, 7, 8], [7, 8, 9]
            ];

            let offsetX = 0, offsetY = 0;
            let needsFlip = false;

            switch(faceKey) {
                case 'top1': offsetX = 30; offsetY = 400; needsFlip = true; break;
                case 'top2': offsetX = 480; offsetY = 400; needsFlip = true; break;
                case 'top3': offsetX = 930; offsetY = 400; needsFlip = true; break;
                case 'top4': offsetX = 1380; offsetY = 400; needsFlip = true; break;
                case 'bottom1': offsetX = 30; offsetY = 400; needsFlip = false; break;
                case 'bottom2': offsetX = 480; offsetY = 400; needsFlip = false; break;
                case 'bottom3': offsetX = 930; offsetY = 400; needsFlip = false; break;
                case 'bottom4': offsetX = 1380; offsetY = 400; needsFlip = false; break;
            }
            
            let adjustedPoints = points.map(p => {
                let x = p[0], y = p[1];
                if (needsFlip) { y = -y; x = 3*a - x; }
                return [x + offsetX, y + offsetY];
            });
            
            triangles.forEach((triangle, index) => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const [p1, p2, p3] = triangle;
                const pathData = `M ${adjustedPoints[p1][0]} ${adjustedPoints[p1][1]} L ${adjustedPoints[p2][0]} ${adjustedPoints[p2][1]} L ${adjustedPoints[p3][0]} ${adjustedPoints[p3][1]} Z`;
                path.setAttribute('d', pathData);
                path.setAttribute('class', 'face-piece');
                const colorIndex = index < colors.length ? index : index % colors.length;
                path.setAttribute('fill', this.colorToHex(colors[colorIndex] || 0));

                faceGroup.appendChild(path);  // 始终添加到 DOM
                if (paths) {
                    paths.push(path);  // 同时添加到缓存
                }
            });
        }

        colorToHex(color) {
            return '#' + color.toString(16).padStart(6, '0');
        }
    }

    // ===== 全局魔方类型注册器实例 =====
    const cubeRegistry = new CubeTypeRegistry();

    // 注册转角三阶魔方
    cubeRegistry.register('corner', {
        name: '转角三阶魔方',
        model: CornerCube3x3,
        scrambleGenerator: CornerScrambleGenerator,
        viewRenderer: CornerViewRenderer,
        controlPanelId: 'corner-controls',
        viewId: 'corner-view'
    });

    // 注册双子八面体魔方
    cubeRegistry.register('octahedron', {
        name: '双子八面体魔方',
        model: OctahedronCube,
        scrambleGenerator: OctahedronScrambleGenerator,
        viewRenderer: OctahedronViewRenderer,
        controlPanelId: 'octahedron-controls',
        viewId: 'octahedron-view'
    });

    // 注册转角八面体魔方
    cubeRegistry.register('cornerOcta', {
        name: '转角八面体魔方',
        model: CornerOctaCube,
        scrambleGenerator: CornerOctaScrambleGenerator,
        viewRenderer: CornerOctaViewRenderer,
        controlPanelId: 'cornerOcta-controls',
        viewId: 'cornerOcta-view'
    });

    // 二阶转面八面体魔方视图渲染器
    class TwinOctahedronViewRenderer extends BaseViewRenderer {
        constructor(containerId) {
            super(containerId);
            this.faceKeys = ['top1', 'top2', 'top3', 'top4', 'bottom1', 'bottom2', 'bottom3', 'bottom4'];
            this.pathCache = new Map();  // 缓存路径元素
            this.isInitialized = false;
        }

        render(model) {
            // 首次渲染时创建所有路径元素
            if (!this.isInitialized) {
                this.initializePaths();
                this.isInitialized = true;
            }

            // 只更新颜色
            this.faceKeys.forEach(faceKey => {
                const paths = this.pathCache.get(faceKey);
                if (!paths) return;

                const colors = model.faces[faceKey];
                paths.forEach((path, index) => {
                    const colorIndex = index < colors.length ? index : index % colors.length;
                    path.setAttribute('fill', this.colorToHex(colors[colorIndex]));
                });
            });
        }

        initializePaths() {
            this.faceKeys.forEach(faceKey => {
                const faceGroup = document.querySelector(`#twinOctahedron-twod-container .face-group[data-face="${faceKey}"]`);
                if (!faceGroup) return;

                faceGroup.innerHTML = '';
                const paths = [];
                const colors = Array(4).fill(0);  // 创建临时颜色数组用于初始化

                // 创建路径并添加到 DOM
                this.createFaceGeometry(faceGroup, faceKey, colors, paths);
                this.pathCache.set(faceKey, paths);
            });
        }
        
        createFaceGeometry(faceGroup, faceKey, colors, paths = null) {
            const isTopFace = faceKey.startsWith('top');
            const scale = RENDER_CONFIG.SVG_SCALE_TWIN_OCTA;

            // 定义新的10个点的几何结构
            const a = scale;
            // 大三角形顶点：边长为2a，高度为√3*a
            const points = [
                [0, 0],                          // 点 1 (索引0) - 左下角
                [2*a, 0],                        // 点 2 (索引1) - 右下角
                [a, Math.sqrt(3)*a],             // 点 3 (索引2) - 顶点
                [a, 0],                          // 点 4 (索引3) - 底边中点
                [a/2, Math.sqrt(3)/2*a],         // 点 5 (索引4) - 左边中点
                [3*a/2, Math.sqrt(3)/2*a]        // 点 6 (索引5) - 右边中点
            ];

            // 定义4个等边三角形（边长均为a）
            const triangles = [
                [0, 3, 4],  // 三角形1: 左下区域
                [1, 5, 3],  // 三角形2: 右下区域
                [2, 4, 5],  // 三角形3: 顶部区域
                [3, 5, 4]   // 三角形4: 中间区域
            ];

            // 根据面的类型确定位置和方向
            let offsetX = 0, offsetY = 0;
            let needsFlip = false;

            // 根据不同的面设置位置和方向
            switch(faceKey) {
                case 'top2': // 橙色，上面第一个，底朝下
                    offsetX = 80;
                    offsetY = 300;
                    needsFlip = true; // 红白橙黄四个面上下镜像对称
                    break;
                case 'top3': // 上面第二个，底朝下
                    offsetX = 335;
                    offsetY = 300;
                    needsFlip = true;
                    break;
                case 'top4': // 白色，上面第三个，底朝下
                    offsetX = 590;
                    offsetY = 300;
                    needsFlip = true; // 红白橙黄四个面上下镜像对称
                    break;
                case 'top1': // 上面第四个，底朝下
                    offsetX = 845;
                    offsetY = 300;
                    needsFlip = true;
                    break;
                case 'bottom2': // 黄色，下面第一个，底朝上
                    offsetX = 80;
                    offsetY = 300;
                    needsFlip = false; // 红白橙黄四个面上下镜像对称
                    break;
                case 'bottom3': // 下面第二个，底朝上
                    offsetX = 335;
                    offsetY = 300;
                    break;
                case 'bottom4': // 红色，下面第三个，底朝上
                    offsetX = 590;
                    offsetY = 300;
                    needsFlip = false; // 红白橙黄四个面上下镜像对称
                    break;
                case 'bottom1': // 下面第四个，底朝上
                    offsetX = 845;
                    offsetY = 300;
                    break;
            }

            // 调整点位置
            let adjustedPoints = points.map(p => {
                let x = p[0];
                let y = p[1];
                
                // 如果需要翻转（底朝上的面）
                if (needsFlip) {
                    // 垂直翻转
                    y = -y;
                    // 水平翻转以保持正确的方向
                    x = 2*a - x;
                }
                
                // 应用偏移
                return [x + offsetX, y + offsetY];
            });
            
                        // 绘制4个三角形
            
            
            
                        triangles.forEach((triangle, index) => {
            
            
            
                            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            
            
                            const [p1, p2, p3] = triangle;
            
            
            
            
            
            
            
                            const pathData = `M ${adjustedPoints[p1][0]} ${adjustedPoints[p1][1]} 
            
            
            
                                             L ${adjustedPoints[p2][0]} ${adjustedPoints[p2][1]} 
            
            
            
                                             L ${adjustedPoints[p3][0]} ${adjustedPoints[p3][1]} Z`;
            
            
            
            
            
            
            
                            path.setAttribute('d', pathData);
            
            
            
                            path.setAttribute('class', 'face-piece');
            
            
            
                            // 使用对应的颜色，如果颜色数量不足则循环使用
            
            
            
                            const colorIndex = index < colors.length ? index : index % colors.length;
            
            
            
                            path.setAttribute('fill', this.colorToHex(colors[colorIndex] || 0));
            
            
            
            
            
            
            
                            faceGroup.appendChild(path);  // 始终添加到 DOM
            
            
            
                            if (paths) {
            
            
            
                                paths.push(path);  // 同时添加到缓存
            
            
            
                            }
            
            
            
                        });
            
                    }
        
        colorToHex(color) {
            // 将Three.js颜色转换为十六进制
            return '#' + color.toString(16).padStart(6, '0');
        }
    }

    // 注册二阶转面八面体魔方
    cubeRegistry.register('twinOctahedron', {
        name: '二阶转面八面体魔方',
        model: TwinOctahedronCube,
        scrambleGenerator: TwinOctahedronScrambleGenerator,
        viewRenderer: TwinOctahedronViewRenderer,
        controlPanelId: 'twinOctahedron-controls',
        viewId: 'twin-octahedron-view'
    });

    // ============================================================
    // 如何添加新的魔方类型
    // ============================================================
    // 
    // 要添加新的魔方类型，只需按照以下步骤：
    //
    // 1. 创建魔方模型类（继承 BaseCubeModel）
    //    class NewCubeModel extends BaseCubeModel {
    //        constructor() {
    //            super();
    //            this.initializeCube();
    //        }
    //        
    //        initializeCube() {
    //            // 初始化魔方状态
    //        }
    //        
    //        rotate(move) {
    //            // 实现旋转逻辑
    //        }
    //    }
    //
    // 2. 创建打乱生成器类（继承 BaseScrambleGenerator）
    //    class NewCubeScrambleGenerator extends BaseScrambleGenerator {
    //        constructor() {
    //            super();
    //            this.config = { /* 打乱配置 */ };
    //        }
    //        
    //        generate() {
    //            // 生成打乱公式并返回
    //            return scramble;
    //        }
    //        
    //        // 可选：提供文本格式化方法
    //        getScrambleText(scramble) {
    //            // 返回可读的打乱文本
    //        }
    //    }
    //    class NewCubeViewRenderer extends BaseViewRenderer {
    //        constructor(containerId) {
    //            super(containerId);
    //        }
    //        
    //        render(model) {
    //            // 渲染魔方视图
    //        }
    //    }
    //
    // 4. 在HTML中添加对应的控制面板和视图容器
    //    <div id="newcube-controls" class="controls-panel">
    //        <!-- 控制选项 -->
    //    </div>
    //    <div id="newcube-view" class="cube-view">
    //        <!-- 视图容器 -->
    //    </div>
    //
    // 5. 在下拉菜单中添加选项
    //    <select class="control-select" id="cubeTypeSelect">
    //        <option value="newcube">新魔方</option>
    //        <!-- 其他选项 -->
    //    </select>
    //
    // 6. 注册魔方类型
    //    cubeRegistry.register('newcube', {
    //        name: '新魔方',
    //        model: NewCubeModel,
    //        scrambleGenerator: NewCubeScrambleGenerator,
    //        viewRenderer: NewCubeViewRenderer,
    //        controlPanelId: 'newcube-controls',
    //        viewId: 'newcube-view'
    //    });
    //
    // 完成！新魔方类型会自动集成到应用的所有功能中：
    // - 打乱生成
    // - 视图渲染
    // - 计时功能
    // - 统计记录
    // - 导出功能
    //
    // ============================================================

    // ===== 魔方计时器应用主控制器 =====
    class CubeTimerApp {
        constructor() {
            this.state = {
                theme: 'dark',
                currentCubeType: 'corner',
                isRotating: false,
                currentScramble: '',
                scrambleCounter: 1,
                timerState: 'ready',
                startTime: null,
                inspectionStartTime: null,
                lastUpdateTime: null,
                inspectionTime: 15,
                inspectionCountdownTimer: null,
                escTimer: null,
                animationFrame: null,
                showScramblesList: false,
                scrambleHistory: [],
                currentHistoryIndex: -1,
                soundEnabled: true,
                // 统一的时间记录结构（按魔方类型分组）
                times: {
                    corner: [],
                    octahedron: [],
                    cornerOcta: [],
                    twinOctahedron: []
                },
                // 统一的打乱计数器结构（按魔方类型分组）
                counters: {
                    corner: 1,
                    octahedron: 1,
                    cornerOcta: 1,
                    twinOctahedron: 1
                },
                // 统一的生成打乱公式结构（按魔方类型分组）
                generatedScrambles: {
                    corner: [],
                    octahedron: [],
                    cornerOcta: [],
                    twinOctahedron: []
                }
            };
            
            // 使用注册器创建魔方实例
            this.cubeInstances = new Map();
            this.scrambleGenerators = new Map();
            this.viewRenderers = new Map();
            
            // 初始化所有注册的魔方类型
            cubeRegistry.getAllTypes().forEach(type => {
                const config = cubeRegistry.getConfig(type);
                this.cubeInstances.set(type, new config.model());
                this.scrambleGenerators.set(type, new config.scrambleGenerator());
                this.viewRenderers.set(type, new config.viewRenderer(config.viewId));
            });
            
            this.elements = {};
            
            // 初始化音频上下文
            this.initAudioContext();
            
            // 创建防抖渲染函数（50ms 内的多次调用只执行一次）
            this.debouncedRender = this.debounce(() => {
                this.doRender();
            }, 50);
            
            this.init();
        }
        
        /**
 * 防抖函数：将多次快速调用合并为一次执行
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
        
        init() {
            this.setupDOM();
            this.setupEventListeners();
            this.restoreTheme();
            this.restoreSoundSettings();
            this.restoreTimeRecords();
            // 使用恢复的魔方类型，如果没有恢复到则使用默认的'corner'
            const cubeType = this.state.currentCubeType || 'corner';
            this.switchToCubeType(cubeType);
            
            // 初始化打乱历史并生成第一个打乱
            this.state.scrambleHistory = [];
            this.state.currentHistoryIndex = -1;
            // 确保当前魔方类型的计数器已初始化
            const currentType = this.state.currentCubeType;
            if (!this.state.counters[currentType]) {
                this.state.counters[currentType] = 1;
            }
            this.state.scrambleCounter = this.state.counters[currentType] || 1;
            this.generateNewScramble();
            
            this.updateCubeView();
            this.updateTimesList();
            this.updateStats();
            
            // 确保计时器状态正确初始化
            this.state.timerState = 'ready';
            this.elements.timerDisplay.innerHTML = '0.000';
            if (this.elements.timerState) {
                this.elements.timerState.textContent = t('ready');
            }
        }
        
        setupDOM() {
            const getEl = (id, optional = false) => {
                const el = document.getElementById(id);
                if (!el && !optional) console.error(`Element not found: ${id}`);
                return el;
            };

            const getAll = (selector) => document.querySelectorAll(selector);

            // 魔方选择相关元素
            this.elements.cubeTypeSelect = getEl('cubeTypeSelect');

            // 转角三阶魔方视图和控制面板元素
            this.elements.cornerView = getEl('face-container-3x3');
            this.elements.cornerControls = getEl('corner-scramble-controls');
            this.elements.cycleSelect = getEl('cycleSelect');
            this.elements.zeroProbSelect = getEl('zeroProbSelect');

            // 双子八面体魔方视图和控制面板元素
            this.elements.octahedronView = getEl('face-container-octa-twin');
            this.elements.octahedronControls = getEl('octahedron-scramble-controls');

            // 转角八面体魔方视图和控制面板元素
            this.elements.cornerOctaView = getEl('face-container-octa-corner');
            this.elements.cornerOctaControls = getEl('cornerOcta-scramble-controls');

            // 二阶转面八面体魔方视图和控制面板元素
            this.elements.twinOctahedronView = getEl('face-container-twin-octahedron');
            this.elements.twinOctahedronControls = getEl('twinOctahedron-scramble-controls');

            // 通用元素
            this.elements.scrambleContent = getEl('scrambleContent');
            this.elements.scrambleNumber = getEl('scrambleNumber');
            this.elements.prevScrambleBtn = getEl('prevScrambleBtn');
            this.elements.nextScrambleBtn = getEl('nextScrambleBtn');
            this.elements.copyBtn = getEl('copyBtn');
            this.elements.coordinateBtn = getEl('coordinateBtn');

            // 主题切换按钮
            this.elements.themeToggleBtn = getEl('settingsBtn');

            // 计时器元素
            this.elements.timerDisplay = getEl('timerDisplay');
            this.elements.timerState = getEl('timerState', true); // 可选元素
            this.elements.inspectionTime = getEl('inspectionTime', true); // 可选元素
            this.elements.timerStartBtn = getEl('timerStartBtn');
            this.elements.timerResetBtn = getEl('timerResetBtn', true); // 可选元素
            this.elements.fullscreenTimer = getEl('fullscreenTimer');
            this.elements.fullscreenDisplay = getEl('fullscreenDisplay');
            this.elements.fullscreenInfo = getEl('fullscreenInfo');
            this.elements.fullscreenHint = getEl('fullscreenHint');
            this.elements.escHint = getEl('escHint');
            this.elements.fullscreenExitBtn = getEl('fullscreenExitBtn');

            // 统计和时间记录元素
            this.elements.currentTime = getEl('currentTime', true); // 可选元素
            this.elements.currentAo5 = getEl('currentAo5');
            this.elements.currentAo12 = getEl('currentAo12');
            this.elements.currentAo50 = getEl('currentAo50');
            this.elements.currentAo100 = getEl('currentAo100');
            this.elements.bestTime = getEl('bestTime', true); // 可选元素
            this.elements.bestAo5 = getEl('bestAo5');
            this.elements.bestAo12 = getEl('bestAo12');
            this.elements.bestAo50 = getEl('bestAo50');
            this.elements.bestAo100 = getEl('bestAo100');
            this.elements.timesList = getEl('timesList', true); // 可选元素
            this.elements.exportBestAo5Btn = getEl('exportBestAo5Btn');
            this.elements.exportBestAo12Btn = getEl('exportBestAo12Btn', true); // 可选元素
            this.elements.exportBestAo50Btn = getEl('exportBestAo50Btn', true); // 可选元素
            this.elements.exportBestAo100Btn = getEl('exportBestAo100Btn', true); // 可选元素
            this.elements.clearTimesBtn = getEl('clearTimesBtn', true); // 可选元素
            this.elements.historyResetBtn = getEl('historyResetBtn');
            this.elements.historyTimesList = getEl('historyTimesList');
            this.elements.historySummary = getEl('historySummary');

            // 导出功能元素
            this.elements.generateCount = getEl('generateCount');
            this.elements.startNumber = getEl('startNumber');
            this.elements.exportScramblesBtn = getEl('exportScramblesBtn');
            this.elements.scramblesList = getEl('scramblesList', true); // 可选元素

            // 打乱控制选项元素
            this.elements.cycleSelect = getEl('cycleSelect');
            this.elements.zeroProbSelect = getEl('zeroProbSelect');
            this.elements.cornerOctaScrambleType = getEl('cornerOctaScrambleType');

            // 主题控制元素
            this.elements.themeBtns = getAll('.theme-btn');

            // 声音控制元素
            this.elements.soundBtn = getEl('soundBtn', true); // 可选元素
            this.elements.beepAudio = getEl('beepAudio');

            // 移动端成绩统计按钮
            this.elements.statsFloatBtn = getEl('statsFloatBtn', true);
            this.elements.statsCloseBtn = getEl('statsCloseBtn', true);
            this.elements.statsContainerMobile = getEl('stats-container-mobile', true);
        }
        
        setupEventListeners() {
            // 魔方类型选择事件
            this.elements.cubeTypeSelect.addEventListener('change', () => {
                const cubeType = this.elements.cubeTypeSelect.value;
                this.switchToCubeType(cubeType);
            });
            
            // 主题切换事件
            if (this.elements.themeToggleBtn) {
                this.elements.themeToggleBtn.addEventListener('click', () => {
                    // 打开设置模态框
                    const settingsModal = document.getElementById('settingsModal');
                    if (settingsModal) {
                        settingsModal.classList.add('active');
                    }
                });
            }
            
            // 声音开关事件
            if (this.elements.soundBtn) {
                this.elements.soundBtn.addEventListener('click', () => {
                    this.toggleSound();
                });
            }
            
            // 打乱公式相关事件
            this.elements.prevScrambleBtn.addEventListener('click', () => this.previousScramble());
            this.elements.nextScrambleBtn.addEventListener('click', () => this.nextScramble());
            this.elements.copyBtn.addEventListener('click', () => this.copyScramble());
            if (this.elements.coordinateBtn) {
                this.elements.coordinateBtn.addEventListener('click', () => this.showCoordinateModal());
            }

            // 打乱控制选项事件
            if (this.elements.cornerOctaScrambleType) {
                this.elements.cornerOctaScrambleType.addEventListener('change', () => this.updateScrambleGeneratorConfig());
            }

            // 计时器相关事件
            if (this.elements.timerStartBtn) {
                this.elements.timerStartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Timer start button clicked');
                    this.toggleTimer();
                });
            }
            
            if (this.elements.timerResetBtn) {
                this.elements.timerResetBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Timer reset button clicked');
                    this.resetTimer();
                });
            }
            
            // 添加触摸覆盖层的事件监听
            const timerTouchOverlay = document.getElementById('timerTouchOverlay');
            if (timerTouchOverlay) {
                timerTouchOverlay.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Timer touch overlay clicked');
                    this.toggleTimer();
                });

                // 添加触摸事件支持
                timerTouchOverlay.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    console.log('Timer touch overlay touch started');
                    this.toggleTimer();
                });
            }

            // 打乱显示区域不再作为计时触发区
            // 计时功能仅通过长按计时区（timer-display）或按住空格键实现

            // 添加计时显示区域的点击事件（用于移动端点击开始/停止计时）
            const timerDisplaySection = document.querySelector('.timer-display');
            if (timerDisplaySection) {
                // 添加鼠标事件监听器以实现按下变红、超过0.5秒变绿、松开变黑并开始计时的功能
                const timerDisplay = document.getElementById('timerDisplay');
                if (timerDisplay) {
                    let pressTimer = null;
                    let pressStartTime = 0;
                    let isLongPress = false;
                    
                                    timerDisplaySection.addEventListener('mousedown', (e) => {
                                        e.preventDefault();
                                        // 在running状态下点击也应能停止计时，所以不限制状态
                                        if (this.state.timerState !== 'ready' && this.state.timerState !== 'running') return;
                                        
                                        // 如果是running状态，直接停止计时
                                        if (this.state.timerState === 'running') {
                                            this.stopTimer();
                                            // 重置当前作用域的长按状态变量
                                            isLongPress = false;
                                            return;
                                        }
                                        
                                        if (this.state.timerState !== 'ready') return; // 只在ready状态下进行长按逻辑
                                        
                                        // 清除之前的计时器
                                        clearTimeout(pressTimer);
                                        
                                        // 变红
                                        timerDisplay.classList.add('timer-pressed');
                                        timerDisplay.classList.remove('timer-held-long');
                                        
                                        pressStartTime = Date.now();
                                        isLongPress = false;
                                        
                                        // 检查是否按住超过0.5秒
                                        pressTimer = setTimeout(() => {
                                            if (this.state.timerState === 'ready') {
                                                // 变绿（表示可以开始计时）
                                                timerDisplay.classList.remove('timer-pressed');
                                                timerDisplay.classList.add('timer-held-long');
                                                isLongPress = true;
                                            }
                                        }, 500);
                                    });                    
                                    timerDisplaySection.addEventListener('mouseup', (e) => {
                                        e.preventDefault();
                                        clearTimeout(pressTimer);
                                        
                                        // 如果当前状态不是ready，说明可能已经通过click事件处理了停止计时
                                        // 这时不需要再执行计时逻辑
                                        if (this.state.timerState !== 'ready') {
                                            // 立即变黑
                                            timerDisplay.classList.remove('timer-pressed');
                                            timerDisplay.classList.remove('timer-held-long');
                                            return;
                                        }
                                        
                                        // 计算按住时间
                                        const pressDuration = Date.now() - pressStartTime;
                                        
                                        // 立即变黑
                                        timerDisplay.classList.remove('timer-pressed');
                                        timerDisplay.classList.remove('timer-held-long');
                                        
                                        // 如果按住时间超过0.5秒，则直接开始计时
                                        if (isLongPress && this.state.timerState === 'ready') {
                                            this.startTimer(); // 直接开始计时
                                        }
                                        // 如果按住时间不足0.5秒，则不执行任何操作，保持黑色状态
                                    });                    
                    timerDisplaySection.addEventListener('mouseleave', (e) => {
                        // 鼠标离开时，视为松开
                        clearTimeout(pressTimer);
                        
                        // 立即变黑
                        timerDisplay.classList.remove('timer-pressed');
                        timerDisplay.classList.remove('timer-held-long');
                        
                        // 如果按住时间不足0.5秒，则不执行任何操作，保持黑色状态
                        const pressDuration = Date.now() - pressStartTime;
                        if (pressDuration < 500 && !isLongPress && this.state.timerState === 'ready') {
                            // 不执行任何操作，保持黑色状态
                        }
                    });
                }

                timerDisplaySection.addEventListener('click', (e) => {
                    e.preventDefault();
                });

                // 触摸事件支持
                timerDisplaySection.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    // 在running状态下触摸也应能停止计时，所以不限制状态
                    if (this.state.timerState !== 'ready' && this.state.timerState !== 'running') return;
                    
                    const timerDisplay = document.getElementById('timerDisplay');
                    if (!timerDisplay) return;
                    
                    // 如果是running状态，直接停止计时
                    if (this.state.timerState === 'running') {
                        this.stopTimer();
                        // 重置当前作用域的长按状态变量
                        this.isLongPress = false;
                        return;
                    }
                    
                    if (this.state.timerState !== 'ready') return; // 只在ready状态下进行长按逻辑
                    
                    // 清除之前的计时器
                    clearTimeout(this.pressTimer);
                    
                    // 变红
                    timerDisplay.classList.add('timer-pressed');
                    timerDisplay.classList.remove('timer-held-long');
                    
                    this.pressStartTime = Date.now();
                    this.isLongPress = false;
                    
                    // 检查是否按住超过0.5秒
                    this.pressTimer = setTimeout(() => {
                        if (this.state.timerState === 'ready') {
                            // 变绿（表示可以开始计时）
                            timerDisplay.classList.remove('timer-pressed');
                            timerDisplay.classList.add('timer-held-long');
                            this.isLongPress = true;
                        }
                    }, 500);
                });
                
                timerDisplaySection.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    clearTimeout(this.pressTimer);
                    
                    const timerDisplay = document.getElementById('timerDisplay');
                    if (!timerDisplay) return;
                    
                    // 如果当前状态不是ready，说明可能已经通过touchstart事件处理了停止计时
                    // 这时不需要再执行计时逻辑
                    if (this.state.timerState !== 'ready') {
                        // 立即变黑
                        timerDisplay.classList.remove('timer-pressed');
                        timerDisplay.classList.remove('timer-held-long');
                        return;
                    }
                    
                    // 计算按住时间
                    const pressDuration = Date.now() - this.pressStartTime;
                    
                    // 立即变黑
                    timerDisplay.classList.remove('timer-pressed');
                    timerDisplay.classList.remove('timer-held-long');
                    
                    // 如果按住时间超过0.5秒，则直接开始计时
                    if (this.isLongPress && this.state.timerState === 'ready') {
                        this.startTimer(); // 直接开始计时
                    }
                    // 如果按住时间不足0.5秒，则不执行任何操作，保持黑色状态
                });
                
                timerDisplaySection.addEventListener('touchcancel', (e) => {
                    // 触摸取消时，视为松开
                    clearTimeout(this.pressTimer);
                    
                    const timerDisplay = document.getElementById('timerDisplay');
                    if (timerDisplay) {
                        // 立即变黑
                        timerDisplay.classList.remove('timer-pressed');
                        timerDisplay.classList.remove('timer-held-long');
                    }
                    
                    // 如果按住时间不足0.5秒，则不执行任何操作，保持黑色状态
                    const pressDuration = Date.now() - this.pressStartTime;
                    if (pressDuration < 500 && !this.isLongPress && this.state.timerState === 'ready') {
                        // 不执行任何操作，保持黑色状态
                    }
                });
            }

            // 添加魔方2D模型展示区域的点击事件（仅用于在running状态下停止计时）
            const cube2dViewAdditional = document.querySelector('.cube-2d-view');
            if (cube2dViewAdditional) {
                // 只在running状态下允许点击停止计时
                cube2dViewAdditional.addEventListener('click', (e) => {
                    e.preventDefault();
                    // 如果计时器正在运行，点击魔方区域可以停止计时
                    if (this.state.timerState === 'running') {
                        this.stopTimer();
                    }
                    // 在其他状态下（如ready），不执行任何操作，避免误触发计时
                });

                cube2dViewAdditional.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    // 如果计时器正在运行，触摸魔方区域可以停止计时
                    if (this.state.timerState === 'running') {
                        this.stopTimer();
                    }
                    // 在其他状态下（如ready），不执行任何操作，避免误触发计时
                });
            }

            // 时间记录相关事件
            if (this.elements.exportBestAo5Btn) {
                this.elements.exportBestAo5Btn.addEventListener('click', () => this.exportAllResults());
            }
            if (this.elements.exportBestAo12Btn) {
                this.elements.exportBestAo12Btn.addEventListener('click', () => this.exportBestAo(12));
            }
            if (this.elements.exportBestAo50Btn) {
                this.elements.exportBestAo50Btn.addEventListener('click', () => this.exportBestAo(50));
            }
            if (this.elements.exportBestAo100Btn) {
                this.elements.exportBestAo100Btn.addEventListener('click', () => this.exportBestAo(100));
            }
            if (this.elements.clearTimesBtn) {
                this.elements.clearTimesBtn.addEventListener('click', () => this.clearTimes());
            }
            if (this.elements.historyResetBtn) {
                this.elements.historyResetBtn.addEventListener('click', () => this.clearAllData());
            }
            
            // 生成打乱公式相关事件
            // this.elements.generateMultipleBtn.addEventListener('click', () => this.generateMultipleScrambles()); // 不再需要
            if (this.elements.exportScramblesBtn) {
                this.elements.exportScramblesBtn.addEventListener('click', () => this.exportScrambles());
            }
            
            // 键盘事件监听 - 使用capture阶段确保事件优先处理
            document.addEventListener('keydown', (e) => {
                console.log('Keydown event:', e.code, 'Target:', e.target.tagName, 'State:', this.state.timerState);
                
                if (e.code === 'Space') {
                    // 阻止事件冒泡和默认行为
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 如果在running状态，按空格键停止计时
                    if (this.state.timerState === 'running') {
                        this.stopTimer();
                        return;
                    }
                    
                    // 检查当前状态是否允许操作
                    if (this.state.timerState !== 'ready') return; // 只在ready状态下响应长按逻辑
                    
                    // 防止重复keydown事件重复设置定时器
                    // 仅在第一次keydown时设置样式和定时器
                    if (!this.spaceKeyPressed) {
                        this.spaceKeyPressed = true; // 标记空格键已按下
                        
                        // 清除之前的计时器
                        clearTimeout(this.spacePressTimer);
                        
                        // 获取适当的显示元素
                        const displayElement = this.elements.fullscreenTimer.classList.contains('active') 
                            ? this.elements.fullscreenDisplay 
                            : this.elements.timerDisplay;
                        
                        if (displayElement) {
                            // 变红
                            displayElement.classList.add('timer-pressed');
                            displayElement.classList.remove('timer-held-long');
                        }
                        
                        this.spacePressStartTime = Date.now();
                        this.spaceIsLongPress = false;
                        
                        // 添加日志用于调试
                        console.log('空格键按下，变红');
                        
                        // 检查是否按住超过0.5秒
                        this.spacePressTimer = setTimeout(() => {
                            if (this.state.timerState === 'ready') {
                                // 变绿（表示可以开始计时）
                                // 在执行时重新获取当前应该应用样式的元素，以防在等待期间状态发生变化
                                const displayElement = this.elements.fullscreenTimer.classList.contains('active') 
                                    ? this.elements.fullscreenDisplay 
                                    : this.elements.timerDisplay;
                                if (displayElement) {
                                    displayElement.classList.remove('timer-pressed');
                                    displayElement.classList.add('timer-held-long');
                                }
                                this.spaceIsLongPress = true;
                                
                                // 添加日志用于调试
                                console.log('空格键长按0.5秒，变绿');
                            } else {
                                console.log('空格键长按0.5秒：状态已改变，不再为ready，不执行变绿');
                            }
                        }, 500);
                    }
                } else if (e.code === 'Escape' && this.elements.fullscreenTimer.classList.contains('active')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.exitFullscreen();
                }
            }, { capture: true }); // 使用capture阶段
            
                        // 监听空格键释放事件
                        document.addEventListener('keyup', (e) => {
                            if (e.code === 'Space') {
                                // 阻止事件冒泡和默认行为
                                e.preventDefault();
                                e.stopPropagation();
                                
                                // 重置按键状态标记
                                this.spaceKeyPressed = false;
                                
                                // 检查当前状态，如果在释放时已经是running状态，说明是长按后开始计时了
                                // 这种情况下不需要执行释放后的逻辑
                                if (this.state.timerState === 'running') {
                                    // 在这种情况下，我们已经在长按0.5秒后开始计时了，释放事件不需要额外操作
                                    console.log('空格键释放：已在计时状态，无需额外操作');
                                    return;
                                }
                                
                                clearTimeout(this.spacePressTimer);
            
                                // 获取适当的显示元素
                                const displayElement = this.elements.fullscreenTimer.classList.contains('active') 
                                    ? this.elements.fullscreenDisplay 
                                    : this.elements.timerDisplay;
                                
                                if (displayElement) {
                                    // 立即变黑
                                    displayElement.classList.remove('timer-pressed');
                                    displayElement.classList.remove('timer-held-long');
                                }
                                
                                // 计算按住时间
                                const pressDuration = Date.now() - this.spacePressStartTime;
                                console.log('空格键释放：按住时间', pressDuration, 'ms, spaceIsLongPress:', this.spaceIsLongPress, '状态:', this.state.timerState);
                                
                                // 如果按住时间超过0.5秒，则直接开始计时
                                if (this.spaceIsLongPress && this.state.timerState === 'ready') {
                                    console.log('空格键释放：执行开始计时');
                                    this.startTimer(); // 直接开始计时
                                }
                                // 如果按住时间不足0.5秒，则不执行任何操作，保持黑色状态
                            }
                        }, { capture: true });
            // 窗口大小改变时调整布局
            window.addEventListener('resize', () => {
                this.adjustScrambleSectionHeight();
            });
            
            // 全屏计时器点击事件
            if (this.elements.fullscreenTimer) {
                // 添加鼠标事件监听器以实现按下变红、超过0.5秒变绿、松开变黑并开始计时的功能
                let pressTimer = null;
                let pressStartTime = 0;
                let isLongPress = false;
                
                this.elements.fullscreenTimer.addEventListener('mousedown', (e) => {
                    // 防止点击退出按钮时触发计时器切换
                    if (e.target.closest('.fullscreen-exit-btn')) {
                        return;
                    }
                    e.preventDefault();
                    console.log('Fullscreen timer clicked, state:', this.state.timerState);
                    
                    // 在running状态下点击也应能停止计时，所以不限制状态
                    if (this.state.timerState !== 'ready' && this.state.timerState !== 'running') return;
                    
                    // 如果是running状态，直接停止计时
                    if (this.state.timerState === 'running') {
                        this.stopTimer();
                        // 重置当前作用域的长按状态变量
                        isLongPress = false;
                        return;
                    }
                    
                    if (this.state.timerState !== 'ready') return; // 只在ready状态下进行长按逻辑
                    
                    // 清除之前的计时器
                    clearTimeout(pressTimer);
                    
                    // 变红
                    this.elements.fullscreenDisplay.classList.add('timer-pressed');
                    this.elements.fullscreenDisplay.classList.remove('timer-held-long');
                    
                    pressStartTime = Date.now();
                    isLongPress = false;
                    
                    // 检查是否按住超过0.5秒
                    pressTimer = setTimeout(() => {
                        if (this.state.timerState === 'ready') {
                            // 变绿（表示可以开始计时）
                            this.elements.fullscreenDisplay.classList.remove('timer-pressed');
                            this.elements.fullscreenDisplay.classList.add('timer-held-long');
                            isLongPress = true;
                        }
                    }, 500);
                });
                
                this.elements.fullscreenTimer.addEventListener('mouseup', (e) => {
                    // 防止点击退出按钮时触发计时器切换
                    if (e.target.closest('.fullscreen-exit-btn')) {
                        return;
                    }
                    e.preventDefault();
                    clearTimeout(pressTimer);
                    
                    // 如果当前状态不是ready，说明可能已经通过click事件处理了停止计时
                    // 这时不需要再执行计时逻辑
                    if (this.state.timerState !== 'ready') {
                        // 立即变黑
                        this.elements.fullscreenDisplay.classList.remove('timer-pressed');
                        this.elements.fullscreenDisplay.classList.remove('timer-held-long');
                        return;
                    }
                    
                    // 计算按住时间
                    const pressDuration = Date.now() - pressStartTime;
                    
                    // 立即变黑
                    this.elements.fullscreenDisplay.classList.remove('timer-pressed');
                    this.elements.fullscreenDisplay.classList.remove('timer-held-long');
                    
                    // 如果按住时间超过0.5秒，则直接开始计时
                    if (isLongPress && this.state.timerState === 'ready') {
                        this.startTimer(); // 直接开始计时
                    }
                    // 如果按住时间不足0.5秒，则不执行任何操作，保持黑色状态
                });
                
                this.elements.fullscreenTimer.addEventListener('mouseleave', (e) => {
                    // 防止点击退出按钮时触发计时器切换
                    if (e.target.closest('.fullscreen-exit-btn')) {
                        return;
                    }
                    // 鼠标离开时，视为松开
                    clearTimeout(pressTimer);
                    
                    // 立即变黑
                    this.elements.fullscreenDisplay.classList.remove('timer-pressed');
                    this.elements.fullscreenDisplay.classList.remove('timer-held-long');
                    
                    // 如果按住时间不足0.5秒，则不执行任何操作，保持黑色状态
                    const pressDuration = Date.now() - pressStartTime;
                    if (pressDuration < 500 && !isLongPress && this.state.timerState === 'ready') {
                        // 不执行任何操作，保持黑色状态
                    }
                });
                
                // 添加触摸事件支持
                this.elements.fullscreenTimer.addEventListener('touchstart', (e) => {
                    // 防止点击退出按钮时触发计时器切换
                    if (e.target.closest('.fullscreen-exit-btn')) {
                        return;
                    }
                    e.preventDefault();
                    console.log('Fullscreen timer touched, state:', this.state.timerState);
                    
                    // 在running状态下触摸也应能停止计时，所以不限制状态
                    if (this.state.timerState !== 'ready' && this.state.timerState !== 'running') return;
                    
                    // 如果是running状态，直接停止计时
                    if (this.state.timerState === 'running') {
                        this.stopTimer();
                        // 重置当前作用域的长按状态变量
                        this.fullscreenIsLongPress = false;
                        return;
                    }
                    
                    if (this.state.timerState !== 'ready') return; // 只在ready状态下进行长按逻辑
                    
                    // 清除之前的计时器
                    clearTimeout(this.fullscreenPressTimer);
                    
                    // 变红
                    this.elements.fullscreenDisplay.classList.add('timer-pressed');
                    this.elements.fullscreenDisplay.classList.remove('timer-held-long');
                    
                    this.fullscreenPressStartTime = Date.now();
                    this.fullscreenIsLongPress = false;
                    
                    // 检查是否按住超过0.5秒
                    this.fullscreenPressTimer = setTimeout(() => {
                        if (this.state.timerState === 'ready') {
                            // 变绿（表示可以开始计时）
                            this.elements.fullscreenDisplay.classList.remove('timer-pressed');
                            this.elements.fullscreenDisplay.classList.add('timer-held-long');
                            this.fullscreenIsLongPress = true;
                        }
                    }, 500);
                });
                
                this.elements.fullscreenTimer.addEventListener('touchend', (e) => {
                    // 防止点击退出按钮时触发计时器切换
                    if (e.target.closest('.fullscreen-exit-btn')) {
                        return;
                    }
                    e.preventDefault();
                    clearTimeout(this.fullscreenPressTimer);
                    
                    // 如果当前状态不是ready，说明可能已经通过touchstart事件处理了停止计时
                    // 这时不需要再执行计时逻辑
                    if (this.state.timerState !== 'ready') {
                        // 立即变黑
                        this.elements.fullscreenDisplay.classList.remove('timer-pressed');
                        this.elements.fullscreenDisplay.classList.remove('timer-held-long');
                        return;
                    }
                    
                    // 计算按住时间
                    const pressDuration = Date.now() - this.fullscreenPressStartTime;
                    
                    // 立即变黑
                    this.elements.fullscreenDisplay.classList.remove('timer-pressed');
                    this.elements.fullscreenDisplay.classList.remove('timer-held-long');
                    
                    // 如果按住时间超过0.5秒，则直接开始计时
                    if (this.fullscreenIsLongPress && this.state.timerState === 'ready') {
                        this.startTimer(); // 直接开始计时
                    }
                    // 如果按住时间不足0.5秒，则不执行任何操作，保持黑色状态
                });
                
                this.elements.fullscreenTimer.addEventListener('touchcancel', (e) => {
                    // 防止点击退出按钮时触发计时器切换
                    if (e.target.closest('.fullscreen-exit-btn')) {
                        return;
                    }
                    // 触摸取消时，视为松开
                    clearTimeout(this.fullscreenPressTimer);
                    
                    // 立即变黑
                    this.elements.fullscreenDisplay.classList.remove('timer-pressed');
                    this.elements.fullscreenDisplay.classList.remove('timer-held-long');
                    
                    // 如果按住时间不足0.5秒，则不执行任何操作，保持黑色状态
                    const pressDuration = Date.now() - this.fullscreenPressStartTime;
                    if (pressDuration < 500 && !this.fullscreenIsLongPress && this.state.timerState === 'ready') {
                        // 不执行任何操作，保持黑色状态
                    }
                });
            }
            
            // 全屏退出按钮事件
            if (this.elements.fullscreenExitBtn) {
                this.elements.fullscreenExitBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // 防止事件冒泡到全屏计时器
                    this.exitFullscreen();
                });
                
                // 添加触摸事件支持
                this.elements.fullscreenExitBtn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.exitFullscreen();
                });
            }
            
            // ESC提示显示
            this.elements.fullscreenTimer.addEventListener('mouseenter', () => {
                this.elements.escHint.classList.add('show');
                clearTimeout(this.state.escTimer);
            });
            
            this.elements.fullscreenTimer.addEventListener('mouseleave', () => {
                this.state.escTimer = setTimeout(() => {
                    this.elements.escHint.classList.remove('show');
                }, 2000);
            });

            // 移动端成绩统计浮动按钮
            if (this.elements.statsFloatBtn) {
                this.elements.statsFloatBtn.addEventListener('click', () => {
                    this.showStatsPanel();
                });
            }

            // 移动端成绩统计关闭按钮
            if (this.elements.statsCloseBtn) {
                this.elements.statsCloseBtn.addEventListener('click', () => {
                    this.hideStatsPanel();
                });
            }
        }

        // ===== 移动端成绩统计面板 =====
        showStatsPanel() {
            const statsContainer = document.querySelector('.stats-container-mobile');
            const closeBtn = document.querySelector('.stats-close-btn');
            if (statsContainer) {
                statsContainer.classList.add('show');
            }
            if (closeBtn) {
                closeBtn.classList.add('show');
            }
        }

        hideStatsPanel() {
            const statsContainer = document.querySelector('.stats-container-mobile');
            const closeBtn = document.querySelector('.stats-close-btn');
            if (statsContainer) {
                statsContainer.classList.remove('show');
            }
            if (closeBtn) {
                closeBtn.classList.remove('show');
            }
        }
        
        // ===== 魔方类型切换管理 =====
        
        
        
                /**
        
         * 切换魔方类型
        
         * @param {string} cubeType - 魔方类型（'corner', 'octahedron', 'cornerOcta', 'twinOctahedron'）
        
         */
        
                switchToCubeType(cubeType) {
        
                                    if (this.state.currentCubeType === cubeType) {
        
                        
        
                                        // 即使类型相同，也强制更新UI以确保正确显示（例如页面加载时恢复数据的情况）
        
                        
        
                                        this.updateAllViewsForCubeType();
        
                        
        
                                        return;
        
                        
        
                                    }
        
                        
        
                        
        
                        
        
                                    // 更新状态源
        
                        
        
                                    this.state.currentCubeType = cubeType;
        
                        
        
                        
        
                        
        
                                    // 保存当前魔方类型到localStorage
        
                                    this.saveTimeRecords();
        
                
        
                
        
                
        
                                    // 基于状态源统一更新所有相关状态和视图
        
                        
        
                                    this.updateAllViewsForCubeType();
        
                        
        
                                }
        
        
        
                /**
        
         * 统一的视图更新函数 - 基于currentCubeType状态源
        
         * 更新所有与当前魔方类型相关的UI组件和数据
        
         */
        
                updateAllViewsForCubeType() {
        
                    // 更新魔方选择下拉菜单状态
        
                    this.elements.cubeTypeSelect.value = this.state.currentCubeType;
        
        
        
                    // 统一控制所有视图的显示状态
        
                    this.updateViewVisibility();
        
        
        
                    // 更新打乱生成器配置
        
                    this.updateScrambleGeneratorConfig();
        
        
        
                    // 更新计数器显示
        
                    this.updateScrambleCounter();
        
        
        
                    // 切换生成打乱公式列表
        
                    this.updateGeneratedScramblesList();
        
        
        
                    // 重置打乱历史并生成新的打乱公式
        
                    this.resetScrambleHistory();
        
                    this.generateNewScramble();
        
        
        
                    // 更新生成打乱公式显示
        
                    this.updateGeneratedScramblesDisplay();
        
        
        
                    // 更新魔方面板视图
        
                    this.updateCubePanelView();
        
        
        
                    // 更新时间记录和统计
        
                    this.updateTimesList();
        
                    this.updateStats();
        
        
        
                    // 调整打乱公式区域高度
        
                    this.adjustScrambleSectionHeight();
        
                }
        
        // 重置打乱历史
        resetScrambleHistory() {
            this.state.scrambleHistory = [];
            this.state.currentHistoryIndex = -1;
        }
        
        // 统一控制视图可见性 - 基于currentCubeType状态
        updateViewVisibility() {
            // 控制打乱控制选项的显示
            const cornerControls = document.getElementById('corner-scramble-controls');
            const cornerOctaControls = document.getElementById('cornerOcta-scramble-controls');
            const octahedronControls = document.getElementById('octahedron-scramble-controls');
            const twinOctahedronControls = document.getElementById('twinOctahedron-scramble-controls');

            if (cornerControls) cornerControls.style.display = this.state.currentCubeType === 'corner' ? 'flex' : 'none';
            if (cornerOctaControls) cornerOctaControls.style.display = this.state.currentCubeType === 'cornerOcta' ? 'flex' : 'none';
            if (octahedronControls) octahedronControls.style.display = this.state.currentCubeType === 'octahedron' ? 'flex' : 'none';
            if (twinOctahedronControls) twinOctahedronControls.style.display = this.state.currentCubeType === 'twinOctahedron' ? 'flex' : 'none';

            // 所有需要根据魔方类型显示的元素
            const cornerElements = [
                this.elements.cornerView,
                this.elements.cornerControls
            ];

            const octahedronElements = [
                this.elements.octahedronView,
                this.elements.octahedronControls
            ];

            const cornerOctaElements = [
                this.elements.cornerOctaView,
                this.elements.cornerOctaControls
            ];

            const twinOctahedronElements = [
                this.elements.twinOctahedronView,
                this.elements.twinOctahedronControls
            ];

            // 根据当前状态统一设置显示状态
            const isCorner = this.state.currentCubeType === 'corner';
            const isOctahedron = this.state.currentCubeType === 'octahedron';
            const isCornerOcta = this.state.currentCubeType === 'cornerOcta';
            const isTwinOctahedron = this.state.currentCubeType === 'twinOctahedron';
            
            // 控制视图容器的显示
            if (this.elements.cornerView) {
                this.elements.cornerView.style.display = isCorner ? 'grid' : 'none';
            }
            if (this.elements.octahedronView) {
                this.elements.octahedronView.style.display = isOctahedron ? 'grid' : 'none';
            }
            if (this.elements.cornerOctaView) {
                this.elements.cornerOctaView.style.display = isCornerOcta ? 'grid' : 'none';
            }
            if (this.elements.twinOctahedronView) {
                this.elements.twinOctahedronView.style.display = isTwinOctahedron ? 'grid' : 'none';
            }
            
            // 控制打乱控制选项的显示
            if (this.elements.cornerControls) {
                this.elements.cornerControls.style.display = isCorner ? 'flex' : 'none';
            }
            if (this.elements.octahedronControls) {
                this.elements.octahedronControls.style.display = isOctahedron ? 'flex' : 'none';
            }
            if (this.elements.cornerOctaControls) {
                this.elements.cornerOctaControls.style.display = isCornerOcta ? 'flex' : 'none';
            }
            if (this.elements.twinOctahedronControls) {
                this.elements.twinOctahedronControls.style.display = isTwinOctahedron ? 'flex' : 'none';
            }
        }
        
        // 更新打乱计数器 - 基于currentCubeType状态
        updateScrambleCounter() {
            this.state.scrambleCounter = this.getCurrentCounter();
        }
        
        // 更新打乱计数器显示
        updateScrambleCounterDisplay() {
            const currentNumber = this.getCurrentCounter();
            this.elements.scrambleNumber.textContent = `#${currentNumber}`;
        }
        
        // 更新生成打乱公式列表 - 基于currentCubeType状态
        updateGeneratedScramblesList() {
            this.state.generatedScrambles = this.getCurrentGeneratedScrambles();
        }
        
        // 更新生成打乱公式显示
        updateGeneratedScramblesDisplay() {
            if (!this.elements.scramblesList) return; // 如果元素不存在，直接返回

            if (this.state.generatedScrambles.length > 0) {
                this.displayGeneratedScrambles();
            } else {
                this.elements.scramblesList.style.display = 'none';
            }
        }

        /**
 * 实际的渲染逻辑（不使用防抖）
 */
        doRender() {
            const renderer = this.viewRenderers.get(this.state.currentCubeType);
            const model = this.cubeInstances.get(this.state.currentCubeType);
            if (renderer && model) {
                renderer.render(model);
            }
        }

        // 更新魔方面板视图 - 基于currentCubeType状态（使用防抖优化）
        updateCubePanelView() {
            this.debouncedRender();
        }

        // 更新打乱生成器配置
        updateScrambleGeneratorConfig() {
            const generator = this.scrambleGenerators.get(this.state.currentCubeType);
            if (!generator) return;

            const config = {};

            // 转角三阶魔方的配置
            if (this.state.currentCubeType === 'corner') {
                // 转角三阶魔方使用固定配置：3循环和15%的0操作概率
                config.cycles = 3;
                config.zeroProb = 0.15;
            }

            // 转角八面体魔方使用固定配置：打乱角块
            if (this.state.currentCubeType === 'cornerOcta') {
                config.includeCorners = true;
            }

            // 更新生成器配置
            generator.setConfig(config);

            // 重新生成打乱公式
            this.generateNewScramble();
        }

        // 兼容旧方法名
        updateCubeView() {
            this.updateCubePanelView();
        }

        // 兼容旧方法名
        updateCornerCubeView() {
            const renderer = this.viewRenderers.get('corner');
            const model = this.cubeInstances.get('corner');
            if (renderer && model) {
                renderer.render(model);
            }
        }

        // 兼容旧方法名
        updateOctahedronView() {
            const renderer = this.viewRenderers.get('octahedron');
            const model = this.cubeInstances.get('octahedron');
            if (renderer && model) {
                renderer.render(model);
            }
        }

        // 兼容旧方法名
        updateCornerOctaView() {
            const renderer = this.viewRenderers.get('cornerOcta');
            const model = this.cubeInstances.get('cornerOcta');
            if (renderer && model) {
                renderer.render(model);
            }
        }
        
        // ===== 界面主题切换管理 =====
        restoreTheme() {
            const savedTheme = localStorage.getItem('cubeTimerTheme') || 'light';
            this.applyTheme(savedTheme);
        }
        
        saveTheme(theme) {
            localStorage.setItem('cubeTimerTheme', theme);
        }
        
        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            document.body.setAttribute('data-theme', theme);
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
        }
        
        // ===== 声音系统 =====
        initAudioContext() {
            // 创建音频上下文
            this.audioContext = null;
            this.soundEnabled = true;
            
            // 延迟初始化音频上下文（避免自动播放策略限制）
            this.initAudioOnFirstInteraction();
        }
        
        initAudioOnFirstInteraction() {
            const initAudio = () => {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    console.log('Audio context initialized');
                }
                // 移除事件监听器
                document.removeEventListener('click', initAudio);
                document.removeEventListener('touchstart', initAudio);
                document.removeEventListener('keydown', initAudio);
            };
            
            // 监听首次用户交互
            document.addEventListener('click', initAudio, { once: true });
            document.addEventListener('touchstart', initAudio, { once: true });
            document.addEventListener('keydown', initAudio, { once: true });
        }
        
        playBeep(frequency = 800, duration = 100, volume = 0.3) {
            if (!this.state.soundEnabled || !this.audioContext) return;
            
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + duration / 1000);
            } catch (error) {
                console.log('Error playing beep:', error);
            }
        }
        
        playStartSound() {
            this.playBeep(AUDIO_CONFIG.START_FREQ, AUDIO_CONFIG.START_DURATION, AUDIO_CONFIG.VOLUME);
        }

        playStopSound() {
            this.playBeep(AUDIO_CONFIG.STOP_FREQ, AUDIO_CONFIG.STOP_DURATION, AUDIO_CONFIG.VOLUME);
        }

        playPenaltySound() {
            // 播放两声警告音
            this.playBeep(AUDIO_CONFIG.PENALTY_FREQ, AUDIO_CONFIG.PENALTY_DURATION, AUDIO_CONFIG.VOLUME);
            setTimeout(() => this.playBeep(AUDIO_CONFIG.PENALTY_FREQ, AUDIO_CONFIG.PENALTY_DURATION, AUDIO_CONFIG.VOLUME), AUDIO_CONFIG.PENALTY_DURATION * 1.5);
        }

        playReadySound() {
            this.playBeep(AUDIO_CONFIG.READY_FREQ, AUDIO_CONFIG.READY_DURATION, AUDIO_CONFIG.VOLUME);
        }

        playEightSecondSound() {
            // 8秒提示音：中低音，较短
            this.playBeep(AUDIO_CONFIG.PENALTY_FREQ, AUDIO_CONFIG.PENALTY_DURATION, AUDIO_CONFIG.VOLUME);
        }

        playTwelveSecondSound() {
            // 12秒提示音：中高音，稍长，提醒用户即将到15秒
            this.playBeep(AUDIO_CONFIG.START_FREQ, AUDIO_CONFIG.START_DURATION * 0.8, AUDIO_CONFIG.VOLUME);
        }

        toggleSound() {
            this.state.soundEnabled = !this.state.soundEnabled;
            this.updateSoundButton();

            // 播放测试音
            if (this.state.soundEnabled) {
                this.playBeep(AUDIO_CONFIG.READY_FREQ, AUDIO_CONFIG.READY_DURATION * 2, AUDIO_CONFIG.VOLUME);
            }
            
            // 保存声音设置
            localStorage.setItem('cube-timer-sound-enabled', this.state.soundEnabled.toString());
        }

        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            document.body.setAttribute('data-theme', newTheme);
            
            // 更新按钮图标
            const icon = this.elements.themeToggleBtn.querySelector('i');
            if (newTheme === 'light') {
                icon.className = 'fas fa-sun';
                this.elements.themeToggleBtn.title = t('switchToDark');
            } else {
                icon.className = 'fas fa-moon';
                this.elements.themeToggleBtn.title = t('switchToLight');
            }
            
            // 保存主题设置（使用正确的storage键）
            localStorage.setItem('cubeTimerTheme', newTheme);
        }

        restoreTheme() {
            const savedTheme = localStorage.getItem('cubeTimerTheme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            document.body.setAttribute('data-theme', savedTheme);
        }
        
        updateSoundButton() {
            const icon = this.elements.soundBtn.querySelector('i');
            if (this.state.soundEnabled) {
                this.elements.soundBtn.classList.remove('muted');
                icon.className = 'fas fa-volume-up';
                this.elements.soundBtn.title = t('soundOn');
            } else {
                this.elements.soundBtn.classList.add('muted');
                icon.className = 'fas fa-volume-mute';
                this.elements.soundBtn.title = t('soundOff');
            }
        }
        
        restoreSoundSettings() {
            const saved = localStorage.getItem('cube-timer-sound-enabled');
            if (saved !== null) {
                this.state.soundEnabled = saved === 'true';
            }
            this.updateSoundButton();
        }

        // ===== 通用状态获取方法 =====

        /**
 * 获取当前魔方类型的时间记录
 * @returns {Array} 时间记录数组（倒序，最新的在前）
 */
        getCurrentTimes() {
            return this.state.times[this.state.currentCubeType] || [];
        }

        /**
 * 获取当前魔方类型的打乱计数器
 * @returns {number} 当前计数器值
 */
        getCurrentCounter() {
            return this.state.counters[this.state.currentCubeType] || 1;
        }

        /**
 * 设置当前魔方类型的打乱计数器
 * @param {number} value - 计数器值
 */
        setCurrentCounter(value) {
            this.state.counters[this.state.currentCubeType] = value;
            this.state.scrambleCounter = value;
        }

        /**
 * 递增当前魔方类型的打乱计数器
 * @returns {number} 新的计数器值
 */
        incrementCurrentCounter() {
            const newValue = this.getCurrentCounter() + 1;
            this.setCurrentCounter(newValue);
            return newValue;
        }

        /**
 * 获取当前魔方类型的生成打乱公式列表
 * @returns {Array} 打乱公式数组
 */
        getCurrentGeneratedScrambles() {
            return this.state.generatedScrambles[this.state.currentCubeType] || [];
        }
        
        setCurrentGeneratedScrambles(scrambles) {
            this.state.generatedScrambles[this.state.currentCubeType] = scrambles;
        }

        // ===== 数据持久化 =====

        /**
 * 保存所有时间记录到localStorage
 * 包括所有魔方类型的成绩、计数器和生成的打乱公式
 */
        saveTimeRecords() {
            try {
                console.log('开始保存时间记录...');
                console.log('times:', this.state.times);
                console.log('counters:', this.state.counters);
                console.log('generatedScrambles:', this.state.generatedScrambles);

                const timeRecords = {
                    currentCubeType: this.state.currentCubeType || 'corner',
                    times: this.state.times,
                    counters: this.state.counters,
                    generatedScrambles: this.state.generatedScrambles
                };
                const data = JSON.stringify(timeRecords);
                localStorage.setItem('cube-timer-records', data);
                console.log('保存成功:', data);
            } catch (e) {
                console.error('保存时间记录失败:', e);
                // 尝试通知用户（如果有通知功能）
                if (typeof this.showNotification === 'function') {
                    this.showNotification('保存数据失败，请检查浏览器存储空间');
                }
            }
        }

        /**
 * 验证时间记录数据结构是否有效
 * @param {Object} records - 要验证的时间记录对象
 * @returns {boolean} 数据是否有效
 */
        validateTimeRecords(records) {
            if (!records || typeof records !== 'object') {
                return false;
            }

            // 检查新格式
            if (records.times && records.counters && records.generatedScrambles) {
                const timesValid = this.validateCubeDataStructure(records.times, 'times');
                const countersValid = this.validateCubeDataStructure(records.counters, 'counters');

                // generatedScrambles 可能是空数组（损坏的数据），尝试修复
                let scramblesValid = this.validateCubeDataStructure(records.generatedScrambles, 'generatedScrambles');
                if (!scramblesValid) {
                    console.warn('generatedScrambles 数据结构异常，将自动修复');
                    // 修复数据结构
                    records.generatedScrambles = {
                        corner: Array.isArray(records.generatedScrambles) ? records.generatedScrambles : [],
                        octahedron: [],
                        cornerOcta: [],
                        twinOctahedron: []
                    };
                    scramblesValid = true;
                }

                return timesValid && countersValid && scramblesValid;
            }

            // 检查旧格式
            return true; // 旧格式总是可以迁移
        }

        /**
 * 验证魔方数据结构（times, counters, generatedScrambles）
 * @param {Object} data - 要验证的数据对象
 * @param {string} dataType - 数据类型 ('times', 'counters', 'generatedScrambles')
 * @returns {boolean} 数据是否有效
 */
        validateCubeDataStructure(data, dataType = 'times') {
            if (!data || typeof data !== 'object') {
                return false;
            }

            const cubeTypes = ['corner', 'octahedron', 'cornerOcta', 'twinOctahedron'];

            if (dataType === 'counters') {
                // counters 应该是对象，每个魔方类型对应数字
                return cubeTypes.every(type => typeof data[type] === 'number');
            } else {
                // times 和 generatedScrambles 应该是对象，每个魔方类型对应数组
                return cubeTypes.every(type => Array.isArray(data[type]));
            }
        }

        /**
 * 初始化默认状态
 */
        initializeDefaultState() {
            this.state.currentCubeType = 'corner';
            this.state.times = {
                corner: [],
                octahedron: [],
                cornerOcta: [],
                twinOctahedron: []
            };
            this.state.counters = {
                corner: 1,
                octahedron: 1,
                cornerOcta: 1,
                twinOctahedron: 1
            };
            this.state.generatedScrambles = {
                corner: [],
                octahedron: [],
                cornerOcta: [],
                twinOctahedron: []
            };
            this.state.scrambleCounter = 1;
        }

        /**
 * 从localStorage恢复时间记录
 * 包括所有魔方类型的成绩、计数器和生成的打乱公式
 */
        restoreTimeRecords() {
            try {
                console.log('开始恢复时间记录...');
                const savedRecords = localStorage.getItem('cube-timer-records');
                console.log('localStorage中的数据:', savedRecords);

                if (!savedRecords) {
                    // 没有保存的数据，使用默认值
                    console.log('没有找到保存的数据，使用默认值');
                    this.initializeDefaultState();
                    return;
                }

                const timeRecords = JSON.parse(savedRecords);
                console.log('解析后的数据:', timeRecords);

                // 验证数据结构
                if (!this.validateTimeRecords(timeRecords)) {
                    console.warn('时间记录数据格式无效，使用默认值');
                    this.initializeDefaultState();
                    return;
                }

                console.log('数据验证通过，开始恢复...');

                // 恢复当前魔方类型
                this.state.currentCubeType = timeRecords.currentCubeType || 'corner';

                // 兼容新旧数据格式
                if (timeRecords.times && timeRecords.counters && timeRecords.generatedScrambles) {
                    // 新格式：统一的数据结构
                    this.state.times = timeRecords.times;
                    this.state.counters = timeRecords.counters;
                    this.state.generatedScrambles = timeRecords.generatedScrambles;
                    console.log('恢复新格式数据完成');
                } else {
                    // 旧格式：分散的数据结构，迁移到新结构
                    this.state.times = {
                        corner: timeRecords.cornerTimes || [],
                        octahedron: timeRecords.octahedronTimes || [],
                        cornerOcta: timeRecords.cornerOctaTimes || [],
                        twinOctahedron: timeRecords.twinOctahedronTimes || []
                    };
                    this.state.counters = {
                        corner: timeRecords.cornerScrambleCounter || 1,
                        octahedron: timeRecords.octahedronScrambleCounter || 1,
                        cornerOcta: timeRecords.cornerOctaScrambleCounter || 1,
                        twinOctahedron: timeRecords.twinOctahedronScrambleCounter || 1
                    };
                    this.state.generatedScrambles = {
                        corner: timeRecords.cornerGeneratedScrambles || [],
                        octahedron: timeRecords.octahedronGeneratedScrambles || [],
                        cornerOcta: timeRecords.cornerOctaGeneratedScrambles || [],
                        twinOctahedron: timeRecords.twinOctahedronGeneratedScrambles || []
                    };
                    console.log('恢复旧格式数据并迁移完成');
                }

                console.log('当前魔方类型:', this.state.currentCubeType);
                console.log('当前成绩记录:', this.state.times[this.state.currentCubeType]);
            } catch (e) {
                console.error('恢复时间记录失败:', e);
                // 如果恢复失败，使用默认值
                this.initializeDefaultState();
            }
        }
        
        // ===== 打乱历史管理 =====
        generateNewScramble() {
            // 使用注册的打乱生成器生成新的打乱
            const generator = this.scrambleGenerators.get(this.state.currentCubeType);
            if (generator) {
                this.state.currentScramble = generator.generate();
            }
            
            // 添加到历史记录（使用当前计数器值）
            this.addToScrambleHistory();
            
            this.updateScrambleDisplay();
            this.applyScrambleInstant();
            this.updateNavigationButtons();
        }

        // 生成用于批量的打乱（不影响当前状态）
        generateScrambleForBatch() {
            const generator = this.scrambleGenerators.get(this.state.currentCubeType);
            if (generator) {
                return generator.generate();
            }
            return null;
        }

        // 获取打乱文本（用于导出）
        getScrambleTextForBatch(scramble) {
            const generator = this.scrambleGenerators.get(this.state.currentCubeType);
            if (generator && generator.getScrambleText) {
                return generator.getScrambleText(scramble);
            }
            return typeof scramble === 'string' ? scramble : scramble.join(' ');
        }
        
        // 在完成一次计时后调用，准备下一个打乱
        prepareNextScramble() {
            // 更新当前魔方类型的计数器
            this.updateCurrentScrambleCounter();
            
            // 生成新的打乱
            this.generateNewScramble();
        }
        
        // 更新当前魔方类型的计数器
        updateCurrentScrambleCounter() {
            this.incrementCurrentCounter();
        }
        
        addToScrambleHistory() {
            // 根据魔方类型处理不同的打乱格式
            let scrambleCopy;
            if (this.state.currentCubeType === 'corner') {
                scrambleCopy = [...this.state.currentScramble]; // 转角魔方是数组，需要深拷贝
            } else {
                scrambleCopy = this.state.currentScramble; // 双子八面体是字符串，直接赋值
            }
            
            const scrambleRecord = {
                scramble: scrambleCopy,
                scrambleNumber: this.state.scrambleCounter,
                cubeType: this.state.currentCubeType,
                timestamp: Date.now()
            };
            
            // 如果当前不在历史记录的末尾，删除后面的记录
            if (this.state.currentHistoryIndex < this.state.scrambleHistory.length - 1) {
                this.state.scrambleHistory = this.state.scrambleHistory.slice(0, this.state.currentHistoryIndex + 1);
            }
            
            // 添加新记录
            this.state.scrambleHistory.push(scrambleRecord);
            this.state.currentHistoryIndex = this.state.scrambleHistory.length - 1;
            
            // 限制历史记录数量
            if (this.state.scrambleHistory.length > HISTORY_LIMITS.SCRAMBLE_HISTORY) {
                this.state.scrambleHistory.shift();
                this.state.currentHistoryIndex--;
            }
        }
        
        previousScramble() {
            if (this.state.currentHistoryIndex > 0) {
                this.state.currentHistoryIndex--;
                this.loadScrambleFromHistory();
            }
        }
        
        nextScramble() {
            if (this.state.currentHistoryIndex < this.state.scrambleHistory.length - 1) {
                // 如果有历史记录，前进到下一个
                this.state.currentHistoryIndex++;
                this.loadScrambleFromHistory();
            } else {
                // 如果已经是最新，生成新的打乱
                this.generateNewScramble();
            }
        }
        
        loadScrambleFromHistory() {
            const record = this.state.scrambleHistory[this.state.currentHistoryIndex];
            if (!record) return;
            
            // 恢复打乱状态 - 需要处理不同类型的打乱格式
            if (record.cubeType === 'corner') {
                this.state.currentScramble = [...record.scramble]; // 深拷贝数组
            } else {
                this.state.currentScramble = record.scramble; // 字符串直接赋值
            }
            this.state.scrambleCounter = record.scrambleNumber;
            
            // 更新显示
            this.updateScrambleDisplay();
            this.updateScrambleCounterDisplay();
            this.applyScrambleInstant();
            this.updateNavigationButtons();
        }
        
        updateNavigationButtons() {
            const hasPrevious = this.state.currentHistoryIndex > 0;
            // 下一个按钮永远可用（要么前进历史，要么生成新打乱）
            const hasNext = true;
            
            this.elements.prevScrambleBtn.disabled = !hasPrevious;
            this.elements.nextScrambleBtn.disabled = !hasNext;
            
            // 更新按钮样式
            if (hasPrevious) {
                this.elements.prevScrambleBtn.classList.remove('disabled');
            } else {
                this.elements.prevScrambleBtn.classList.add('disabled');
            }
            
            // 下一个按钮永远启用
            this.elements.nextScrambleBtn.classList.remove('disabled');
        }
        
        // ===== 打乱公式生成引擎 =====
        generateScramble() {
            this.generateNewScramble();
        }
        
        updateScrambleDisplay() {
            this.elements.scrambleContent.innerHTML = '';
            // 根据当前魔方类型获取对应的序号
            const currentNumber = this.getCurrentCounter();
            this.elements.scrambleNumber.textContent = `#${currentNumber}`;
            
            if (this.state.currentCubeType === 'corner') {
                // 显示转角三阶魔方的循环打乱公式（固定3循环）
                const version = 4;
                const cycles = 3;
                const stepsPerCycle = 17;
                
                let html = '';
                
                for (let cycle = 0; cycle < cycles; cycle++) {
                    const startIdx = cycle * stepsPerCycle;

                    html += `<div class="scramble-cycle">`;
                    html += `<div class="cycle-steps">`;

                    // 第一组层转动
                    for (let i = 0; i < version; i++) {
                        const move = this.state.currentScramble[startIdx + i];
                        html += `<span class="layer-move">${move}</span>`;
                    }

                    // 第一组转角
                    for (let i = 0; i < 4; i++) {
                        const move = this.state.currentScramble[startIdx + version + i];
                        const cls = move.endsWith('0') ? 'corner-zero' : 'corner-move';
                        html += `<span class="${cls}">${move}</span>`;
                    }

                    // x2翻面
                    html += `<span class="flip-move">${this.state.currentScramble[startIdx + version + 4]}</span>`;

                    // 第二组转角
                    for (let i = 0; i < 4; i++) {
                        const move = this.state.currentScramble[startIdx + version + 5 + i];
                        const cls = move.endsWith('0') ? 'corner-zero' : 'corner-move';
                        html += `<span class="${cls}">${move}</span>`;
                    }

                    // 第二组层转动
                    for (let i = 0; i < version; i++) {
                        const move = this.state.currentScramble[startIdx + version + 9 + i];
                        html += `<span class="layer-move">${move}</span>`;
                    }

                    html += `</div></div>`;
                }
                
                this.elements.scrambleContent.innerHTML = html;
            } else {
                // 显示转角八面体魔方和双子八面体魔方的打乱公式
                const steps = this.state.currentScramble.split(' ');
                steps.forEach(step => {
                    const stepElement = document.createElement('span');
                    stepElement.className = 'scramble-step';
                    stepElement.textContent = step;
                    this.elements.scrambleContent.appendChild(stepElement);
                });
            }

            // 动态调整打乱公式区域的高度
            this.adjustScrambleSectionHeight();
        }

        // 动态调整打乱公式区域高度
        adjustScrambleSectionHeight() {
            const scrambleControlsSection = document.querySelector('.scramble-controls-section');
            const timerSection = document.querySelector('.timer-main-section');

            if (scrambleControlsSection && timerSection) {
                // 获取整个打乱控制区域的实际高度（包括控制选项和打乱公式）
                const scrambleControlsHeight = scrambleControlsSection.offsetHeight;

                // 打乱控制区的top位置
                const scrambleTop = 75;

                // 打乱区和计时区之间的间距
                const spacing = 12;

                // 计算计时区的新top值
                const newTimerTop = scrambleTop + scrambleControlsHeight + spacing;
                timerSection.style.top = newTimerTop + 'px';

                // 调整计时区的高度
                const containerHeight = document.querySelector('.container').offsetHeight;
                const bottomSectionHeight = 80; // 打乱公式导出区的高度
                const newTimerHeight = containerHeight - newTimerTop - bottomSectionHeight - 40;
                timerSection.style.height = Math.max(320, newTimerHeight) + 'px';
            }
        }
        
        copyScramble() {
            const textToCopy = this.getScrambleText();
            navigator.clipboard.writeText(textToCopy).then(() => {
                this.showNotification(t('copied'));
            }).catch(() => {
                this.showNotification(t('copyFailed'));
            });
        }
        
        showCoordinateModal() {
            const modal = document.getElementById('coordinateModal');
            if (modal) {
                // 根据当前魔方类型生成对应的图片内容
                this.updateCoordinateModalContent();
                
                // 确保模态框显示
                modal.style.display = 'flex';
                
                // 定义关闭函数
                const closeModal = () => {
                    modal.style.display = 'none';
                };
                
                // 定义事件处理函数
                const handleModalClick = (e) => {
                    // 如果点击的是遮罩层（不是内容区域），则关闭
                    if (e.target === document.getElementById('coordinateOverlay')) {
                        closeModal();
                    }
                };
                
                const handleCloseBtnClick = () => {
                    closeModal();
                };
                
                const handleEscKey = (e) => {
                    if (e.key === 'Escape') {
                        closeModal();
                    }
                };
                
                // 添加事件监听器
                document.addEventListener('keydown', handleEscKey);
                document.getElementById('coordinateOverlay').addEventListener('click', handleModalClick);
                
                const closeBtn = document.getElementById('coordinateCloseBtn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', handleCloseBtnClick);
                }
                
                // 创建一个一次性监听器，当模态框关闭时自动清理事件监听器
                const checkModalClosed = () => {
                    if (modal.style.display !== 'flex' && modal.style.display !== 'flex') {
                        // 移除事件监听器
                        document.removeEventListener('keydown', handleEscKey);
                        document.getElementById('coordinateOverlay').removeEventListener('click', handleModalClick);
                        if (closeBtn) {
                            closeBtn.removeEventListener('click', handleCloseBtnClick);
                        }
                        clearInterval(checkInterval);
                    }
                };
                
                // 设置定时器检查模态框是否已关闭
                const checkInterval = setInterval(checkModalClosed, 100);
            }
        }
        
        // 根据当前魔方类型更新坐标弹出层内容
        updateCoordinateModalContent() {
            const body = document.querySelector('.coordinate-body');
            if (!body) return;
            
            // 获取当前魔方类型
            const currentCubeType = this.state.currentCubeType;
            
            // 清空现有内容
            body.innerHTML = '<div class="coordinate-grid" id="coordinateGrid"></div>';
            const grid = document.getElementById('coordinateGrid');
            
            // 根据魔方类型生成不同的图片内容
            let images = [];
            let title = '';
            
            switch(currentCubeType) {
                case 'corner':
                    title = '转角三阶';
                    images = [
                        { label: '打乱坐标', src: './pictures/Corner Turning 3X3 Cube_Static.png' },
                        { label: 'R', src: './pictures/Corner Turning 3X3 Cube_R.png' },
                        { label: '3', src: './pictures/Corner Turning 3X3 Cube_U.png' },
                        { label: '4', src: './pictures/Corner Turning 3X3 Cube_F.png' },
                        { label: '5', src: './pictures/Corner Turning 3X3 Cube_L.png' },
                        { label: '6', src: './pictures/Corner Turning 3X3 Cube_D.png' },
                        { label: '7', src: './pictures/Corner Turning 3X3 Cube_B.png' },
                        { label: '8', src: './pictures/Corner Turning 3X3 Cube_UR+.png' },
                        { label: '9', src: './pictures/Corner Turning 3X3 Cube_UL+.png' },
                        { label: '10', src: './pictures/Corner Turning 3X3 Cube_DR+.png' },
                        { label: '11', src: './pictures/Corner Turning 3X3 Cube_DL+.png' },
                        { label: '12', placeholder: true }
                    ];
                    break;
                case 'octahedron':
                    title = '双子八面体';
                    images = [
                        { label: '打乱坐标', src: './pictures/Dual Octahedron-Static.jpg' },
                        { label: 'U', src: './pictures/Dual Octahedron-U.jpg' },
                        { label: 'R', src: './pictures/Dual Octahedron-R.jpg' },
                        { label: '4', placeholder: true },
                        { label: '5', placeholder: true },
                        { label: '6', placeholder: true },
                        { label: '7', placeholder: true },
                        { label: '8', placeholder: true },
                        { label: '9', placeholder: true },
                        { label: '10', placeholder: true },
                        { label: '11', placeholder: true },
                        { label: '12', placeholder: true }
                    ];
                    break;
                case 'cornerOcta':
                    title = '转角八面体';
                    images = [
                        { label: '打乱坐标', src: './pictures/Corner Turning Octahedron_Static.jpg' },
                        { label: '2', placeholder: true },
                        { label: '3', placeholder: true },
                        { label: '4', placeholder: true },
                        { label: '5', placeholder: true },
                        { label: '6', placeholder: true },
                        { label: '7', placeholder: true },
                        { label: '8', placeholder: true },
                        { label: '9', placeholder: true },
                        { label: '10', placeholder: true },
                        { label: '11', placeholder: true },
                        { label: '12', placeholder: true }
                    ];
                    break;
                case 'twinOctahedron':
                    title = '二阶转面八面体';
                    images = [
                        { label: '打乱坐标', placeholder: true },
                        { label: '2', placeholder: true },
                        { label: '3', placeholder: true },
                        { label: '4', placeholder: true },
                        { label: '5', placeholder: true },
                        { label: '6', placeholder: true },
                        { label: '7', placeholder: true },
                        { label: '8', placeholder: true },
                        { label: '9', placeholder: true },
                        { label: '10', placeholder: true },
                        { label: '11', placeholder: true },
                        { label: '12', placeholder: true }
                    ];
                    break;
                default:
                    title = '魔方';
                    images = [
                        { label: '打乱坐标', placeholder: true },
                        { label: '2', placeholder: true },
                        { label: '3', placeholder: true },
                        { label: '4', placeholder: true },
                        { label: '5', placeholder: true },
                        { label: '6', placeholder: true },
                        { label: '7', placeholder: true },
                        { label: '8', placeholder: true },
                        { label: '9', placeholder: true },
                        { label: '10', placeholder: true },
                        { label: '11', placeholder: true },
                        { label: '12', placeholder: true }
                    ];
            }
            
            // 更新标题
            const header = document.querySelector('.coordinate-header h3');
            if (header) {
                header.textContent = `${title}转动方式图示`;
            }
            
            // 生成图片项
            images.forEach((image, index) => {
                const item = document.createElement('div');
                item.className = 'coordinate-item';
                
                const label = document.createElement('div');
                label.className = 'coordinate-label';
                label.textContent = image.label;
                item.appendChild(label);
                
                if (image.placeholder) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'coordinate-placeholder';
                    placeholder.textContent = `图片${index+1}`;
                    item.appendChild(placeholder);
                } else {
                    const img = document.createElement('img');
                    img.src = image.src;
                    img.alt = `${title}${image.label}`;
                    img.className = 'coordinate-image';
                    item.appendChild(img);
                }
                
                grid.appendChild(item);
            });
        }
        
        applyScrambleInstant() {
            if (!this.state.currentScramble) {
                return;
            }

            const model = this.cubeInstances.get(this.state.currentCubeType);
            if (!model) return;

            // 重置魔方
            model.reset();

            // 根据魔方类型应用打乱
            if (this.state.currentCubeType === 'corner') {
                // 转角三阶魔方需要转换打乱公式
                const generator = this.scrambleGenerators.get('corner');
                const convertedScramble = generator.convertToMoves(this.state.currentScramble);

                // 应用打乱公式
                for (const move of convertedScramble) {
                    model.rotate(move);
                }
            } else if (this.state.currentCubeType === 'twinOctahedron') {
                // 二阶转面八面体：将显示符号映射回实际操作
                // R->RU, F->RD, U->LU, L->LD
                const displayToMoveMap = {
                    'R': 'RU', "R'": "RU'",
                    'F': 'RD', "F'": "RD'",
                    'U': 'LU', "U'": "LU'",
                    'L': 'LD', "L'": "LD'",
                    'R2': 'RU', "R2'": "RU'",
                    'F2': 'RD', "F2'": "RD'",
                    'U2': 'LU', "U2'": "LU'",
                    'L2': 'LD', "L2'": "LD'"
                };

                const moves = typeof this.state.currentScramble === 'string'
                    ? this.state.currentScramble.split(' ')
                    : this.state.currentScramble;

                for (const displayMove of moves) {
                    if (!displayMove) continue;
                    const actualMove = displayToMoveMap[displayMove];
                    if (actualMove) {
                        model.rotate(actualMove);
                    }
                }
            } else {
                // 其他魔方类型直接应用
                const moves = typeof this.state.currentScramble === 'string'
                    ? this.state.currentScramble.split(' ')
                    : this.state.currentScramble;

                for (const move of moves) {
                    model.rotate(move);
                }
            }

            // 更新视图
            this.updateCubePanelView();
        }
        
        // ===== 魔方视图渲染更新 =====
        updateCornerCubeView() {
            const faceElements = {
                top: document.getElementById('face-top'),
                bottom: document.getElementById('face-bottom'),
                front: document.getElementById('face-front'),
                back: document.getElementById('face-back'),
                left: document.getElementById('face-left'),
                right: document.getElementById('face-right')
            };

            Object.entries(faceElements).forEach(([faceName, faceElement]) => {
                if (!faceElement) return;

                const label = faceElement.querySelector('.face-label');
                faceElement.innerHTML = '';

                if (label) {
                    faceElement.appendChild(label);
                }

                const canvas = document.createElement('canvas');
                canvas.width = RENDER_CONFIG.CANVAS_SIZE;
                canvas.height = RENDER_CONFIG.CANVAS_SIZE;
                canvas.style.width = '100%';
                canvas.style.height = '100%';

                const ctx = canvas.getContext('2d');
                this.drawCornerCubeFace(ctx, this.cornerCube.faces[faceName], faceName);

                faceElement.appendChild(canvas);
            });
        }
        
        // 绘制转角魔方面
        drawCornerCubeFace(ctx, faceColors, faceName) {
            const a = 1;
            const scale = RENDER_CONFIG.CANVAS_SCALE;
            const sqrt2_a = a * Math.sqrt(2);
            const three_minus_sqrt2_a = 3 * a - sqrt2_a;

            const toCanvasX = (x) => x * scale;
            const toCanvasY = (y) => RENDER_CONFIG.CANVAS_SIZE - y * scale;

            const linspace = (start, end, n) => {
                const arr = [];
                const step = (end - start) / (n - 1);
                for (let i = 0; i < n; i++) arr.push(start + step * i);
                return arr;
            };

            const fliplr = (arr) => arr.slice().reverse();

            const fillPolygon = (points, colorIndex) => {
                ctx.beginPath();
                ctx.moveTo(toCanvasX(points[0][0]), toCanvasY(points[0][1]));
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(toCanvasX(points[i][0]), toCanvasY(points[i][1]));
                }
                ctx.closePath();

                ctx.fillStyle = CORNER_CUBE_COLOR_MAP[faceColors[colorIndex]];
                ctx.fill();

                ctx.strokeStyle = RENDER_CONFIG.STROKE_COLOR;
                ctx.lineWidth = 1;
                ctx.stroke();
            };

            // 绘制各个区域
            // 区域1-5：完整矩形
            fillPolygon([[0,2],[1,2],[1,3],[0,3]], 0);

            fillPolygon([[2,2],[3,2],[3,3],[2,3]], 1);

            fillPolygon([[1,1],[2,1],[2,2],[1,2]], 2);

            fillPolygon([[0,0],[1,0],[1,1],[0,1]], 3);

            fillPolygon([[2,0],[3,0],[3,1],[2,1]], 4);

            // 区域6-8：左边
            const x6 = linspace(0, 1, 30);
            const y6_curve = x6.map(x => Math.sqrt(Math.max(2 - x*x, 0)));
            const pts6 = [[0,1], ...x6.map((x, i) => [x, y6_curve[i]])];
            fillPolygon(pts6, 5);

            const x7 = linspace(0, 1, 30);
            const y7_curve = x7.map(x => 3 - Math.sqrt(Math.max(2 - x*x, 0)));
            const pts7 = [[0,2], ...x7.map((x, i) => [x, y7_curve[i]])];
            fillPolygon(pts7, 6);

            const x8 = linspace(0, 1, 30);
            const y8_c1 = x8.map(x => Math.sqrt(Math.max(2 - x*x, 0)));
            const y8_c2 = x8.map(x => 3 - Math.sqrt(Math.max(2 - x*x, 0)));
            const pts8 = [...x8.map((x, i) => [x, y8_c2[i]]), ...fliplr(x8).map((x, i) => [x, fliplr(y8_c1)[i]])];
            fillPolygon(pts8, 7);

            // 区域9-11：上边
            const x9 = linspace(1, sqrt2_a, 30);
            const y9_curve = x9.map(x => 3 - Math.sqrt(Math.max(2 - x*x, 0)));
            const pts9 = [[1,3], ...x9.map((x, i) => [x, y9_curve[i]])];
            fillPolygon(pts9, 8);

            const x10 = linspace(three_minus_sqrt2_a, 2, 30);
            const y10_curve = x10.map(x => 3 - Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts10 = [[2,3], ...x10.map((x, i) => [x, y10_curve[i]])];
            fillPolygon(pts10, 9);

            const x11L = linspace(sqrt2_a, 1, 30);
            const y11L_c = x11L.map(x => 3 - Math.sqrt(Math.max(2 - x*x, 0)));
            const x11R = linspace(three_minus_sqrt2_a, 2, 30);
            const y11R_c = x11R.map(x => 3 - Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts11 = [...x11R.map((x, i) => [x, y11R_c[i]]), ...fliplr(x11L).map((x, i) => [x, fliplr(y11L_c)[i]])];
            fillPolygon(pts11, 10);

            // 区域12-14：右边
            const x12 = linspace(2, 3, 30);
            const y12_curve = x12.map(x => Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts12 = [[3,1], ...x12.map((x, i) => [x, y12_curve[i]])];
            fillPolygon(pts12, 11);

            const x13 = linspace(2, 3, 30);
            const y13_curve = x13.map(x => 3 - Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts13 = [[3,2], ...x13.map((x, i) => [x, y13_curve[i]])];
            fillPolygon(pts13, 12);

            const x14 = linspace(2, 3, 30);
            const y14_c3 = x14.map(x => Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const y14_c4 = x14.map(x => 3 - Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts14 = [...x14.map((x, i) => [x, y14_c4[i]]), ...fliplr(x14).map((x, i) => [x, fliplr(y14_c3)[i]])];
            fillPolygon(pts14, 13);

            // 区域15-17：下边
            const x15 = linspace(1, sqrt2_a, 30);
            const y15_curve = x15.map(x => Math.sqrt(Math.max(2 - x*x, 0)));
            const pts15 = [[1,0], ...x15.map((x, i) => [x, y15_curve[i]])];
            fillPolygon(pts15, 14);

            const x16 = linspace(three_minus_sqrt2_a, 2, 30);
            const y16_curve = x16.map(x => Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts16 = [[2,0], ...x16.map((x, i) => [x, y16_curve[i]])];
            fillPolygon(pts16, 15);

            const x17L = linspace(sqrt2_a, 1, 30);
            const y17L_c = x17L.map(x => Math.sqrt(Math.max(2 - x*x, 0)));
            const x17R = linspace(three_minus_sqrt2_a, 2, 30);
            const y17R_c = x17R.map(x => Math.sqrt(Math.max(2 - (x-3)*(x-3), 0)));
            const pts17 = [...x17R.map((x, i) => [x, y17R_c[i]]), ...fliplr(x17L).map((x, i) => [x, fliplr(y17L_c)[i]])];
            fillPolygon(pts17, 16);
        }
        
        getColorHex(colorName) {
            return this.colorMap[colorName] || RENDER_CONFIG.DEFAULT_COLOR;
        }
        
        updateOctahedronView() {
            const faceKeys = ['top1', 'top2', 'top3', 'top4', 'bottom1', 'bottom2', 'bottom3', 'bottom4'];
            
            faceKeys.forEach(faceKey => {
                const faceGroup = document.querySelector(`.face-group[data-face="${faceKey}"]`);
                if (!faceGroup) return;
                
                // 清除现有内容
                faceGroup.innerHTML = '';
                
                // 获取面的颜色
                const colors = this.octahedronCube.faces[faceKey];
                
                // 创建面的几何结构
                this.createFaceGeometry(faceGroup, faceKey, colors);
            });
        }
        
        createFaceGeometry(faceGroup, faceKey, colors) {
            const isTopFace = faceKey.startsWith('top');
            const scale = RENDER_CONFIG.SVG_SCALE_TWIN;
            const projectionFactor = RENDER_CONFIG.PROJECTION_FACTOR;

            // 定义八面体面的几何结构
            const a = 1.5 * scale;
            const points3D = [
                [ a, 0, 0 ], [0, a, 0], [0, 0, a],
                [7/9*a, 2/9*a, 0], [2/9*a, 7/9*a, 0],
                [0, 7/9*a, 2/9*a], [0, 2/9*a, 7/9*a],
                [2/9*a, 0, 7/9*a], [7/9*a, 0, 2/9*a],
                [5/9*a, 2/9*a, 2/9*a],
                [2/9*a, 5/9*a, 2/9*a],
                [2/9*a, 2/9*a, 5/9*a]
            ];
            
            // 定义四边形和三角形
            const quads = [
                [0, 3, 9, 8], [3, 4, 10, 9], [1, 4, 10, 5],
                [5, 6, 11, 10], [2, 7, 11, 6], [7, 8, 9, 11]
            ];
            
            const tri = [9, 10, 11];

            const needsMirror = faceKey === 'top1' || faceKey === 'top3' || faceKey === 'bottom1' || faceKey === 'bottom3';

            let projectedPoints;
            if (isTopFace) {
                projectedPoints = points3D.map(p => {
                    let x = (p[0] - p[1]) * projectionFactor;
                    const y = (p[0] + p[1] - p[2] * 0.5) * projectionFactor;                     
                    if (needsMirror) {
                        x = -x;
                    }
                    
                    return [x, y];
                });
            } else {
                projectedPoints = points3D.map(p => {
                    let x = (p[0] - p[1]) * projectionFactor;
                    const y = (-p[0] - p[1] + p[2] * 0.5) * projectionFactor;
                    if (needsMirror) {
                        x = -x;
                    }
                    
                    return [x, y];
                });
            }
            
            // 调整点位置以适应2D视图，居中显示
            const adjustedPoints = projectedPoints.map(p => [p[0] + 150, p[1] + 150]);
            
            let peripheralIndex = 0;
            
            // 绘制6个四边形外围
            quads.forEach((quad, index) => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const [a, b, c, d] = quad;
                
                const pathData = `M ${adjustedPoints[a][0]} ${adjustedPoints[a][1]} 
                                 L ${adjustedPoints[b][0]} ${adjustedPoints[b][1]} 
                                 L ${adjustedPoints[c][0]} ${adjustedPoints[c][1]} 
                                 L ${adjustedPoints[d][0]} ${adjustedPoints[d][1]} Z`;
                
                path.setAttribute('d', pathData);
                path.setAttribute('class', 'face-piece');
                path.setAttribute('fill', this.colorToHex(colors[peripheralIndex]));
                
                faceGroup.appendChild(path);
                peripheralIndex++;
            });
            
            // 绘制中心三角
            const trianglePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const triangleData = `M ${adjustedPoints[tri[0]][0]} ${adjustedPoints[tri[0]][1]} 
                                 L ${adjustedPoints[tri[1]][0]} ${adjustedPoints[tri[1]][1]} 
                                 L ${adjustedPoints[tri[2]][0]} ${adjustedPoints[tri[2]][1]} Z`;
            
            trianglePath.setAttribute('d', triangleData);
            trianglePath.setAttribute('class', 'face-piece');
            trianglePath.setAttribute('fill', this.colorToHex(colors[6]));            
            faceGroup.appendChild(trianglePath);
        }
        
        updateCornerOctaView() {
            const faceKeys = ['top1', 'top2', 'top3', 'top4', 'bottom1', 'bottom2', 'bottom3', 'bottom4'];
            
            faceKeys.forEach(faceKey => {
                const faceGroup = document.querySelector(`#cornerOcta-twod-container .face-group[data-face="${faceKey}"]`);
                if (!faceGroup) return;
                
                // 清除现有内容
                faceGroup.innerHTML = '';
                
                // 获取面的颜色
                const colors = this.cornerOctaCube.faces[faceKey];
                
                // 创建面的几何结构
                this.createCornerOctaFaceGeometry(faceGroup, faceKey, colors);
            });
        }
        
        createCornerOctaFaceGeometry(faceGroup, faceKey, colors) {
            const isTopFace = faceKey.startsWith('top');
            const scale = RENDER_CONFIG.SVG_SCALE_CORNER;

            // 定义新的10个点的几何结构
            const a = scale;
            const points = [
                [0, 0],                    // 点 1 (索引0)
                [a, 0],                    // 点 2 (索引1)
                [2*a, 0],                  // 点 3 (索引2)
                [3*a, 0],                  // 点 4 (索引3)
                [0.5*a, Math.sqrt(3)/2*a], // 点 5 (索引4)
                [1.5*a, Math.sqrt(3)/2*a], // 点 6 (索引5)
                [2.5*a, Math.sqrt(3)/2*a], // 点 7 (索引6)
                [a, Math.sqrt(3)*a],       // 点 8 (索引7)
                [2*a, Math.sqrt(3)*a],     // 点 9 (索引8)
                [1.5*a, 3*Math.sqrt(3)/2*a] // 点 10 (索引9)
            ];
            
            // 定义9个三角形
            const triangles = [
                [0, 1, 4],  // 三角形1: 1 2 5 (索引从0开始)
                [1, 2, 5],  // 三角形2: 2 3 6
                [2, 3, 6],  // 三角形3: 3 4 7
                [1, 4, 5],  // 三角形4: 2 5 6
                [2, 5, 6],  // 三角形5: 3 6 7
                [4, 5, 7],  // 三角形6: 5 6 8
                [5, 6, 8],  // 三角形7: 6 7 9
                [5, 7, 8],  // 三角形8: 6 8 9
                [7, 8, 9]   // 三角形9: 8 9 10
            ];

            // 根据面的类型确定位置和方向
            let offsetX = 0, offsetY = 0;
            let needsFlip = false;
            
            switch(faceKey) {
                case 'top1': // 蓝色
                    offsetX = 30;
                    offsetY = 400;
                    needsFlip = true;
                    break;
                case 'top2': // 橙色
                    offsetX = 480;
                    offsetY = 400;
                    needsFlip = true;
                    break;
                case 'top3': // 紫色
                    offsetX = 930;
                    offsetY = 400;
                    needsFlip = true;
                    break;
                case 'top4': // 白色
                    offsetX = 1380;
                    offsetY = 400;
                    needsFlip = true;
                    break;
                case 'bottom1': // 灰色
                    offsetX = 30;
                    offsetY = 400;
                    needsFlip = false;
                    break;
                case 'bottom2': // 黄色
                    offsetX = 480;
                    offsetY = 400;
                    needsFlip = false;
                    break;
                case 'bottom3': // 绿色
                    offsetX = 930;
                    offsetY = 400;
                    needsFlip = false;
                    break;
                case 'bottom4': // 红色
                    offsetX = 1380;
                    offsetY = 400;
                    needsFlip = false;
                    break;
            }

            // 调整点位置
            let adjustedPoints = points.map(p => {
                let x = p[0];
                let y = p[1];
                
                if (needsFlip) {
                    y = -y;
                    x = 3*a - x;
                }
                
                return [x + offsetX, y + offsetY];
            });
            
            // 绘制9个三角形
            triangles.forEach((triangle, index) => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const [p1, p2, p3] = triangle;
                
                const pathData = `M ${adjustedPoints[p1][0]} ${adjustedPoints[p1][1]} 
                                 L ${adjustedPoints[p2][0]} ${adjustedPoints[p2][1]} 
                                 L ${adjustedPoints[p3][0]} ${adjustedPoints[p3][1]} Z`;
                
                path.setAttribute('d', pathData);
                path.setAttribute('class', 'face-piece');
                const colorIndex = index < colors.length ? index : index % colors.length;
                path.setAttribute('fill', this.colorToHex(colors[colorIndex]));
                
                faceGroup.appendChild(path);
            });
        }
        
        colorToHex(color) {
            // 将Three.js颜色转换为十六进制
            return '#' + color.toString(16).padStart(6, '0');
        }
        
        // ===== 专业计时器核心功能 =====
        toggleTimer() {
            console.log('toggleTimer called, current state:', this.state.timerState);
            if (this.state.timerState === 'ready') {
                this.startTimer();
            } else if (this.state.timerState === 'inspecting') {
                this.startTimer();
            } else if (this.state.timerState === 'running') {
                this.stopTimer();
            }
        }
        
        startInspection() {
            if (this.state.timerState !== 'ready') return;
            
            this.state.timerState = 'inspecting';
            this.state.inspectionStartTime = Date.now();
            this.state.inspectionPenalty = null; // 重置惩罚状态

            this.elements.timerDisplay.classList.add('inspecting');
            if (this.elements.timerState) {
                this.elements.timerState.textContent = t('inspecting');
                this.elements.timerState.classList.add('inspecting');
            }
            if (this.elements.inspectionTime) {
                this.elements.inspectionTime.style.display = 'block';
                this.elements.inspectionTime.textContent = t('inspectionTime');
            }

            this.elements.fullscreenTimer.classList.add('active');
            this.elements.fullscreenDisplay.classList.add('inspecting');
            this.elements.fullscreenDisplay.innerHTML = '0.0';
            this.elements.fullscreenInfo.textContent = t('observing');
            this.elements.fullscreenHint.textContent = t('clickToStart');

            this.elements.timerStartBtn.innerHTML = '<i class="fas fa-hourglass-half"></i> ' + t('startClick');

            // 播放观察开始声音
            this.playReadySound();
            
            this.startInspectionCountdown();
        }
        
        startInspectionCountdown() {
            if (this.state.timerState !== 'inspecting') return;
            
            const now = Date.now();
            const elapsed = (now - this.state.inspectionStartTime) / 1000;
            
            // 更新显示为正计时
            this.elements.timerDisplay.textContent = elapsed.toFixed(1);
            if (this.elements.inspectionTime) {
                this.elements.inspectionTime.textContent = `观察: ${elapsed.toFixed(1)}s`;
            }
            this.elements.fullscreenDisplay.textContent = elapsed.toFixed(1);

            // 检查超时惩罚
            if (elapsed > 17 && this.state.inspectionPenalty !== 'DNF') {
                this.state.inspectionPenalty = 'DNF';
                if (this.elements.timerState) {
                    this.elements.timerState.textContent = t('inspectionDNF');
                    this.elements.timerState.style.color = 'var(--danger-color)';
                }
                this.elements.fullscreenInfo.textContent = t('inspectionDNF');
                this.showNotification(t('inspectionTimeoutDNF'));

                // 显示DNF成绩
                this.elements.timerDisplay.innerHTML = '<span class="dnf">DNF</span>';
                this.elements.fullscreenDisplay.innerHTML = '<span class="dnf">DNF</span>';

                // 保存DNF成绩并准备下一个打乱
                setTimeout(() => {
                    this.saveTime(null, 'DNF'); // 保存DNF成绩
                    this.prepareNextScramble(); // 准备下一个打乱
                    this.resetTimer(); // 重置计时器状态
                    this.showNotification(t('dnfRecorded'));
                }, 1500); // 延迟1.5秒让用户看到DNF提示
                
                return; // 停止继续计时
            } else if (elapsed > 15 && this.state.inspectionPenalty !== '+2' && this.state.inspectionPenalty !== 'DNF') {
                this.state.inspectionPenalty = '+2';
                if (this.elements.timerState) {
                    this.elements.timerState.textContent = t('inspectionPlus2');
                    this.elements.timerState.style.color = 'var(--accent-color)';
                }
                this.elements.fullscreenInfo.textContent = t('inspectionPlus2');
                this.showNotification(t('inspectionTimeoutPlus2'));
                // 播放惩罚声音
                this.playPenaltySound();
            }
            
            // 8秒和12秒时间提示音
            if (elapsed >= TIMER_WARNING.TIME_8S && elapsed < TIMER_WARNING.TIME_8S + 0.1) {
                this.playEightSecondSound();
            } else if (elapsed >= TIMER_WARNING.TIME_12S && elapsed < TIMER_WARNING.TIME_12S + 0.1) {
                this.playTwelveSecondSound();
            }
            
            // 只有在没有DNF的情况下继续计时
            if (this.state.inspectionPenalty !== 'DNF') {
                this.state.inspectionCountdownTimer = setTimeout(() => this.startInspectionCountdown(), 100);
            }
        }
        
        startTimer() {
            if (this.state.timerState !== 'ready' && this.state.timerState !== 'inspecting') return;

            // 如果是观察状态，清除观察计时器
            if (this.state.timerState === 'inspecting') {
                clearTimeout(this.state.inspectionCountdownTimer);
                if (this.elements.inspectionTime) {
                    this.elements.inspectionTime.style.display = 'none';
                }
            }

            this.state.timerState = 'running';
            this.state.startTime = Date.now();
            this.state.lastUpdateTime = this.state.startTime;

            this.elements.timerDisplay.classList.remove('inspecting');
            this.elements.timerDisplay.classList.add('running');
            if (this.elements.timerState) {
                this.elements.timerState.textContent = t('running');
                this.elements.timerState.classList.remove('inspecting');
                this.elements.timerState.classList.add('running');
            }
            
            this.elements.fullscreenDisplay.classList.remove('inspecting');
            this.elements.fullscreenDisplay.innerHTML = '0.000';
            this.elements.fullscreenInfo.textContent = '';
            this.elements.fullscreenHint.textContent = t('clickToStop');
            
            // 播放计时开始声音
            this.playStartSound();
            
            this.updateTimer();
        }
        
        updateTimer() {
            if (this.state.timerState !== 'running') return;
            
            const now = Date.now();
            const elapsed = now - this.state.startTime;
            const time = elapsed / 1000;
            
            // 保存当前时间戳，确保stopTimer使用相同的基准
            this.state.lastUpdateTime = now;
            
            this.elements.timerDisplay.innerHTML = this.formatTime(time);
            this.elements.fullscreenDisplay.innerHTML = this.formatTime(time);
            
            this.state.animationFrame = requestAnimationFrame(() => this.updateTimer());
        }
        
        stopTimer() {
            console.log('=== stopTimer 开始 ===');
            console.log('当前计时状态:', this.state.timerState);
            if (this.state.timerState !== 'running') {
                console.log('计时器未在运行，退出');
                return;
            }

            // 使用最后一次更新的时间戳，确保与显示时间一致
            const elapsed = this.state.lastUpdateTime ? this.state.lastUpdateTime - this.state.startTime : Date.now() - this.state.startTime;
            let time = elapsed / 1000;
            let penalty = '';
            console.log('计算时间:', time, '惩罚:', penalty);

            // 应用观察时间惩罚
            if (this.state.inspectionPenalty === 'DNF') {
                time = null; // DNF成绩
                penalty = 'DNF';
            } else if (this.state.inspectionPenalty === '+2') {
                time += 2; // 加2秒惩罚
                penalty = '+2'; // 用于显示格式
            }
            console.log('应用惩罚后 - time:', time, 'penalty:', penalty);

            cancelAnimationFrame(this.state.animationFrame);

            this.state.timerState = 'ready';

            // 重置计时器显示状态
            this.elements.timerDisplay.classList.remove('running');
            this.elements.timerDisplay.classList.remove('inspecting');
            if (this.elements.timerState) {
                this.elements.timerState.textContent = '准备计时';
                this.elements.timerState.classList.remove('running');
                this.elements.timerState.classList.remove('inspecting');
                this.elements.timerState.style.color = ''; // 重置颜色
            }

            // 隐藏观察时间显示
            if (this.elements.inspectionTime) {
                this.elements.inspectionTime.style.display = 'none';
            }

            // 退出全屏计时器
            this.elements.fullscreenTimer.classList.remove('active');
            this.elements.fullscreenDisplay.classList.remove('inspecting');
            this.elements.fullscreenDisplay.classList.remove('ready-to-start');
            if (this.elements.escHint) {
                this.elements.escHint.classList.remove('show');
            }

            // 重置按钮文本
            if (this.elements.timerStartBtn) {
                this.elements.timerStartBtn.innerHTML = '<i class="fas fa-play"></i> ' + t('start');
            }

            // 重置全屏显示
            if (this.elements.fullscreenDisplay) {
                this.elements.fullscreenDisplay.innerHTML = '0.000';
            }

            // 播放计时停止声音
            this.playStopSound();

            // 重置长按相关状态变量，防止在计时停止后立即开始新计时
            this.isLongPress = false;
            this.spaceIsLongPress = false;
            this.fullscreenIsLongPress = false;

            // 重置按键状态标记
            this.spaceKeyPressed = false;

            // 保存时间
            console.log('即将调用 saveTime');
            this.saveTime(time, penalty);
            console.log('saveTime 调用完成');

            // 准备下一个打乱（这里会更新计数器并生成新打乱）
            this.prepareNextScramble();
            console.log('=== stopTimer 结束 ===');
        }
        
        exitFullscreen() {
            // 移除全屏计时器的active类
            this.elements.fullscreenTimer.classList.remove('active');
            
            // 重置全屏显示的CSS类
            this.elements.fullscreenDisplay.classList.remove('inspecting');
            this.elements.fullscreenDisplay.classList.remove('ready-to-start');
            
            // 隐藏ESC提示
            if (this.elements.escHint) {
                this.elements.escHint.classList.remove('show');
            }
            
            // 重置全屏显示内容
            this.elements.fullscreenDisplay.innerHTML = '0.000';
        }
        
        resetTimer() {
            if (this.state.timerState === 'running') {
                cancelAnimationFrame(this.state.animationFrame);
            }

            clearTimeout(this.state.inspectionCountdownTimer);

            this.state.timerState = 'ready';
            this.state.inspectionPenalty = null; // 重置惩罚状态
            this.state.lastUpdateTime = null; // 重置最后更新时间

            // 重置计时器显示
            this.elements.timerDisplay.innerHTML = '0.000';
            this.elements.timerDisplay.classList.remove('inspecting');
            this.elements.timerDisplay.classList.remove('running');
            
            if (this.elements.timerState) {
                this.elements.timerState.textContent = '准备计时';
                this.elements.timerState.classList.remove('inspecting');
                this.elements.timerState.classList.remove('running');
                this.elements.timerState.style.color = ''; // 重置颜色
            }
            
            // 隐藏观察时间显示
            if (this.elements.inspectionTime) {
                this.elements.inspectionTime.style.display = 'none';
            }
            
            // 退出全屏计时器
            this.elements.fullscreenTimer.classList.remove('active');
            this.elements.fullscreenDisplay.classList.remove('inspecting');
            this.elements.fullscreenDisplay.classList.remove('ready-to-start');
            this.elements.fullscreenDisplay.innerHTML = '0.000';
            if (this.elements.escHint) {
                this.elements.escHint.classList.remove('show');
            }
            
            // 重置按钮文本
            this.elements.timerStartBtn.innerHTML = '<i class="fas fa-play"></i> ' + t('start');
            
            this.showNotification(t('resetDone'));
        }
        
        /**
 * 格式化时间为HTML格式（用于显示）
 * @param {number|null} seconds - 秒数
 * @param {string} penalty - 惩罚类型（''、'+2'、'DNF'）
 * @returns {string} 格式化后的时间字符串，格式为 mm:ss.000
 */
        formatTime(seconds, penalty = '') {
            if (seconds === null) {
                return '<span class="dnf">DNF</span>';
            }

            const numSeconds = parseFloat(seconds);
            if (isNaN(numSeconds)) {
                return '<span class="dnf">DNF</span>';
            }

            const minutes = Math.floor(numSeconds / 60);
            const secs = numSeconds % 60;

            // 格式化为 mm:ss.000 格式
            const secsStr = secs.toFixed(3);
            const [integerPart, decimalPart = '000'] = secsStr.split('.');
            const paddedInteger = integerPart.padStart(2, '0');
            const timeStr = `${minutes}:${paddedInteger}.${decimalPart}`;

            if (penalty === 'DNF') {
                return '<span class="dnf">DNF</span>';
            } else if (penalty === '+2') {
                return timeStr + `<span class="penalty">(+2)</span>`;
            }

            return timeStr;
        }

        /**
 * 格式化时间为纯文本格式（用于导出CSV）
 * @param {number|null} seconds - 秒数
 * @param {string} penalty - 惩罚类型（''、'+2'、'DNF'）
 * @returns {string} 格式化后的时间字符串，格式为 mm:ss.000
 */
        formatTimePlain(seconds, penalty = '') {
            if (seconds === null) {
                return 'DNF';
            }

            const numSeconds = parseFloat(seconds);
            if (isNaN(numSeconds)) {
                return 'DNF';
            }

            const minutes = Math.floor(numSeconds / 60);
            const secs = numSeconds % 60;

            // 格式化为 mm:ss.000 格式
            const secsStr = secs.toFixed(3);
            const [integerPart, decimalPart = '000'] = secsStr.split('.');
            const paddedInteger = integerPart.padStart(2, '0');
            const timeStr = `${minutes}:${paddedInteger}.${decimalPart}`;

            if (penalty === 'DNF') {
                return 'DNF';
            } else if (penalty === '+2') {
                return timeStr + '(+2)';
            }

            return timeStr;
        }
        
        // ===== 时间记录存储管理 =====
        saveTime(time, penalty = '') {
            console.log('=== saveTime 开始 ===');
            console.log('传入参数 - time:', time, 'penalty:', penalty);
            const currentNumber = this.getCurrentCounter();
            console.log('当前序号:', currentNumber);

            const timeRecord = {
                number: currentNumber,
                time: time,
                penalty: penalty,
                scramble: this.getScrambleText(),
                cubeType: this.state.currentCubeType,
                timestamp: Date.now()
            };
            console.log('创建的记录:', timeRecord);

            // 使用通用方法获取当前时间记录数组
            const currentTimes = this.getCurrentTimes();
            console.log('当前记录数组长度:', currentTimes.length);
            currentTimes.unshift(timeRecord);
            console.log('添加后记录数组长度:', currentTimes.length);

            // 限制记录数量
            if (currentTimes.length > HISTORY_LIMITS.TIME_RECORDS) {
                currentTimes.splice(1000);
            }

            // 更新计数器显示
            this.updateScrambleCounterDisplay();

            this.updateStats();
            this.updateTimesList();
            this.saveTimeRecords();

            const timeDisplay = time !== null ? this.formatTime(time, penalty) : 'DNF';
            // 创建临时元素来获取纯文本内容
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = timeDisplay;
            const plainText = tempDiv.textContent || tempDiv.innerText || 'DNF';
            this.showNotification(`记录时间: ${plainText}`);
            console.log('=== saveTime 结束 ===');
        }
        
        getScrambleText() {
            const generator = this.scrambleGenerators.get(this.state.currentCubeType);
            if (generator && generator.getScrambleText) {
                return generator.getScrambleText(this.state.currentScramble);
            }
            return typeof this.state.currentScramble === 'string' 
                ? this.state.currentScramble 
                : this.state.currentScramble.join(' ');
        }
        
        updateTimesList() {
            const timesList = this.elements.historyTimesList;
            if (!timesList) return; // 如果元素不存在，直接返回

            timesList.innerHTML = '';

            // 获取当前模式的时间记录
            const currentTimes = this.getCurrentTimes();

            if (currentTimes.length === 0) {
                timesList.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">暂无时间记录</div>';
                return;
            }

            currentTimes.forEach((record, index) => {
                const timeRecord = document.createElement('div');
                timeRecord.className = 'history-time-item';

                // 为DNF记录添加特殊样式
                if (record.time === null) {
                    timeRecord.classList.add('dnf-record');
                }

                // 添加右击事件
                timeRecord.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.showRecordContextMenu(e, record, index);
                });

                // 添加双击事件（移动端）
                let lastTapTime = 0;
                timeRecord.addEventListener('touchend', (e) => {
                    const currentTime = new Date().getTime();
                    const tapLength = currentTime - lastTapTime;

                    if (tapLength < 300 && tapLength > 0) {
                        // 双击检测成功（两次点击间隔小于300ms）
                        e.preventDefault();
                        this.showRecordContextMenu(e, record, index);
                    }

                    lastTapTime = currentTime;
                });

                timeRecord.innerHTML = `
                    <div class="history-time-number">#${record.number}</div>
                    <div class="history-time-value">${this.formatTime(record.time, record.penalty)}</div>
                `;

                timesList.appendChild(timeRecord);
            });
        }
        
        clearTimes() {
            const cubeTypeName = this.state.currentCubeType === 'corner' ? t('cornerCubeFull') : t('twinOctahedronFull');
            if (confirm(`确定要清空${cubeTypeName}的所有时间记录吗？`)) {
                // 清空当前模式的时间记录
                const currentTimes = this.getCurrentTimes();
                currentTimes.length = 0;
                
                // 重置当前模式的计数器
                this.setCurrentCounter(1);
                
                // 更新显示的序号
                this.updateScrambleCounterDisplay();
                this.updateTimesList();
                this.updateStats();
                this.saveTimeRecords();
            }
        }
        
        // 清除当前魔方类型的数据
        clearAllData() {
            const cubeTypeNameMap = {
                'corner': t('cornerCubeFull'),
                'cornerOcta': t('cornerOctahedronFull'),
                'octahedron': t('twinOctahedronFull'),
                'twinOctahedron': t('twinOctahedron2x2Full')
            };
            const cubeTypeName = cubeTypeNameMap[this.state.currentCubeType] || t('cornerCubeFull');
            
            if (confirm(`确定要清空${cubeTypeName}的所有数据吗？此操作不可恢复！`)) {
                // 清空当前魔方类型的时间记录
                const currentTimes = this.getCurrentTimes();
                currentTimes.length = 0;
                
                // 重置当前魔方类型的计数器
                this.setCurrentCounter(1);
                
                // 更新显示
                this.updateScrambleCounterDisplay();
                this.updateTimesList();
                this.updateStats();
                this.saveTimeRecords();
                
                // 生成新的打乱
                this.generateNewScramble();
                
                this.showNotification(`${cubeTypeName}数据已清空`);
            }
        }

        // ===== 成绩记录修改功能 =====

        /**
 * 显示成绩记录的右击菜单
 * @param {Event} event - 触发事件
 * @param {Object} record - 成绩记录对象
 * @param {number} index - 记录在数组中的索引
 */
        showRecordContextMenu(event, record, index) {
            // 防止菜单重复弹出
            this.hideRecordContextMenu();

            // 创建菜单容器
            const menu = document.createElement('div');
            menu.className = 'record-context-menu';
            menu.id = 'recordContextMenu';

            // 创建菜单项
            const menuItems = [
                {
                    label: t('setPlus2'),
                    action: () => this.modifyRecordToPlus2(index)
                },
                {
                    label: t('setDNF'),
                    action: () => this.modifyRecordToDNF(index)
                },
                {
                    label: t('clearPenalty'),
                    action: () => this.clearRecordPenalty(index)
                },
                {
                    label: t('deleteRecord'),
                    action: () => this.deleteRecord(index),
                    danger: true
                }
            ];

            menuItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'context-menu-item';
                if (item.danger) {
                    menuItem.classList.add('danger');
                }
                menuItem.textContent = item.label;
                menuItem.addEventListener('click', () => {
                    item.action();
                    this.hideRecordContextMenu();
                });
                menu.appendChild(menuItem);
            });

            // 先添加到文档以获取实际尺寸
            menu.style.visibility = 'hidden';
            menu.style.position = 'fixed';
            menu.style.zIndex = '10000';
            document.body.appendChild(menu);

            // 获取菜单的实际尺寸
            const menuRect = menu.getBoundingClientRect();
            const menuWidth = menuRect.width;
            const menuHeight = menuRect.height;

            // 获取点击位置
            const x = event.clientX || event.touches?.[0]?.clientX;
            const y = event.clientY || event.touches?.[0]?.clientY;

            // 智能定位：确保菜单不会超出屏幕边界
            let posX = x;
            let posY = y;

            // 检查右边界
            if (x + menuWidth > window.innerWidth) {
                posX = window.innerWidth - menuWidth - 10; // 距离右边界10px
            }

            // 检查左边界
            if (posX < 10) {
                posX = 10; // 距离左边界10px
            }

            // 检查下边界
            if (y + menuHeight > window.innerHeight) {
                posY = y - menuHeight; // 向上显示
            }

            // 检查上边界
            if (posY < 10) {
                posY = 10; // 距离上边界10px
            }

            // 应用最终位置
            menu.style.left = `${posX}px`;
            menu.style.top = `${posY}px`;
            menu.style.visibility = 'visible';

            // 点击其他地方关闭菜单
            setTimeout(() => {
                document.addEventListener('click', this.hideRecordContextMenu, { once: true });
            }, 0);
        }

        /**
 * 隐藏右击菜单
 */
        hideRecordContextMenu() {
            const menu = document.getElementById('recordContextMenu');
            if (menu) {
                menu.remove();
            }
        }

        /**
 * 修改成绩为 +2
 * @param {number} index - 记录索引
 */
        modifyRecordToPlus2(index) {
            const currentTimes = this.getCurrentTimes();
            if (index < 0 || index >= currentTimes.length) return;

            const record = currentTimes[index];

            // 如果已经是DNF，先恢复原始时间
            if (record.time === null) {
                // DNF无法加2，先清除惩罚
                this.clearRecordPenalty(index);
                return;
            }

            // 如果已经是+2，则清除惩罚
            if (record.penalty === '+2') {
                record.penalty = '';
            } else {
                record.penalty = '+2';
                record.time += 2; // 加2秒
            }

            this.updateTimesList();
            this.updateStats();
            this.saveTimeRecords();
            this.showNotification(t('modifiedPlus2'));
        }

        /**
 * 修改成绩为 DNF
 * @param {number} index - 记录索引
 */
        modifyRecordToDNF(index) {
            const currentTimes = this.getCurrentTimes();
            if (index < 0 || index >= currentTimes.length) return;

            const record = currentTimes[index];

            // 保存原始时间（如果还没有保存）
            if (!record.originalTime && record.time !== null) {
                record.originalTime = record.time;
            }

            record.time = null;
            record.penalty = 'DNF';

            this.updateTimesList();
            this.updateStats();
            this.saveTimeRecords();
            this.showNotification(t('modifiedDNF'));
        }

        /**
 * 清除成绩惩罚
 * @param {number} index - 记录索引
 */
        clearRecordPenalty(index) {
            const currentTimes = this.getCurrentTimes();
            if (index < 0 || index >= currentTimes.length) return;

            const record = currentTimes[index];

            // 如果是DNF，恢复原始时间
            if (record.penalty === 'DNF' && record.originalTime !== undefined) {
                record.time = record.originalTime;
                delete record.originalTime;
            } else if (record.penalty === '+2') {
                // 如果是+2，减去2秒
                record.time -= 2;
            }

            record.penalty = '';

            this.updateTimesList();
            this.updateStats();
            this.saveTimeRecords();
            this.showNotification(t('penaltyCleared'));
        }

        /**
 * 删除成绩记录
 * @param {number} index - 记录索引
 */
        deleteRecord(index) {
            const currentTimes = this.getCurrentTimes();
            if (index < 0 || index >= currentTimes.length) return;

            const record = currentTimes[index];
            const timeDisplay = record.time !== null ? this.formatTime(record.time, record.penalty) : 'DNF';

            if (confirm(t('confirmDelete').replace('{number}', record.number).replace('{time}', timeDisplay))) {
                currentTimes.splice(index, 1);

                this.updateTimesList();
                this.updateStats();
                this.saveTimeRecords();
                this.showNotification(t('recordDeleted'));
            }
        }

        // ===== AO平均值算法实现 =====
        calculateAO(times, windowSize) {
            // AO计算规则
            const aoRules = {
                5: { removeCount: 1, validCount: 3 },
                12: { removeCount: 2, validCount: 8 },
                50: { removeCount: 5, validCount: 40 },
                100: { removeCount: 10, validCount: 80 }
            };
            
            const rule = aoRules[windowSize];
            if (!rule || times.length < windowSize) return null;
            
            const windowRecords = times.slice(0, windowSize);
            const validTimes = windowRecords.filter(record => record.time !== null);
            const dnfCount = windowRecords.length - validTimes.length;
            
            // DNF处理：1次DNF作为最差成绩舍去，2次及以上DNF则整个AO为DNF
            if (dnfCount >= 2) return null; // DNF
            if (dnfCount === 1) {
                // 1次DNF，移除DNF和1个最差有效成绩
                const sortedValid = validTimes.map(record => record.time).sort((a, b) => a - b);
                sortedValid.pop(); // 移除最差有效成绩
                const sum = sortedValid.reduce((a, b) => a + b, 0);
                return sum / sortedValid.length;
            }
            
            // 无DNF，按照规则移除最大值和最小值
            const sortedTimes = validTimes.map(record => record.time).sort((a, b) => a - b);
            const removeCount = rule.removeCount;
            const effectiveTimes = sortedTimes.slice(removeCount, sortedTimes.length - removeCount);
            
            const sum = effectiveTimes.reduce((a, b) => a + b, 0);
            return sum / effectiveTimes.length;
        }
        
        calculateBestAO(times, windowSize) {
            if (times.length < windowSize) return null;
            
            let bestAverage = Infinity;
            let bestStartIndex = -1;
            
            // 计算所有可能的滚动窗口
            for (let i = 0; i <= times.length - windowSize; i++) {
                const windowRecords = times.slice(i, i + windowSize);
                const average = this.calculateAO(windowRecords, windowSize);
                if (average !== null && average < bestAverage) {
                    bestAverage = average;
                    bestStartIndex = i;
                }
            }
            
            return bestAverage === Infinity ? null : bestAverage;
        }
        
        /**
 * 兼容旧代码的滚动平均计算方法
 * @param {Array} times - 时间记录数组
 * @param {number} windowSize - 窗口大小
 * @returns {number|null} 平均值
 */
        calculateRollingAverage(times, windowSize) {
            return this.calculateAO(times, windowSize);
        }

        /**
 * 计算简单平均值（旧版兼容）
 * @param {Array} times - 时间记录数组
 * @returns {number} 平均值
 */
        calculateAverage(times) {
            if (times.length < 3) return 0;

            const sorted = [...times].sort((a, b) => a - b);
            sorted.pop(); // 移除最大值
            sorted.shift(); // 移除最小值

            const sum = sorted.reduce((a, b) => a + b, 0);
            return sum / sorted.length;
        }

        // ===== 统计数据分析与显示 =====

        /**
 * 更新所有统计数据和显示
 * - 当前成绩
 * - 当前AO5/AO12/AO50/AO100
 * - 最佳成绩
 * - 最佳AO5/AO12/AO50/AO100
 * - 历史成绩列表
 */
        updateStats() {
            const currentTimes = this.getCurrentTimes();

            // 更新当前成绩
            if (currentTimes.length > 0) {
                const currentRecord = currentTimes[0];
                this.elements.currentTime.innerHTML = this.formatTime(currentRecord.time, currentRecord.penalty);
            } else {
                this.elements.currentTime.textContent = '--';
            }

            // 更新当前AO统计
            const currentAo5 = this.calculateAO(currentTimes, 5);
            const currentAo12 = this.calculateAO(currentTimes, 12);
            const currentAo50 = this.calculateAO(currentTimes, 50);
            const currentAo100 = this.calculateAO(currentTimes, 100);

            this.elements.currentAo5.innerHTML = currentAo5 !== null ? this.formatTime(currentAo5) : '--';
            this.elements.currentAo12.innerHTML = currentAo12 !== null ? this.formatTime(currentAo12) : '--';
            this.elements.currentAo50.innerHTML = currentAo50 !== null ? this.formatTime(currentAo50) : '--';
            this.elements.currentAo100.innerHTML = currentAo100 !== null ? this.formatTime(currentAo100) : '--';

            // 更新最佳时间（排除DNF成绩）
            const validTimes = currentTimes.filter(t => t.time !== null);
            if (validTimes.length > 0) {
                const bestRecord = validTimes.reduce((best, current) =>
                    current.time < best.time ? current : best
                );
                this.elements.bestTime.innerHTML = this.formatTime(bestRecord.time, bestRecord.penalty);
            } else {
                this.elements.bestTime.textContent = '--';
            }
            
            // 最佳AO统计
            const bestAo5 = this.calculateBestAO(currentTimes, 5);
            const bestAo12 = this.calculateBestAO(currentTimes, 12);
            const bestAo50 = this.calculateBestAO(currentTimes, 50);
            const bestAo100 = this.calculateBestAO(currentTimes, 100);
            
            this.elements.bestAo5.innerHTML = bestAo5 !== null ? this.formatTime(bestAo5) : '--';
            this.elements.bestAo12.innerHTML = bestAo12 !== null ? this.formatTime(bestAo12) : '--';
            this.elements.bestAo50.innerHTML = bestAo50 !== null ? this.formatTime(bestAo50) : '--';
            this.elements.bestAo100.innerHTML = bestAo100 !== null ? this.formatTime(bestAo100) : '--';
            
            // 兼容旧代码
            if (this.elements.bestRollingAo5) {
                this.elements.bestRollingAo5.innerHTML = bestAo5 !== null ? this.formatTime(bestAo5) : '--';
            }
            if (this.elements.bestRollingAo12) {
                this.elements.bestRollingAo12.innerHTML = bestAo12 !== null ? this.formatTime(bestAo12) : '--';
            }
            
            // 更新历史成绩记录区
            this.updateHistoryTimesList(currentTimes);
        }
        
        // 更新历史成绩记录区
        updateHistoryTimesList(times) {
            const historyList = document.getElementById('historyTimesList');
            const historySummary = document.getElementById('historySummary');
            
            if (!historyList || !historySummary) return;
            
            // 清空列表
            historyList.innerHTML = '';
            
            // 更新摘要信息
            const count = times.length;
            let averageTime = '--';
            if (count > 0) {
                const validTimes = times.filter(t => t.time !== null);
                if (validTimes.length > 0) {
                    const totalTime = validTimes.reduce((sum, t) => sum + t.time, 0);
                    averageTime = this.formatTime(totalTime / validTimes.length);
                }
            }
            historySummary.textContent = `${t('count')}: ${count} | ${t('average')}: ${averageTime}`;
            
            // times数组是倒序的：times[0]是最新的，times[count-1]是最早的
            // 用户要求：最下面显示#1（最早的记录），最上面显示最新的序号
            
            // 使用文档片段提高性能
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < count; i++) {
                const record = times[i];
                const item = document.createElement('div');
                item.className = 'history-time-item';

                // 序号从count开始递减到1
                // - i=0（第一行，最新）→ 序号count
                // - i=1（第二行）→ 序号count-1
                // - i=count-1（最后一行，最早）→ 序号1
                const displayNumber = count - i;

                const numberSpan = document.createElement('span');
                numberSpan.className = 'history-time-number';
                numberSpan.textContent = `#${displayNumber}`;

                const valueSpan = document.createElement('span');
                valueSpan.className = 'history-time-value';
                valueSpan.innerHTML = this.formatTime(record.time, record.penalty);

                item.appendChild(numberSpan);
                item.appendChild(valueSpan);

                // 添加右击事件
                item.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.showRecordContextMenu(e, record, i);
                });

                // 添加双击事件（移动端）
                let lastTapTime = 0;
                item.addEventListener('touchend', (e) => {
                    const currentTime = new Date().getTime();
                    const tapLength = currentTime - lastTapTime;

                    if (tapLength < 300 && tapLength > 0) {
                        // 双击检测成功（两次点击间隔小于300ms）
                        e.preventDefault();
                        this.showRecordContextMenu(e, record, i);
                    }

                    lastTapTime = currentTime;
                });

                fragment.appendChild(item);
            }
            
            // 一次性添加所有元素
            historyList.appendChild(fragment);
        }
        
        // ===== 数据导出与备份功能 =====
        // 导出所有成绩为CSV格式
        exportAllResults() {
            const currentTimes = this.getCurrentTimes();

            if (currentTimes.length === 0) {
                this.showNotification(t('noExportRecords'));
                return;
            }

            const cubeTypeNameMap = {
                'corner': t('cornerCubeFull'),
                'cornerOcta': t('cornerOctahedronFull'),
                'octahedron': t('twinOctahedronFull'),
                'twinOctahedron': t('twinOctahedron2x2Full')
            };
            const cubeTypeName = cubeTypeNameMap[this.state.currentCubeType] || '未知魔方';

            // CSV头部
            let csvContent = t('csvHeader') + '\n';

            // 为每条记录计算AO值
            // currentTimes是倒序的：times[0]是最新的，times[count-1]是最早的
            // record.number是原始序号，从1开始（最早的是1，最新的是count）
            currentTimes.forEach((record, index) => {
                // 获取每次成绩（使用纯文本格式），添加单引号强制Excel识别为文本
                const timeText = "'" + this.formatTimePlain(record.time, record.penalty);

                // 计算AO5：从当前成绩开始向前数5个
                // 如果当前是第X条，则取第X-4到第X条（如果X>=5）
                let ao5 = '';
                if (record.number >= 5) {
                    // 在倒序数组中，找到第X条的位置
                    // 第X条在倒序数组中的索引是：currentTimes.length - X
                    const targetIndex = currentTimes.length - record.number;
                    // 取从targetIndex到targetIndex+4的元素（倒序中是向前数）
                    // 实际上我们需要取的是：第X-4、X-3、X-2、X-1、X条
                    // 在倒序数组中，这些是索引：length-(X-4), length-(X-3), ..., length-X
                    // 即：length-X+4, length-X+3, length-X+2, length-X+1, length-X
                    const startIndex = currentTimes.length - record.number;
                    const windowRecords = currentTimes.slice(startIndex, startIndex + 5);
                    const hasDNF = windowRecords.some(r => r.time === null);
                    if (!hasDNF) {
                        const ao5Value = this.calculateAO(windowRecords, 5);
                        if (ao5Value !== null) {
                            ao5 = "'" + this.formatTimePlain(ao5Value);
                        }
                    }
                }

                // 计算AO12
                let ao12 = '';
                if (record.number >= 12) {
                    const startIndex = currentTimes.length - record.number;
                    const windowRecords = currentTimes.slice(startIndex, startIndex + 12);
                    const hasDNF = windowRecords.some(r => r.time === null);
                    if (!hasDNF) {
                        const ao12Value = this.calculateAO(windowRecords, 12);
                        if (ao12Value !== null) {
                            ao12 = "'" + this.formatTimePlain(ao12Value);
                        }
                    }
                }

                // 计算AO50
                let ao50 = '';
                if (record.number >= 50) {
                    const startIndex = currentTimes.length - record.number;
                    const windowRecords = currentTimes.slice(startIndex, startIndex + 50);
                    const hasDNF = windowRecords.some(r => r.time === null);
                    if (!hasDNF) {
                        const ao50Value = this.calculateAO(windowRecords, 50);
                        if (ao50Value !== null) {
                            ao50 = "'" + this.formatTimePlain(ao50Value);
                        }
                    }
                }

                // 计算AO100
                let ao100 = '';
                if (record.number >= 100) {
                    const startIndex = currentTimes.length - record.number;
                    const windowRecords = currentTimes.slice(startIndex, startIndex + 100);
                    const hasDNF = windowRecords.some(r => r.time === null);
                    if (!hasDNF) {
                        const ao100Value = this.calculateAO(windowRecords, 100);
                        if (ao100Value !== null) {
                            ao100 = "'" + this.formatTimePlain(ao100Value);
                        }
                    }
                }

                // CSV行（将打乱公式中的逗号替换为分号）
                const scramble = record.scramble.replace(/,/g, '；');
                csvContent += `${record.number},"${scramble}","${timeText}","${ao5}","${ao12}","${ao50}","${ao100}"\n`;
            });

            // 生成文件名
            const now = new Date();
            const timestamp = now.getFullYear() +
                             (now.getMonth() + 1).toString().padStart(2, '0') +
                             now.getDate().toString().padStart(2, '0') + '_' +
                             now.getHours().toString().padStart(2, '0') +
                             now.getMinutes().toString().padStart(2, '0') +
                             now.getSeconds().toString().padStart(2, '0');

            const filename = `${cubeTypeName}_${t('exportResults')}_${timestamp}.csv`;
            
            // 添加BOM头以支持中文显示
            const bom = '\uFEFF';
            this.downloadFile(filename, bom + csvContent, 'text/csv;charset=utf-8;');
            this.showNotification(t('csvExported'));
        }

        exportBestAo(windowSize) {
            const currentTimes = this.getCurrentTimes();
            
            if (currentTimes.length < windowSize) {
                this.showNotification(t('notEnoughRecords').replace('{count}', windowSize));
                return;
            }
            
            const bestAo = this.findBestRollingAverage(currentTimes, windowSize);
            
            if (!bestAo) {
                this.showNotification(t('noValidAo'));
                return;
            }
            
            const cubeTypeNameMap = {
                'corner': t('cornerCubeFull'),
                'cornerOcta': t('cornerOctahedronFull'),
                'octahedron': t('twinOctahedronFull'),
                'twinOctahedron': t('twinOctahedron2x2Full')
            };
            const cubeTypeName = cubeTypeNameMap[this.state.currentCubeType] || t('unknownCube');
            let exportContent = `${cubeTypeName} - ${t('exportAo')}${windowSize}${t('exportScramblesFile')}${t('exportText')}\n`;
            exportContent += '='.repeat(30) + '\n';
            
            // 显示计算规则
            const rules = {
                5: 'ao5Desc',
                12: 'ao12Desc',
                50: 'ao50Desc',
                100: 'ao100Desc'
            };
            
            exportContent += `${t('calcRule')}: ${t(rules[windowSize])}\n`;
            
            // 使用纯文本格式获取平均时间
            const avgTimeText = this.formatTimePlain(bestAo.average);
            exportContent += `${t('averageTime')}: ${avgTimeText}\n`;
            exportContent += '='.repeat(30) + '\n\n';
            
            bestAo.numbers.forEach((number, index) => {
                const record = currentTimes.find(t => t.number === number);
                if (record) {
                    const timeText = this.formatTimePlain(record.time, record.penalty);
                    exportContent += `#${record.number} ${timeText} - ${record.scramble}\n`;
                }
            });
            
            const now = new Date();
            const timestamp = now.getFullYear() + 
                             (now.getMonth() + 1).toString().padStart(2, '0') + 
                             now.getDate().toString().padStart(2, '0') + '_' +
                             now.getHours().toString().padStart(2, '0') + 
                             now.getMinutes().toString().padStart(2, '0') + 
                             now.getSeconds().toString().padStart(2, '0');
            
            const filename = `${cubeTypeName}_${t('exportAo')}${windowSize}_${timestamp}.txt`;
            
            // 添加BOM头以支持中文显示
            const bom = '\uFEFF';
            this.downloadFile(filename, bom + exportContent);
            this.showNotification(t('bestAoExported').replace('{ao}', windowSize));
        }
        
        // 保留旧方法以兼容旧代码
        exportBestAo5() {
            this.exportBestAo(5);
        }
        
        exportBestAo12() {
            this.exportBestAo(12);
        }
        
        findBestRollingAverage(records, windowSize) {
            if (records.length < windowSize) return null;
            
            let bestAverage = Infinity;
            let bestStartIndex = -1;
            
            // 计算所有可能的滚动窗口
            for (let i = 0; i <= records.length - windowSize; i++) {
                const windowRecords = records.slice(i, i + windowSize);
                // 检查窗口中是否有DNF成绩
                const hasDNF = windowRecords.some(record => record.time === null);
                if (hasDNF) continue; // 跳过包含DNF的窗口
                
                const windowTimes = windowRecords.map(record => record.time);
                const average = this.calculateAverage(windowTimes);
                if (average < bestAverage) {
                    bestAverage = average;
                    bestStartIndex = i;
                }
            }
            
            return bestAverage === Infinity ? null : {
                average: bestAverage,
                records: records.slice(bestStartIndex, bestStartIndex + windowSize),
                numbers: records
                    .slice(bestStartIndex, bestStartIndex + windowSize)
                    .map(t => t.number)
            };
        }
        
        generateMultipleScrambles() {
            if (!this.elements.generateCount || !this.elements.startNumber) {
                console.error('generateCount or startNumber element not found');
                this.showNotification('导出功能所需的元素未找到');
                return;
            }
            
            const count = parseInt(this.elements.generateCount.value);
            const startNumber = parseInt(this.elements.startNumber.value);
            
            if (count < 1 || count > 100) {
                this.showNotification(t('generateCountRange'));
                return;
            }
            
            if (startNumber < 1 || startNumber > 9999) {
                this.showNotification(t('startIdRange'));
                return;
            }
            
            // 保存当前用户正在使用的打乱状态
            const savedCurrentScramble = this.state.currentScramble;
            const savedScrambleCounter = this.getCurrentCounter();
            
            // 使用通用方法获取当前类型的列表
            const currentScramblesList = this.getCurrentGeneratedScrambles();
            
            currentScramblesList.length = 0; // 清空当前类型的列表
            
            for (let i = 0; i < count; i++) {
                const scrambleNumber = startNumber + i;
                
                // 使用独立的生成函数，不影响当前打乱状态
                const generatedScramble = this.generateScrambleForBatch();
                
                currentScramblesList.push({
                    number: scrambleNumber,
                    scramble: this.getScrambleTextForBatch(generatedScramble),
                    cubeType: this.state.currentCubeType
                });
            }
            
            // 恢复用户原来的打乱状态
            this.state.currentScramble = savedCurrentScramble;
            this.setCurrentCounter(savedScrambleCounter);

            // 更新当前显示的列表（使用正确的方法更新）
            this.setCurrentGeneratedScrambles(currentScramblesList);

            // 更新显示，但不应用打乱到魔方
            this.updateScrambleDisplay();
            this.elements.scrambleNumber.textContent = `#${savedScrambleCounter}`;

            this.displayGeneratedScrambles();
            this.showNotification(`已生成${count}个打乱公式`);
        }
        
        displayGeneratedScrambles() {
            if (!this.elements.scramblesList) return;
            
            this.elements.scramblesList.style.display = 'block';
            this.elements.scramblesList.innerHTML = '';
            
            const scramblesContentDiv = document.createElement('div');
            scramblesContentDiv.className = 'scrambles-content';
            this.elements.scramblesList.appendChild(scramblesContentDiv);
            
            this.state.generatedScrambles.forEach(item => {
                const scrambleElement = document.createElement('div');
                scrambleElement.className = 'generated-scramble';
                
                scrambleElement.innerHTML = `
                    <div class="generated-scramble-number">#${item.number}</div>
                    <div class="generated-scramble-steps">${item.scramble}</div>
                `;
                
                scramblesContentDiv.appendChild(scrambleElement);
            });
        }
        
        exportScrambles() {
        
                    // 先按照导出数量和起始编号重新生成打乱公式
        
                    this.generateMultipleScrambles();
        
                    
        
                    // 获取当前魔方类型的打乱公式列表
        
                    const currentScramblesList = this.getCurrentGeneratedScrambles();
        
                    
        
                    if (currentScramblesList.length === 0) {
        
                        this.showNotification(t('noExportScrambles'));
        
                        return;
        
                    }
        
                    
        
                    // 导出生成的打乱公式列表
        
                    const cubeTypeNameMap = {
        
                        'corner': t('cornerCubeFull'),
        
                        'cornerOcta': t('cornerOctahedronFull'),
        
                        'octahedron': t('twinOctahedronFull'),
        
                        'twinOctahedron': t('twinOctahedron2x2Full')
        
                    };
        
                    
        
                    const cubeTypeName = cubeTypeNameMap[this.state.currentCubeType] || t('unknownCube');
        
                    
        
                    let exportContent = `${cubeTypeName} - ${t('exportScramblesFile')}${t('exportText')}\n`;
        
                    exportContent += '='.repeat(50) + '\n';
        
                    exportContent += `${t('generatedTime')} ${new Date().toLocaleString()}\n`;
        
                    exportContent += `${t('countColon')} ${currentScramblesList.length}\n`;
        
                    exportContent += '='.repeat(50) + '\n\n';
        
                    
        
                    currentScramblesList.forEach(item => {
        
                        exportContent += `#${item.number} ${item.scramble}\n`;
        
                    });
        
                    
        
                    // 生成带时间戳的文件名
        
                    const now = new Date();
        
                    const timestamp = now.getFullYear() +
        
                                     (now.getMonth() + 1).toString().padStart(2, '0') +
        
                                     now.getDate().toString().padStart(2, '0') + '_' +
        
                                     now.getHours().toString().padStart(2, '0') +
        
                                     now.getMinutes().toString().padStart(2, '0') +
        
                                     now.getSeconds().toString().padStart(2, '0');
        
                    
        
                    const filename = `${cubeTypeName}_${t('exportScramblesFile')}${currentScramblesList.length}${t('records')}_${timestamp}.txt`;
        
                    
        
                    // 添加BOM头以支持中文显示
        
                    const bom = '\uFEFF';
        
                    this.downloadFile(filename, bom + exportContent);
        
                    this.showNotification(t('scramblesExported'));
        
                }
        
        downloadFile(filename, content) {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        
        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
    }

    // 初始化应用
    let app;
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing app...');
        
        // 延迟初始化，确保DOM完全渲染
        setTimeout(() => {
            app = new CubeTimerApp();
            window.app = app; // 将app对象挂载到window，以便其他函数访问
            console.log('App initialized:', app);
            
            // 初始化语言设置
            initLanguage();
            
            // 在app初始化后更新所有文本（包括历史摘要）
            updateAllText();
            
            // 添加全局调试函数
            window.debugTimer = () => {
                console.log('Timer state:', app.state.timerState);
                console.log('Timer elements:', {
                    display: app.elements.timerDisplay,
                    startBtn: app.elements.timerStartBtn,
                    resetBtn: app.elements.timerResetBtn
                });
            };
        }, 100);
    });