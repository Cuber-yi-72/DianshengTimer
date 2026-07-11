    // 暴露由 version.json 自动同步到 APP_CONFIG 的当前版本，便于运行时检查。
    window.CUBE_TIMER_VERSION = APP_CONFIG.APP_VERSION;
    document.documentElement.dataset.appVersion = APP_CONFIG.APP_VERSION;

    function debug(...args) {
        if (APP_CONFIG.DEBUG) {
            console.log(`[CubeTimer v${APP_CONFIG.APP_VERSION}]`, ...args);
        }
    }

    // ===== DOM元素缓存 =====
    const DOM_CACHE = {
        // 初始化时缓存所有需要的DOM元素
        elements: {},

        init() {
            this.elements = {
                // 设置相关
                settingsBtn: document.getElementById('settingsBtn'),
                languageToggleBtn: document.getElementById('languageToggleBtn'),

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
                cubeTypeSelectButton: document.getElementById('cubeTypeSelectButton'),
                cubeTypeSelectLabel: document.getElementById('cubeTypeSelectLabel'),
                cubeTypeMenu: document.getElementById('cubeTypeMenu'),
                prevScrambleBtn: document.getElementById('prevScrambleBtn'),
                nextScrambleBtn: document.getElementById('nextScrambleBtn'),

                // 打乱显示
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
                scrambleExportToggle: document.getElementById('scrambleExportToggle'),
                exportScramblesBtn: document.getElementById('exportScramblesBtn')
            };
        },

        get(key) {
            return this.elements[key];
        }
    };

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
        updateQuickSettingsButtons();

        // 更新魔方类型选择器（option文本由通用data-i18n处理器更新）
        if (cache.cubeTypeSelect) {
            updateCustomCubeSelect();
        }

        // 更新上一条/下一条按钮
        if (cache.prevScrambleBtn) {
            cache.prevScrambleBtn.title = t('prevScramble');
            cache.prevScrambleBtn.setAttribute('aria-label', t('prevScramble'));
        }
        if (cache.nextScrambleBtn) {
            cache.nextScrambleBtn.title = t('nextScramble');
            cache.nextScrambleBtn.setAttribute('aria-label', t('nextScramble'));
        }

        // 更新复制按钮
        if (cache.copyBtn) {
            cache.copyBtn.title = t('copy');
            cache.copyBtn.setAttribute('aria-label', t('copy'));
        }

        // 更新坐标按钮
        if (cache.coordinateBtn) cache.coordinateBtn.textContent = t('coordinate');

        // 更新统计区域标题
        const currentStatsTitle = document.querySelector('.current-stats-card .stats-card-title');
        if (currentStatsTitle) currentStatsTitle.textContent = t('statistics');

        // 更新历史成绩
        const historyTitle = document.querySelector('.history-times-title span');
        if (historyTitle) historyTitle.textContent = t('history');
        if (cache.historyResetBtn) {
            cache.historyResetBtn.title = t('clearData');
            cache.historyResetBtn.setAttribute('aria-label', t('clearData'));
        }
        if (cache.exportBestAo5Btn) {
            cache.exportBestAo5Btn.title = t('exportAll');
            cache.exportBestAo5Btn.setAttribute('aria-label', t('exportAll'));
        }

        // 更新历史记录列表
        if (cache.historyTimesList && cache.historyTimesList.innerHTML.includes('暂无时间记录')) {
            cache.historyTimesList.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">' + t('noRecords') + '</div>';
        }

        // 更新魔方类型映射
        window.cubeTypeNameMap = {
            'corner': t('cornerCubeFull'),
            'cornerOcta': t('cornerOctahedronFull'),
            'octahedron': t('twinOctahedronFull'),
            'twinOctahedron': t('twinOctahedron2x2Full'),
            'squareCircle4': t('squareCircle4Full'),
            'squareCircle8': t('squareCircle8Full')
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
        if (cache.scrambleExportToggle) {
            cache.scrambleExportToggle.title = t('exportScrambles');
            cache.scrambleExportToggle.setAttribute('aria-label', t('exportScrambles'));
        }

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

    function updateLogoForTheme(theme) {
        const logo = document.querySelector('.header-logo');
        if (!logo) return;

        logo.src = theme === 'dark'
            ? './pictures/diansheng-white.png'
            : './pictures/diansheng.png';
    }

    function updateQuickSettingsButtons() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const themeBtn = document.getElementById('settingsBtn');
        const languageBtn = document.getElementById('languageToggleBtn');

        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }
            themeBtn.title = currentTheme === 'dark' ? t('switchToLight') : t('switchToDark');
            themeBtn.setAttribute('aria-label', themeBtn.title);
        }

        if (languageBtn) {
            languageBtn.title = t('language');
            languageBtn.setAttribute('aria-label', t('language'));
        }
    }

    function toggleThemeDirectly() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }

    function toggleLanguageDirectly() {
        const languages = ['zh-CN', 'zh-TW', 'en'];
        const currentIndex = languages.indexOf(currentLanguage);
        const nextLang = languages[(currentIndex + 1) % languages.length];
        setLanguage(nextLang);
    }

    function updateCustomCubeSelect() {
        const select = document.getElementById('cubeTypeSelect');
        const label = document.getElementById('cubeTypeSelectLabel');
        const menu = document.getElementById('cubeTypeMenu');
        if (!select || !label || !menu) return;

        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption) {
            label.textContent = selectedOption.textContent;
        }

        Array.from(menu.children).forEach(item => {
            item.classList.toggle('active', item.dataset.value === select.value);
            item.setAttribute('aria-selected', item.dataset.value === select.value ? 'true' : 'false');
            const option = Array.from(select.options).find(opt => opt.value === item.dataset.value);
            if (option) item.textContent = option.textContent;
        });
    }

    function closeCustomCubeSelect() {
        const control = document.getElementById('cubeTypeControl');
        const button = document.getElementById('cubeTypeSelectButton');
        if (!control || !button) return;

        control.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
    }

    function initCustomCubeSelect() {
        const select = document.getElementById('cubeTypeSelect');
        const control = document.getElementById('cubeTypeControl');
        const button = document.getElementById('cubeTypeSelectButton');
        const menu = document.getElementById('cubeTypeMenu');
        if (!select || !control || !button || !menu) return;

        menu.innerHTML = '';
        Array.from(select.options).forEach(option => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'cube-type-menu-item';
            item.dataset.value = option.value;
            item.setAttribute('role', 'option');
            item.textContent = option.textContent;
            item.addEventListener('click', () => {
                select.value = option.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                updateCustomCubeSelect();
                closeCustomCubeSelect();
            });
            menu.appendChild(item);
        });

        button.addEventListener('click', () => {
            const isOpen = control.classList.toggle('open');
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        document.addEventListener('click', event => {
            if (!control.contains(event.target)) closeCustomCubeSelect();
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeCustomCubeSelect();
        });

        updateCustomCubeSelect();
    }

    // 更新顶部快捷设置按钮状态
    function updateSettingsModalText() {
        updateQuickSettingsButtons();
    }

    // 初始化快捷设置按钮事件
    function initSettingsModal() {
        const settingsBtn = document.getElementById('settingsBtn');
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', toggleThemeDirectly);
        }

        const languageToggleBtn = document.getElementById('languageToggleBtn');
        if (languageToggleBtn) {
            languageToggleBtn.addEventListener('click', toggleLanguageDirectly);
        }
    }

    // 设置主题（使用StorageHelper）
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        updateLogoForTheme(theme);
        StorageHelper.setItem(APP_CONFIG.STORAGE_KEYS.THEME, theme);
        updateSettingsModalText();
    }

    // 在页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', () => {
        // 初始化DOM缓存
        DOM_CACHE.init();

        initSettingsModal();
        initCustomCubeSelect();

        // 恢复保存的主题
        const savedTheme = StorageHelper.getItem(APP_CONFIG.STORAGE_KEYS.THEME, 'light');
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
    // 转角三阶、转角八面体是最早写的一部分代码，而且是当时不是奔着平面模型写的，所以有些看起来会很奇怪，但是能跑，暂时就不进一步优化了
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
                'DBR\'': () => this.rotateDBRCounterClockwise()
            };

            const move = moveMap[rotation];
            if (move) {
                move();
                this.rotationHistory.push(rotation);
            }
        }
        
        // 动画旋转效果 - 本来想做动画来着，后来放弃了
        animateRotation(rotation) {
        }
        
        // 前面顺时针旋转90度
        rotateFrontClockwise() {
            // O2-Y5-R4-W1-O2 循环
            const temp = this.faces.left[1]; // O2
            this.faces.left[1] = this.faces.bottom[0]; // W1 -> O2位置
            this.faces.bottom[0] = this.faces.right[3]; // R4 -> W1位置
            this.faces.right[3] = this.faces.top[4]; // Y5 -> R4位置  
            this.faces.top[4] = temp; // O2 -> Y5位置
            
            // O13-Y16-R6-W9-O13 循环
            const temp2 = this.faces.left[12]; // O13
            this.faces.left[12] = this.faces.bottom[8]; // W9 -> O13位置
            this.faces.bottom[8] = this.faces.right[5]; // R6 -> W9位置
            this.faces.right[5] = this.faces.top[15]; // Y16 -> R6位置
            this.faces.top[15] = temp2; // O13 -> Y16位置
            
            // O14-Y17-R8-W11-O14 循环
            const temp3 = this.faces.left[13]; // O14
            this.faces.left[13] = this.faces.bottom[10]; // W11 -> O14位置
            this.faces.bottom[10] = this.faces.right[7]; // R8 -> W11位置
            this.faces.right[7] = this.faces.top[16]; // Y17 -> R8位置
            this.faces.top[16] = temp3; // O14 -> Y17位置
            
            // O12-Y15-R7-W10-O12 循环
            const temp4 = this.faces.left[11]; // O12
            this.faces.left[11] = this.faces.bottom[9]; // W10 -> O12位置
            this.faces.bottom[9] = this.faces.right[6]; // R7 -> W10位置
            this.faces.right[6] = this.faces.top[14]; // Y15 -> R7位置
            this.faces.top[14] = temp4; // O12 -> Y15位置
            
            // O5-Y4-R1-W2-O5 循环
            const temp5 = this.faces.left[4]; // O5
            this.faces.left[4] = this.faces.bottom[1]; // W2 -> O5位置
            this.faces.bottom[1] = this.faces.right[0]; // R1 -> W2位置
            this.faces.right[0] = this.faces.top[3]; // Y4 -> R1位置
            this.faces.top[3] = temp5; // O5 -> Y4位置
            
            // B9-B13-B16-B6-B9 循环
            const temp6 = this.faces.front[8]; // B9
            this.faces.front[8] = this.faces.front[5]; // B6 -> B9位置
            this.faces.front[5] = this.faces.front[15]; // B16 -> B6位置
            this.faces.front[15] = this.faces.front[12]; // B13 -> B16位置
            this.faces.front[12] = temp6; // B9 -> B13位置
            
            // B11-B14-B17-B8-B11 循环
            const temp7 = this.faces.front[10]; // B11
            this.faces.front[10] = this.faces.front[7]; // B8 -> B11位置
            this.faces.front[7] = this.faces.front[16]; // B17 -> B8位置
            this.faces.front[16] = this.faces.front[13]; // B14 -> B17位置
            this.faces.front[13] = temp7; // B11 -> B14位置
            
            // B10-B12-B15-B7-B10 循环
            const temp8 = this.faces.front[9]; // B10
            this.faces.front[9] = this.faces.front[6]; // B7 -> B10位置
            this.faces.front[6] = this.faces.front[14]; // B15 -> B7位置
            this.faces.front[14] = this.faces.front[11]; // B12 -> B15位置
            this.faces.front[11] = temp8; // B10 -> B12位置
            
            // B1-B2-B5-B4-B1 循环
            const temp9 = this.faces.front[0]; // B1
            this.faces.front[0] = this.faces.front[3]; // B4 -> B1位置
            this.faces.front[3] = this.faces.front[4]; // B5 -> B4位置
            this.faces.front[4] = this.faces.front[1]; // B2 -> B5位置
            this.faces.front[1] = temp9; // B1 -> B2位置
        }
        
        // 前面逆时针旋转90度
        rotateFrontCounterClockwise() {
            this.rotateFrontClockwise();
            this.rotateFrontClockwise();
            this.rotateFrontClockwise();
        }
        
        // UFL顺时针旋转90度
        rotateUFL() {
            // O10-Y15-B7-O10 循环
            const temp = this.faces.left[9]; // O10
            this.faces.left[9] = this.faces.front[6]; // B7 -> O10位置
            this.faces.front[6] = this.faces.top[14]; // Y15 -> B7位置
            this.faces.top[14] = temp; // O10 -> Y15位置
            
            // O2-Y4-B1-O2 循环
            const temp2 = this.faces.left[1]; // O2
            this.faces.left[1] = this.faces.front[0]; // B1 -> O2位置
            this.faces.front[0] = this.faces.top[3]; // Y4 -> B1位置
            this.faces.top[3] = temp2; // O2 -> Y4位置
            
            // O13-Y6-B9-O13 循环
            const temp3 = this.faces.left[12]; // O13
            this.faces.left[12] = this.faces.front[8]; // B9 -> O13位置
            this.faces.front[8] = this.faces.top[5]; // Y6 -> B9位置
            this.faces.top[5] = temp3; // O13 -> Y6位置
        }
        
        // UFL逆时针旋转90度
        rotateUFLCounterClockwise() {
            this.rotateUFL();
            this.rotateUFL();
        }
        
        // UFR顺时针转90度
        rotateUFR() {
            // B10-Y12-R7-B10 循环
            const temp = this.faces.front[9]; // B10
            this.faces.front[9] = this.faces.right[6]; // R7 -> B10位置
            this.faces.right[6] = this.faces.top[11]; // Y12 -> R7位置
            this.faces.top[11] = temp; // B10 -> Y12位置
            
            // B2-Y5-R1-B2 循环
            const temp2 = this.faces.front[1]; // B2
            this.faces.front[1] = this.faces.right[0]; // R1 -> B2位置
            this.faces.right[0] = this.faces.top[4]; // Y5 -> R1位置
            this.faces.top[4] = temp2; // B2 -> Y5位置
            
            // B13-Y16-R9-B13 循环
            const temp3 = this.faces.front[12]; // B13
            this.faces.front[12] = this.faces.right[8]; // R9 -> B13位置
            this.faces.right[8] = this.faces.top[15]; // Y16 -> R9位置
            this.faces.top[15] = temp3; // B13 -> Y16位置
        }
        
        // UFR逆时针旋转90度
        rotateUFRCounterClockwise() {
            this.rotateUFR();
            this.rotateUFR();
        }
        
        // UBL顺时针转90度
        rotateUBL() {
            // G10-Y7-O7-G10 循环
            const temp = this.faces.back[9]; // G10
            this.faces.back[9] = this.faces.left[6]; // O7 -> G10位置
            this.faces.left[6] = this.faces.top[6]; // Y7 -> O7位置
            this.faces.top[6] = temp; // G10 -> Y7位置
            
            // G2-Y1-O1-G2 循环
            const temp2 = this.faces.back[1]; // G2
            this.faces.back[1] = this.faces.left[0]; // O1 -> G2位置
            this.faces.left[0] = this.faces.top[0]; // Y1 -> O1位置
            this.faces.top[0] = temp2; // G2 -> Y1位置
            
            // G13-Y9-O9-G13 循环
            const temp3 = this.faces.back[12]; // G13
            this.faces.back[12] = this.faces.left[8]; // O9 -> G13位置
            this.faces.left[8] = this.faces.top[8]; // Y9 -> O9位置
            this.faces.top[8] = temp3; // G13 -> Y9位置
        }
        
        // UBL逆时针旋转90度
        rotateUBLCounterClockwise() {
            this.rotateUBL();
            this.rotateUBL();
        }
        
        // UBR顺时针转90度
        rotateUBR() {
            // R10-Y10-G7-R10 循环
            const temp = this.faces.right[9]; // R10
            this.faces.right[9] = this.faces.back[6]; // G7 -> R10位置
            this.faces.back[6] = this.faces.top[9]; // Y10 -> G7位置
            this.faces.top[9] = temp; // R10 -> Y10位置
            
            // R2-Y2-G1-R2 循环
            const temp2 = this.faces.right[1]; // R2
            this.faces.right[1] = this.faces.back[0]; // G1 -> R2位置
            this.faces.back[0] = this.faces.top[1]; // Y2 -> G1位置
            this.faces.top[1] = temp2; // R2 -> Y2位置
            
            // R13-Y13-G9-R13 循环
            const temp3 = this.faces.right[12]; // R13
            this.faces.right[12] = this.faces.back[8]; // G9 -> R13位置
            this.faces.back[8] = this.faces.top[12]; // Y13 -> G9位置
            this.faces.top[12] = temp3; // R13 -> Y13位置
        }
        
        // UBR逆时针旋转90度
        rotateUBRCounterClockwise() {
            this.rotateUBR();
            this.rotateUBR();
        }
        
        // DFL顺时针转90度
        rotateDFL() {
            // O16-B6-W9-O16 循环
            const temp = this.faces.left[15]; // O16
            this.faces.left[15] = this.faces.bottom[8]; // W9 -> O16位置
            this.faces.bottom[8] = this.faces.front[5]; // B6 -> W9位置
            this.faces.front[5] = temp; // O16 -> B6位置
            
            // O5-B4-W1-O5 循环
            const temp2 = this.faces.left[4]; // O5
            this.faces.left[4] = this.faces.bottom[0]; // W1 -> O5位置
            this.faces.bottom[0] = this.faces.front[3]; // B4 -> W1位置
            this.faces.front[3] = temp2; // O5 -> B4位置
            
            // O12-B15-W7-O12 循环
            const temp3 = this.faces.left[11]; // O12
            this.faces.left[11] = this.faces.bottom[6]; // W7 -> O12位置
            this.faces.bottom[6] = this.faces.front[14]; // B15 -> W7位置
            this.faces.front[14] = temp3; // O12 -> B15位置
        }
        
        // DFL逆时针旋转90度
        rotateDFLCounterClockwise() {
            this.rotateDFL();
            this.rotateDFL();
        }
        
        // DFR顺时针转90度
        rotateDFR() {
            // B16-R6-W13-B16 循环
            const temp = this.faces.front[15]; // B16
            this.faces.front[15] = this.faces.bottom[12]; // W13 -> B16位置
            this.faces.bottom[12] = this.faces.right[5]; // R6 -> W13位置
            this.faces.right[5] = temp; // B16 -> R6位置
            
            // B5-R4-W2-B5 循环
            const temp2 = this.faces.front[4]; // B5
            this.faces.front[4] = this.faces.bottom[1]; // W2 -> B5位置
            this.faces.bottom[1] = this.faces.right[3]; // R4 -> W2位置
            this.faces.right[3] = temp2; // B5 -> R4位置
            
            // B12-R15-W10-B12 循环
            const temp3 = this.faces.front[11]; // B12
            this.faces.front[11] = this.faces.bottom[9]; // W10 -> B12位置
            this.faces.bottom[9] = this.faces.right[14]; // R15 -> W10位置
            this.faces.right[14] = temp3; // B12 -> R15位置
        }
        
        // DFR逆时针旋转90度
        rotateDFRCounterClockwise() {
            this.rotateDFR();
            this.rotateDFR();
        }
        
        // DBL顺时针转90度
        rotateDBL() {
            // W6-G16-O6-W6 循环
            const temp = this.faces.bottom[5]; // W6
            this.faces.bottom[5] = this.faces.left[5]; // O6 -> W6位置
            this.faces.left[5] = this.faces.back[15]; // G16 -> O6位置
            this.faces.back[15] = temp; // W6 -> G16位置
            
            // W4-G5-O4-W4 循环
            const temp2 = this.faces.bottom[3]; // W4
            this.faces.bottom[3] = this.faces.left[3]; // O4 -> W4位置
            this.faces.left[3] = this.faces.back[4]; // G5 -> O4位置
            this.faces.back[4] = temp2; // W4 -> G5位置
            
            // W15-G12-O15-W15 循环
            const temp3 = this.faces.bottom[14]; // W15
            this.faces.bottom[14] = this.faces.left[14]; // O15 -> W15位置
            this.faces.left[14] = this.faces.back[11]; // G12 -> O15位置
            this.faces.back[11] = temp3; // W15 -> G12位置
        }
        
        // DBL逆时针旋转90度
        rotateDBLCounterClockwise() {
            this.rotateDBL();
            this.rotateDBL();
        }
        
        // DBR顺时针转90度
        rotateDBR() {
            // R16-G6-W16-R16 循环
            const temp = this.faces.right[15]; // R16
            this.faces.right[15] = this.faces.bottom[15]; // W16 -> R16位置
            this.faces.bottom[15] = this.faces.back[5]; // G6 -> W16位置
            this.faces.back[5] = temp; // R16 -> G6位置
            
            // R5-G4-W5-R5 循环
            const temp2 = this.faces.right[4]; // R5
            this.faces.right[4] = this.faces.bottom[4]; // W5 -> R5位置
            this.faces.bottom[4] = this.faces.back[3]; // G4 -> W5位置
            this.faces.back[3] = temp2; // R5 -> G4位置
            
            // R12-G15-W12-R12 循环
            const temp3 = this.faces.right[11]; // R12
            this.faces.right[11] = this.faces.bottom[11]; // W12 -> R12位置
            this.faces.bottom[11] = this.faces.back[14]; // G15 -> W12位置
            this.faces.back[14] = temp3; // R12 -> G15位置
        }
        
        // DBR逆时针旋转90度
        rotateDBRCounterClockwise() {
            this.rotateDBR();
            this.rotateDBR();
        }
        
        // 后面顺时针旋转90度
        rotateBackClockwise() {
            // R5-Y2-O1-W4-R5 循环
            const temp = this.faces.right[4]; // R5
            this.faces.right[4] = this.faces.bottom[3]; // W4 -> R5位置
            this.faces.bottom[3] = this.faces.left[0]; // O1 -> W4位置
            this.faces.left[0] = this.faces.top[1]; // Y2 -> O1位置
            this.faces.top[1] = temp; // R5 -> Y2位置
            
            // R12-Y10-O7-W15-R12 循环
            const temp2 = this.faces.right[11]; // R12
            this.faces.right[11] = this.faces.bottom[14]; // W15 -> R12位置
            this.faces.bottom[14] = this.faces.left[6]; // O7 -> W15位置
            this.faces.left[6] = this.faces.top[9]; // Y10 -> O7位置
            this.faces.top[9] = temp2; // R12 -> Y10位置
            
            // R14-Y11-O8-W17-R14 循环
            const temp3 = this.faces.right[13]; // R14
            this.faces.right[13] = this.faces.bottom[16]; // W17 -> R14位置
            this.faces.bottom[16] = this.faces.left[7]; // O8 -> W17位置
            this.faces.left[7] = this.faces.top[10]; // Y11 -> O8位置
            this.faces.top[10] = temp3; // R14 -> Y11位置
            
            // R13-Y9-O6-W16-R13 循环
            const temp4 = this.faces.right[12]; // R13
            this.faces.right[12] = this.faces.bottom[15]; // W16 -> R13位置
            this.faces.bottom[15] = this.faces.left[5]; // O6 -> W16位置
            this.faces.left[5] = this.faces.top[8]; // Y9 -> O6位置
            this.faces.top[8] = temp4; // R13 -> Y9位置
            
            // R2-Y1-O4-W5-R2 循环
            const temp5 = this.faces.right[1]; // R2
            this.faces.right[1] = this.faces.bottom[4]; // W5 -> R2位置
            this.faces.bottom[4] = this.faces.left[3]; // O4 -> W5位置
            this.faces.left[3] = this.faces.top[0]; // Y1 -> O4位置
            this.faces.top[0] = temp5; // R2 -> Y1位置
            
            // G1-G4-G5-G2-G1 循环
            const temp6 = this.faces.back[0]; // G1
            this.faces.back[0] = this.faces.back[3]; // G4 -> G1位置
            this.faces.back[3] = this.faces.back[4]; // G5 -> G4位置
            this.faces.back[4] = this.faces.back[1]; // G2 -> G5位置
            this.faces.back[1] = temp6; // G1 -> G2位置
            
            // G9-G6-G16-G13-G9 循环
            const temp7 = this.faces.back[8]; // G9
            this.faces.back[8] = this.faces.back[5]; // G6 -> G9位置
            this.faces.back[5] = this.faces.back[15]; // G16 -> G6位置
            this.faces.back[15] = this.faces.back[12]; // G13 -> G16位置
            this.faces.back[12] = temp7; // G9 -> G13位置
            
            // G11-G8-G17-G14-G11 循环
            const temp8 = this.faces.back[10]; // G11
            this.faces.back[10] = this.faces.back[7]; // G8 -> G11位置
            this.faces.back[7] = this.faces.back[16]; // G17 -> G8位置
            this.faces.back[16] = this.faces.back[13]; // G14 -> G17位置
            this.faces.back[13] = temp8; // G11 -> G14位置
            
            // G10-G7-G15-G12-G10 循环
            const temp9 = this.faces.back[9]; // G10
            this.faces.back[9] = this.faces.back[6]; // G7 -> G10位置
            this.faces.back[6] = this.faces.back[14]; // G15 -> G7位置
            this.faces.back[14] = this.faces.back[11]; // G12 -> G15位置
            this.faces.back[11] = temp9; // G10 -> G12位置
        }
        
        // 后面逆时针旋转90度
        rotateBackCounterClockwise() {
            this.rotateBackClockwise();
            this.rotateBackClockwise();
            this.rotateBackClockwise();
        }
        
        // 右面顺时针旋转90度
        rotateRightClockwise() {
            // B2-Y2-G4-W2-B2 循环
            const temp = this.faces.front[1]; // B2
            this.faces.front[1] = this.faces.bottom[1]; // W2 -> B2位置
            this.faces.bottom[1] = this.faces.back[3]; // G4 -> W2位置
            this.faces.back[3] = this.faces.top[1]; // Y2 -> G4位置
            this.faces.top[1] = temp; // B2 -> Y2位置
            
            // B13-Y13-G6-W13-B13 循环
            const temp2 = this.faces.front[12]; // B13
            this.faces.front[12] = this.faces.bottom[12]; // W13 -> B13位置
            this.faces.bottom[12] = this.faces.back[5]; // G6 -> W13位置
            this.faces.back[5] = this.faces.top[12]; // Y13 -> G6位置
            this.faces.top[12] = temp2; // B13 -> Y13位置
            
            // B14-Y14-G8-W14-B14 循环
            const temp3 = this.faces.front[13]; // B14
            this.faces.front[13] = this.faces.bottom[13]; // W14 -> B14位置
            this.faces.bottom[13] = this.faces.back[7]; // G8 -> W14位置
            this.faces.back[7] = this.faces.top[13]; // Y14 -> G8位置
            this.faces.top[13] = temp3; // B14 -> Y14位置
            
            // B12-Y12-G7-W12-B12 循环
            const temp4 = this.faces.front[11]; // B12
            this.faces.front[11] = this.faces.bottom[11]; // W12 -> B12位置
            this.faces.bottom[11] = this.faces.back[6]; // G7 -> W12位置
            this.faces.back[6] = this.faces.top[11]; // Y12 -> G7位置
            this.faces.top[11] = temp4; // B12 -> Y12位置
            
            // B5-Y5-G1-W5-B5 循环
            const temp5 = this.faces.front[4]; // B5
            this.faces.front[4] = this.faces.bottom[4]; // W5 -> B5位置
            this.faces.bottom[4] = this.faces.back[0]; // G1 -> W5位置
            this.faces.back[0] = this.faces.top[4]; // Y5 -> G1位置
            this.faces.top[4] = temp5; // B5 -> Y5位置
            
            // R9-R13-R16-R6-R9 循环
            const temp6 = this.faces.right[8]; // R9
            this.faces.right[8] = this.faces.right[5]; // R6 -> R9位置
            this.faces.right[5] = this.faces.right[15]; // R16 -> R6位置
            this.faces.right[15] = this.faces.right[12]; // R13 -> R16位置
            this.faces.right[12] = temp6; // R9 -> R13位置
            
            // R11-R14-R17-R8-R11 循环
            const temp7 = this.faces.right[10]; // R11
            this.faces.right[10] = this.faces.right[7]; // R8 -> R11位置
            this.faces.right[7] = this.faces.right[16]; // R17 -> R8位置
            this.faces.right[16] = this.faces.right[13]; // R14 -> R17位置
            this.faces.right[13] = temp7; // R11 -> R14位置
            
            // R10-R12-R15-R7-R10 循环
            const temp8 = this.faces.right[9]; // R10
            this.faces.right[9] = this.faces.right[6]; // R7 -> R10位置
            this.faces.right[6] = this.faces.right[14]; // R15 -> R7位置
            this.faces.right[14] = this.faces.right[11]; // R12 -> R15位置
            this.faces.right[11] = temp8; // R10 -> R12位置
            
            // R1-R2-R5-R4-R1 循环
            const temp9 = this.faces.right[0]; // R1
            this.faces.right[0] = this.faces.right[3]; // R4 -> R1位置
            this.faces.right[3] = this.faces.right[4]; // R5 -> R4位置
            this.faces.right[4] = this.faces.right[1]; // R2 -> R5位置
            this.faces.right[1] = temp9; // R1 -> R2位置
        }
        
        // 右面逆时针旋转90度
        rotateRightCounterClockwise() {
            this.rotateRightClockwise();
            this.rotateRightClockwise();
            this.rotateRightClockwise();
        }
        
        // 左面顺时针旋转90度
        rotateLeftClockwise() {
            // G5-Y1-B1-W1-G5 循环
            const temp = this.faces.back[4]; // G5
            this.faces.back[4] = this.faces.bottom[0]; // W1 -> G5位置
            this.faces.bottom[0] = this.faces.front[0]; // B1 -> W1位置
            this.faces.front[0] = this.faces.top[0]; // Y1 -> B1位置
            this.faces.top[0] = temp; // G5 -> Y1位置
            
            // G12-Y7-B7-W7-G12 循环
            const temp2 = this.faces.back[11]; // G12
            this.faces.back[11] = this.faces.bottom[6]; // W7 -> G12位置
            this.faces.bottom[6] = this.faces.front[6]; // B7 -> W7位置
            this.faces.front[6] = this.faces.top[6]; // Y7 -> B7位置
            this.faces.top[6] = temp2; // G12 -> Y7位置
            
            // G14-Y8-B8-W8-G14 循环
            const temp3 = this.faces.back[13]; // G14
            this.faces.back[13] = this.faces.bottom[7]; // W8 -> G14位置
            this.faces.bottom[7] = this.faces.front[7]; // B8 -> W8位置
            this.faces.front[7] = this.faces.top[7]; // Y8 -> B8位置
            this.faces.top[7] = temp3; // G14 -> Y8位置
            
            // G13-Y6-B6-W6-G13 循环
            const temp4 = this.faces.back[12]; // G13
            this.faces.back[12] = this.faces.bottom[5]; // W6 -> G13位置
            this.faces.bottom[5] = this.faces.front[5]; // B6 -> W6位置
            this.faces.front[5] = this.faces.top[5]; // Y6 -> B6位置
            this.faces.top[5] = temp4; // G13 -> Y6位置
            
            // G2-Y4-B4-W4-G2 循环
            const temp5 = this.faces.back[1]; // G2
            this.faces.back[1] = this.faces.bottom[3]; // W4 -> G2位置
            this.faces.bottom[3] = this.faces.front[3]; // B4 -> W4位置
            this.faces.front[3] = this.faces.top[3]; // Y4 -> B4位置
            this.faces.top[3] = temp5; // G2 -> Y4位置
            
            // O1-O4-O5-O2-O1 循环
            const temp6 = this.faces.left[0]; // O1
            this.faces.left[0] = this.faces.left[3]; // O4 -> O1位置
            this.faces.left[3] = this.faces.left[4]; // O5 -> O4位置
            this.faces.left[4] = this.faces.left[1]; // O2 -> O5位置
            this.faces.left[1] = temp6; // O1 -> O2位置
            
            // O9-O6-O16-O13-O9 循环
            const temp7 = this.faces.left[8]; // O9
            this.faces.left[8] = this.faces.left[5]; // O6 -> O9位置
            this.faces.left[5] = this.faces.left[15]; // O16 -> O6位置
            this.faces.left[15] = this.faces.left[12]; // O13 -> O16位置
            this.faces.left[12] = temp7; // O9 -> O13位置
            
            // O11-O8-O17-O14-O11 循环
            const temp8 = this.faces.left[10]; // O11
            this.faces.left[10] = this.faces.left[7]; // O8 -> O11位置
            this.faces.left[7] = this.faces.left[16]; // O17 -> O8位置
            this.faces.left[16] = this.faces.left[13]; // O14 -> O17位置
            this.faces.left[13] = temp8; // O11 -> O14位置
            
            // O10-O7-O15-O12-O10 循环
            const temp9 = this.faces.left[9]; // O10
            this.faces.left[9] = this.faces.left[6]; // O7 -> O10位置
            this.faces.left[6] = this.faces.left[14]; // O15 -> O7位置
            this.faces.left[14] = this.faces.left[11]; // O12 -> O15位置
            this.faces.left[11] = temp9; // O10 -> O12位置
        }
        
        // 左面逆时针旋转90度
        rotateLeftCounterClockwise() {
            this.rotateLeftClockwise();
            this.rotateLeftClockwise();
            this.rotateLeftClockwise();
        }
        
        // 上面顺时针旋转90度
        rotateUpClockwise() {
            // O1-G1-R1-B1-O1 循环
            const temp = this.faces.left[0]; // O1
            this.faces.left[0] = this.faces.front[0]; // B1 -> O1位置
            this.faces.front[0] = this.faces.right[0]; // R1 -> B1位置
            this.faces.right[0] = this.faces.back[0]; // G1 -> R1位置
            this.faces.back[0] = temp; // O1 -> G1位置
            
            // O9-G9-R9-B9-O9 循环
            const temp2 = this.faces.left[8]; // O9
            this.faces.left[8] = this.faces.front[8]; // B9 -> O9位置
            this.faces.front[8] = this.faces.right[8]; // R9 -> B9位置
            this.faces.right[8] = this.faces.back[8]; // G9 -> R9位置
            this.faces.back[8] = temp2; // O9 -> G9位置
            
            // O11-G11-R11-B11-O11 循环
            const temp3 = this.faces.left[10]; // O11
            this.faces.left[10] = this.faces.front[10]; // B11 -> O11位置
            this.faces.front[10] = this.faces.right[10]; // R11 -> B11位置
            this.faces.right[10] = this.faces.back[10]; // G11 -> R11位置
            this.faces.back[10] = temp3; // O11 -> G11位置
            
            // O10-G10-R10-B10-O10 循环
            const temp4 = this.faces.left[9]; // O10
            this.faces.left[9] = this.faces.front[9]; // B10 -> O10位置
            this.faces.front[9] = this.faces.right[9]; // R10 -> B10位置
            this.faces.right[9] = this.faces.back[9]; // G10 -> R10位置
            this.faces.back[9] = temp4; // O10 -> G10位置
            
            // O2-G2-R2-B2-O2 循环
            const temp5 = this.faces.left[1]; // O2
            this.faces.left[1] = this.faces.front[1]; // B2 -> O2位置
            this.faces.front[1] = this.faces.right[1]; // R2 -> B2位置
            this.faces.right[1] = this.faces.back[1]; // G2 -> R2位置
            this.faces.back[1] = temp5; // O2 -> G2位置
            
            // Y1-Y4-Y5-Y2-Y1 循环
            const temp6 = this.faces.top[0]; // Y1
            this.faces.top[0] = this.faces.top[3]; // Y4 -> Y1位置
            this.faces.top[3] = this.faces.top[4]; // Y5 -> Y4位置
            this.faces.top[4] = this.faces.top[1]; // Y2 -> Y5位置
            this.faces.top[1] = temp6; // Y1 -> Y2位置
            
            // Y9-Y6-Y16-Y13-Y9 循环
            const temp7 = this.faces.top[8]; // Y9
            this.faces.top[8] = this.faces.top[5]; // Y6 -> Y9位置
            this.faces.top[5] = this.faces.top[15]; // Y16 -> Y6位置
            this.faces.top[15] = this.faces.top[12]; // Y13 -> Y16位置
            this.faces.top[12] = temp7; // Y9 -> Y13位置
            
            // Y11-Y8-Y17-Y14-Y11 循环
            const temp8 = this.faces.top[10]; // Y11
            this.faces.top[10] = this.faces.top[7]; // Y8 -> Y11位置
            this.faces.top[7] = this.faces.top[16]; // Y17 -> Y8位置
            this.faces.top[16] = this.faces.top[13]; // Y14 -> Y17位置
            this.faces.top[13] = temp8; // Y11 -> Y14位置
            
            // Y10-Y7-Y15-Y12-Y10 循环
            const temp9 = this.faces.top[9]; // Y10
            this.faces.top[9] = this.faces.top[6]; // Y7 -> Y10位置
            this.faces.top[6] = this.faces.top[14]; // Y15 -> Y7位置
            this.faces.top[14] = this.faces.top[11]; // Y12 -> Y15位置
            this.faces.top[11] = temp9; // Y10 -> Y12位置
        }
        
        // 上面逆时针旋转90度
        rotateUpCounterClockwise() {
            this.rotateUpClockwise();
            this.rotateUpClockwise();
            this.rotateUpClockwise();
        }
        
        // 下面顺时针旋转90度
        rotateDownClockwise() {
            const bottomStrip = [3, 14, 16, 15, 4];

            // 从 D 面外侧观察的顺时针方向：F -> R -> B -> L -> F。
            bottomStrip.forEach(index => {
                const temp = this.faces.front[index];
                this.faces.front[index] = this.faces.left[index];
                this.faces.left[index] = this.faces.back[index];
                this.faces.back[index] = this.faces.right[index];
                this.faces.right[index] = temp;
            });

            // W1-W4-W5-W2-W1 循环
            const temp6 = this.faces.bottom[0]; // W1
            this.faces.bottom[0] = this.faces.bottom[3]; // W4 -> W1位置
            this.faces.bottom[3] = this.faces.bottom[4]; // W5 -> W4位置
            this.faces.bottom[4] = this.faces.bottom[1]; // W2 -> W5位置
            this.faces.bottom[1] = temp6; // W1 -> W2位置
            
            // W9-W6-W16-W13-W9 循环
            const temp7 = this.faces.bottom[8]; // W9
            this.faces.bottom[8] = this.faces.bottom[5]; // W6 -> W9位置
            this.faces.bottom[5] = this.faces.bottom[15]; // W16 -> W6位置
            this.faces.bottom[15] = this.faces.bottom[12]; // W13 -> W16位置
            this.faces.bottom[12] = temp7; // W9 -> W13位置
            
            // W11-W8-W17-W14-W11 循环
            const temp8 = this.faces.bottom[10]; // W11
            this.faces.bottom[10] = this.faces.bottom[7]; // W8 -> W11位置
            this.faces.bottom[7] = this.faces.bottom[16]; // W17 -> W8位置
            this.faces.bottom[16] = this.faces.bottom[13]; // W14 -> W17位置
            this.faces.bottom[13] = temp8; // W11 -> W14位置
            
            // W10-W7-W15-W12-W10 循环
            const temp9 = this.faces.bottom[9]; // W10
            this.faces.bottom[9] = this.faces.bottom[6]; // W7 -> W10位置
            this.faces.bottom[6] = this.faces.bottom[14]; // W15 -> W7位置
            this.faces.bottom[14] = this.faces.bottom[11]; // W12 -> W15位置
            this.faces.bottom[11] = temp9; // W10 -> W12位置
        }
        
        // 下面逆时针旋转90度
        rotateDownCounterClockwise() {
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
                'u2': () => { this.rotateU(); this.rotateU(); },
                'f2': () => { this.rotateF(); this.rotateF(); },
                'r2': () => { this.rotateR(); this.rotateR(); },
                'd2': () => { this.rotateD(); this.rotateD(); },
                'b2': () => { this.rotateB(); this.rotateB(); },
                'l2': () => { this.rotateL(); this.rotateL(); },
                "u'": () => { this.rotateU(); this.rotateU(); this.rotateU(); },
                "f'": () => { this.rotateF(); this.rotateF(); this.rotateF(); },
                "r'": () => { this.rotateR(); this.rotateR(); this.rotateR(); },
                "d'": () => { this.rotateD(); this.rotateD(); this.rotateD(); },
                "b'": () => { this.rotateB(); this.rotateB(); this.rotateB(); },
                "l'": () => { this.rotateL(); this.rotateL(); this.rotateL(); }
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
            const moveMap = {
                'R': () => this.rotateR(),
                "R'": () => { this.rotateR(); this.rotateR(); },
                'U': () => this.rotateU(),
                "U'": () => { this.rotateU(); this.rotateU(); },
                'F': () => this.rotateF(),
                "F'": () => { this.rotateF(); this.rotateF(); },
                'L': () => this.rotateL(),
                "L'": () => { this.rotateL(); this.rotateL(); }
            };

            const move = moveMap[axis];
            if (move) {
                move();
                this.rotationHistory.push(axis);
            }
        }
        
        rotateR() {
            const f = this.faces;
            let temp;

            // III1 → I2 → VI3 → III1
            temp = f.top3[0]; f.top3[0] = f.bottom2[2]; f.bottom2[2] = f.top1[1]; f.top1[1] = temp;
            // VII2 → IV1 → V3 → VII2
            temp = f.bottom3[1]; f.bottom3[1] = f.bottom1[2]; f.bottom1[2] = f.top4[0]; f.top4[0] = temp;
            // VII3 → IV2 → V1 → VII3
            temp = f.bottom3[2]; f.bottom3[2] = f.bottom1[0]; f.bottom1[0] = f.top4[1]; f.top4[1] = temp;
            // VII4 → IV4 → V4 → VII4
            temp = f.bottom3[3]; f.bottom3[3] = f.bottom1[3]; f.bottom1[3] = f.top4[3]; f.top4[3] = temp;
            // VIII1 → VIII2 → VIII3 → VIII1
            temp = f.bottom4[0]; f.bottom4[0] = f.bottom4[2]; f.bottom4[2] = f.bottom4[1]; f.bottom4[1] = temp;
        }

        rotateF() {
            const f = this.faces;
            let temp;

            // IV2 → V3 → II1 → IV2
            temp = f.top4[1]; f.top4[1] = f.top2[0]; f.top2[0] = f.bottom1[2]; f.bottom1[2] = temp;
            // VIII1 → VI3 → III2 → VIII1
            temp = f.bottom4[0]; f.bottom4[0] = f.top3[1]; f.top3[1] = f.bottom2[2]; f.bottom2[2] = temp;
            // VIII3 → VI2 → III1 → VIII3
            temp = f.bottom4[2]; f.bottom4[2] = f.top3[0]; f.top3[0] = f.bottom2[1]; f.bottom2[1] = temp;
            // VIII4 → VI4 → III4 → VIII4
            temp = f.bottom4[3]; f.bottom4[3] = f.top3[3]; f.top3[3] = f.bottom2[3]; f.bottom2[3] = temp;
            // VII1 → VII2 → VII3 → VII1
            temp = f.bottom3[0]; f.bottom3[0] = f.bottom3[2]; f.bottom3[2] = f.bottom3[1]; f.bottom3[1] = temp;
        }

        rotateU() {
            const f = this.faces;
            let temp;

            // I3-VIII1-VI2-I3
            temp = f.top1[2]; f.top1[2] = f.bottom2[1]; f.bottom2[1] = f.bottom4[0]; f.bottom4[0] = temp; // 循环完成
            // IV2-VII1-II3-IV2
            temp = f.top4[1]; f.top4[1] = f.top2[2]; f.top2[2] = f.bottom3[0]; f.bottom3[0] = temp; // 循环完成
            // IV3-VII2-II1-IV3
            temp = f.top4[2]; f.top4[2] = f.top2[0]; f.top2[0] = f.bottom3[1]; f.bottom3[1] = temp; // 循环完成
            // IV4-VII4-II4-IV4
            temp = f.top4[3]; f.top4[3] = f.top2[3]; f.top2[3] = f.bottom3[3]; f.bottom3[3] = temp; // 循环完成
            // III1-III2-III3-III1
            temp = f.top3[0]; f.top3[0] = f.top3[2]; f.top3[2] = f.top3[1]; f.top3[1] = temp;
        }

        rotateL() {
            const f = this.faces;
            let temp;

            // III2 → VIII3 → I1 → III2
            temp = f.top3[1]; f.top3[1] = f.top1[0]; f.top1[0] = f.bottom4[2]; f.bottom4[2] = temp;
            // VII1 → V3 → II2 → VII1
            temp = f.bottom3[0]; f.bottom3[0] = f.top2[1]; f.top2[1] = f.bottom1[2]; f.bottom1[2] = temp;
            // VII3 → V2 → II1 → VII3
            temp = f.bottom3[2]; f.bottom3[2] = f.top2[0]; f.top2[0] = f.bottom1[1]; f.bottom1[1] = temp;
            // VII4 → V4 → II4 → VII4
            temp = f.bottom3[3]; f.bottom3[3] = f.top2[3]; f.top2[3] = f.bottom1[3]; f.bottom1[3] = temp;
            // VI1 → VI2 → VI3 → VI1
            temp = f.bottom2[0]; f.bottom2[0] = f.bottom2[2]; f.bottom2[2] = f.bottom2[1]; f.bottom2[1] = temp;
        }

        scramble(moves = 20) {
            const axes = ['R', 'U', 'F', 'L'];
            const suffixes = ['', "'"];
            for (let i = 0; i < moves; i++) {
                const axis = axes[Math.floor(Math.random() * axes.length)];
                const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
                this.rotate(axis + suffix);
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
                scrambleLength: 83
            };
        }

        generate() {
            // 转边操作：6种基础操作，每种有'和2变体
            const layerMoves = ['U', 'R', 'F', 'D', 'B', 'L'];
            
            // 转角操作：8种基础操作，每种有'变体
            const cornerMoves = ['UFR', 'UFL', 'DFR', 'DFL', 'UBR', 'UBL', 'DBR', 'DBL'];
            
            // 生成所有可能的操作
            const allLayerMoves = [];
            layerMoves.forEach(move => {
                allLayerMoves.push(move);
                allLayerMoves.push(move + '\'');
                allLayerMoves.push(move + '2');
            });
            
            const allCornerMoves = [];
            cornerMoves.forEach(move => {
                allCornerMoves.push(move);
                allCornerMoves.push(move + '\'');
            });
            
            const scrambleLength = this.config.scrambleLength;
            const scramble = [];
            const moveHistory = [];
            
            // 检查操作是否与历史记录中的操作冲突（冗余操作）
            const isValidMove = (move) => {
                if (moveHistory.length === 0) return true;
                
                const lastMove = moveHistory[moveHistory.length - 1];
                const lastMoveBase = lastMove.replace(/[\'2]/g, '');
                const moveBase = move.replace(/[\'2]/g, '');
                
                // 检查是否是相同操作
                if (lastMoveBase === moveBase) {
                    return false;
                }
                
                // 检查是否是逆操作
                if (lastMove === move + '\'' || lastMove + '\'' === move) {
                    return false;
                }
                
                // 检查是否是2倍操作
                if (lastMove + '2' === move || move + '2' === lastMove) {
                    return false;
                }
                
                return true;
            };
            
            // 获取一个有效的随机操作
            const getRandomMove = () => {
                // 随机选择转边或转角操作
                const useLayerMove = Math.random() < 0.6; // 60%概率选择转边操作
                
                const availableMoves = useLayerMove ? allLayerMoves : allCornerMoves;
                
                // 筛选出有效的操作
                const validMoves = availableMoves.filter(move => isValidMove(move));
                
                if (validMoves.length === 0) {
                    // 如果没有有效的操作，返回一个基础操作
                    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
                }
                
                return validMoves[Math.floor(Math.random() * validMoves.length)];
            };
            
            // 生成打乱序列
            for (let i = 0; i < scrambleLength; i++) {
                const move = getRandomMove();
                scramble.push(move);
                moveHistory.push(move);
                
                // 限制历史记录长度，只保留最近3个操作
                if (moveHistory.length > 3) {
                    moveHistory.shift();
                }
            }
            
            return scramble;
        }

        convertToMoves(scramble) {
            // 新的打乱生成器直接生成最终的操作，不需要转换
            return scramble;
        }

        getScrambleText(scramble) {
            // 新的打乱生成器返回数组格式，需要转换为字符串
            return scramble.join(' ');
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
                // 随机选择3~6个不同的角块移动
                const numCornerMoves = 3 + Math.floor(Math.random() * 4);
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
            const axes = ['R', 'U', 'F', 'L'];
            const suffixes = ['', "'"];
            const scramble = [];
            let lastAxis = null;

            // 生成 8 步；同一个轴（含正、逆方向）不能连续出现。
            for (let i = 0; i < 8; i++) {
                const availableAxes = axes.filter(axis => axis !== lastAxis);
                const axis = availableAxes[Math.floor(Math.random() * availableAxes.length)];
                const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
                scramble.push(axis + suffix);
                lastAxis = axis;
            }

            return scramble.join(' ');
        }
    }

    // ===== 二阶魔轮魔方核心数据结构 =====

    // 二阶魔轮·四分轮魔方模型
    class SquareCircle4Cube extends BaseCubeModel {
        constructor() {
            super();
            this.faceKeys = ['U', 'D', 'F', 'B', 'R', 'L'];
            this.defaultColors = [
                CUBE_COLORS.OCTAHEDRON_WHITE,
                CUBE_COLORS.OCTAHEDRON_YELLOW,
                CUBE_COLORS.OCTAHEDRON_GREEN,
                CUBE_COLORS.OCTAHEDRON_BLUE,
                CUBE_COLORS.OCTAHEDRON_RED,
                CUBE_COLORS.OCTAHEDRON_ORANGE
            ];
            this.initializeCube();
            this.rotationHistory = [];
        }

        initializeCube() {
            this.faces = {};
            this.faceKeys.forEach((key, i) => {
                this.faces[key] = Array(SQUARECIRCLE_CUBE.FACE_SIZE_4).fill(this.defaultColors[i]);
            });
        }

        cycle4(f, a, b, c, d) {
            const t = f[a[0]][a[1]];
            f[a[0]][a[1]] = f[d[0]][d[1]];
            f[d[0]][d[1]] = f[c[0]][c[1]];
            f[c[0]][c[1]] = f[b[0]][b[1]];
            f[b[0]][b[1]] = t;
        }

        rotate(axis) {
            const moveMap = {
                'U': () => this.rotateU(), 'U\'': () => { this.rotateU(); this.rotateU(); this.rotateU(); }, 'U2': () => { this.rotateU(); this.rotateU(); },
                'D': () => this.rotateD(), 'D\'': () => { this.rotateD(); this.rotateD(); this.rotateD(); }, 'D2': () => { this.rotateD(); this.rotateD(); },
                'F': () => this.rotateF(), 'F\'': () => { this.rotateF(); this.rotateF(); this.rotateF(); }, 'F2': () => { this.rotateF(); this.rotateF(); },
                'B': () => this.rotateB(), 'B\'': () => { this.rotateB(); this.rotateB(); this.rotateB(); }, 'B2': () => { this.rotateB(); this.rotateB(); },
                'R': () => this.rotateR(), 'R\'': () => { this.rotateR(); this.rotateR(); this.rotateR(); }, 'R2': () => { this.rotateR(); this.rotateR(); },
                'L': () => this.rotateL(), 'L\'': () => { this.rotateL(); this.rotateL(); this.rotateL(); }, 'L2': () => { this.rotateL(); this.rotateL(); },
                'u': () => this.rotateu(), 'u\'': () => { this.rotateu(); this.rotateu(); this.rotateu(); }, 'u2': () => { this.rotateu(); this.rotateu(); },
                'd': () => this.rotated(), 'd\'': () => { this.rotated(); this.rotated(); this.rotated(); }, 'd2': () => { this.rotated(); this.rotated(); },
                'f': () => this.rotatef(), 'f\'': () => { this.rotatef(); this.rotatef(); this.rotatef(); }, 'f2': () => { this.rotatef(); this.rotatef(); },
                'b': () => this.rotateb(), 'b\'': () => { this.rotateb(); this.rotateb(); this.rotateb(); }, 'b2': () => { this.rotateb(); this.rotateb(); },
                'r': () => this.rotater(), 'r\'': () => { this.rotater(); this.rotater(); this.rotater(); }, 'r2': () => { this.rotater(); this.rotater(); },
                'l': () => this.rotatel(), 'l\'': () => { this.rotatel(); this.rotatel(); this.rotatel(); }, 'l2': () => { this.rotatel(); this.rotatel(); },
            };
            const move = moveMap[axis];
            if (move) {
                move();
                this.rotationHistory.push(axis);
            }
        }

        rotateU() {
            const f = this.faces;
            this.cycle4(f, ['F',4],['L',4],['B',4],['R',4]);
            this.cycle4(f, ['F',7],['L',7],['B',7],['R',7]);
            this.cycle4(f, ['F',1],['L',1],['B',1],['R',1]);
            this.cycle4(f, ['F',2],['L',2],['B',2],['R',2]);
            this.cycle4(f, ['U',1],['U',0],['U',3],['U',2]);
            this.cycle4(f, ['U',4],['U',5],['U',6],['U',7]);
        }
        rotateu() {
            const f = this.faces;
            this.cycle4(f, ['U',1],['U',0],['U',3],['U',2]);
        }

        rotateR() {
            const f = this.faces;
            this.cycle4(f, ['F',5],['U',5],['B',7],['D',5]);
            this.cycle4(f, ['F',4],['U',4],['B',6],['D',4]);
            this.cycle4(f, ['F',1],['U',1],['B',3],['D',1]);
            this.cycle4(f, ['F',0],['U',0],['B',2],['D',0]);
            this.cycle4(f, ['R',1],['R',0],['R',3],['R',2]);
            this.cycle4(f, ['R',4],['R',5],['R',6],['R',7]);
        }
        rotater() {
            const f = this.faces;
            this.cycle4(f, ['R',1],['R',0],['R',3],['R',2]);
        }

        rotateF() {
            const f = this.faces;
            this.cycle4(f, ['L',4],['U',5],['R',6],['D',7]);
            this.cycle4(f, ['L',5],['U',6],['R',7],['D',4]);
            this.cycle4(f, ['L',1],['U',0],['R',3],['D',2]);
            this.cycle4(f, ['L',0],['U',3],['R',2],['D',1]);
            this.cycle4(f, ['F',1],['F',0],['F',3],['F',2]);
            this.cycle4(f, ['F',4],['F',5],['F',6],['F',7]);
        }
        rotatef() {
            const f = this.faces;
            this.cycle4(f, ['F',1],['F',0],['F',3],['F',2]);
        }

        rotateD() {
            const f = this.faces;
            this.cycle4(f, ['F',5],['R',5],['B',5],['L',5]);
            this.cycle4(f, ['F',6],['R',6],['B',6],['L',6]);
            this.cycle4(f, ['F',0],['R',0],['B',0],['L',0]);
            this.cycle4(f, ['F',3],['R',3],['B',3],['L',3]);
            this.cycle4(f, ['D',1],['D',0],['D',3],['D',2]);
            this.cycle4(f, ['D',4],['D',5],['D',6],['D',7]);
        }
        rotated() {
            const f = this.faces;
            this.cycle4(f, ['D',1],['D',0],['D',3],['D',2]);
        }

        rotateB() {
            const f = this.faces;
            this.cycle4(f, ['R',5],['U',4],['L',7],['D',6]);
            this.cycle4(f, ['R',4],['U',7],['L',6],['D',5]);
            this.cycle4(f, ['R',0],['U',1],['L',2],['D',3]);
            this.cycle4(f, ['R',1],['U',2],['L',3],['D',0]);
            this.cycle4(f, ['B',1],['B',0],['B',3],['B',2]);
            this.cycle4(f, ['B',4],['B',5],['B',6],['B',7]);
        }
        rotateb() {
            const f = this.faces;
            this.cycle4(f, ['B',1],['B',0],['B',3],['B',2]);
        }

        rotateL() {
            const f = this.faces;
            this.cycle4(f, ['U',6],['F',6],['D',6],['B',4]);
            this.cycle4(f, ['U',7],['F',7],['D',7],['B',5]);
            this.cycle4(f, ['U',3],['F',3],['D',3],['B',1]);
            this.cycle4(f, ['U',2],['F',2],['D',2],['B',0]);
            this.cycle4(f, ['L',1],['L',0],['L',3],['L',2]);
            this.cycle4(f, ['L',4],['L',5],['L',6],['L',7]);
        }
        rotatel() {
            const f = this.faces;
            this.cycle4(f, ['L',1],['L',0],['L',3],['L',2]);
        }

        reset() {
            this.initializeCube();
            this.rotationHistory = [];
        }
    }

    // 二阶魔轮·八分轮魔方模型
    class SquareCircle8Cube extends BaseCubeModel {
        constructor() {
            super();
            this.faceKeys = ['U', 'D', 'F', 'B', 'R', 'L'];
            this.defaultColors = [
                CUBE_COLORS.OCTAHEDRON_WHITE,
                CUBE_COLORS.OCTAHEDRON_YELLOW,
                CUBE_COLORS.OCTAHEDRON_GREEN,
                CUBE_COLORS.OCTAHEDRON_BLUE,
                CUBE_COLORS.OCTAHEDRON_RED,
                CUBE_COLORS.OCTAHEDRON_ORANGE
            ];
            this.initializeCube();
            this.rotationHistory = [];
        }

        initializeCube() {
            this.faces = {};
            this.faceKeys.forEach((key, i) => {
                this.faces[key] = Array(SQUARECIRCLE_CUBE.FACE_SIZE_8).fill(this.defaultColors[i]);
            });
        }

        cycle4(f, a, b, c, d) {
            const t = f[a[0]][a[1]];
            f[a[0]][a[1]] = f[d[0]][d[1]];
            f[d[0]][d[1]] = f[c[0]][c[1]];
            f[c[0]][c[1]] = f[b[0]][b[1]];
            f[b[0]][b[1]] = t;
        }

        cycle8(f, a, b, c, d, e, g, h, i) {
            const t = f[a[0]][a[1]];
            f[a[0]][a[1]] = f[i[0]][i[1]];
            f[i[0]][i[1]] = f[h[0]][h[1]];
            f[h[0]][h[1]] = f[g[0]][g[1]];
            f[g[0]][g[1]] = f[e[0]][e[1]];
            f[e[0]][e[1]] = f[d[0]][d[1]];
            f[d[0]][d[1]] = f[c[0]][c[1]];
            f[c[0]][c[1]] = f[b[0]][b[1]];
            f[b[0]][b[1]] = t;
        }

        rotate(axis) {
            const base = axis[0];
            const isLower = base === base.toLowerCase();
            if (!isLower) {
                const moveMap = {
                    'U': () => this.rotateU(), 'U\'': () => { this.rotateU(); this.rotateU(); this.rotateU(); }, 'U2': () => { this.rotateU(); this.rotateU(); },
                    'D': () => this.rotateD(), 'D\'': () => { this.rotateD(); this.rotateD(); this.rotateD(); }, 'D2': () => { this.rotateD(); this.rotateD(); },
                    'F': () => this.rotateF(), 'F\'': () => { this.rotateF(); this.rotateF(); this.rotateF(); }, 'F2': () => { this.rotateF(); this.rotateF(); },
                    'B': () => this.rotateB(), 'B\'': () => { this.rotateB(); this.rotateB(); this.rotateB(); }, 'B2': () => { this.rotateB(); this.rotateB(); },
                    'R': () => this.rotateR(), 'R\'': () => { this.rotateR(); this.rotateR(); this.rotateR(); }, 'R2': () => { this.rotateR(); this.rotateR(); },
                    'L': () => this.rotateL(), 'L\'': () => { this.rotateL(); this.rotateL(); this.rotateL(); }, 'L2': () => { this.rotateL(); this.rotateL(); },
                };
                const move = moveMap[axis];
                if (move) {
                    move();
                    this.rotationHistory.push(axis);
                }
            } else {
                const rest = axis.slice(1);
                const rotateFuncs = {
                    u: () => this.rotateu(), d: () => this.rotated(), f: () => this.rotatef(),
                    b: () => this.rotateb(), r: () => this.rotater(), l: () => this.rotatel()
                };
                const rotateFn = rotateFuncs[base];
                if (!rotateFn) return;

                if (rest === '') {
                    rotateFn();
                    this.rotationHistory.push(axis);
                } else if (rest === "'") {
                    for (let i = 0; i < 7; i++) rotateFn();
                    this.rotationHistory.push(axis);
                } else if (rest === '2') {
                    rotateFn(); rotateFn();
                    this.rotationHistory.push(axis);
                } else {
                    const match = rest.match(/^(\d+)([+-])?/);
                    if (match) {
                        const count = parseInt(match[1]);
                        const dir = match[2] || '+';
                        if (dir === '+') {
                            for (let i = 0; i < count; i++) rotateFn();
                        } else {
                            for (let i = 0; i < count; i++) {
                                for (let j = 0; j < 7; j++) rotateFn();
                            }
                        }
                        this.rotationHistory.push(axis);
                    }
                }
            }
        }

        rotateU() {
            const f = this.faces;
            this.cycle4(f, ['F',8],['L',8],['B',8],['R',8]);
            this.cycle4(f, ['F',11],['L',11],['B',11],['R',11]);
            this.cycle4(f, ['F',0],['L',0],['B',0],['R',0]);
            this.cycle4(f, ['F',1],['L',1],['B',1],['R',1]);
            this.cycle4(f, ['F',7],['L',7],['B',7],['R',7]);
            this.cycle4(f, ['F',6],['L',6],['B',6],['R',6]);
            this.cycle4(f, ['U',2],['U',4],['U',6],['U',0]);
            this.cycle4(f, ['U',3],['U',5],['U',7],['U',1]);
            this.cycle4(f, ['U',9],['U',10],['U',11],['U',8]);
        }
        rotateu() {
            const f = this.faces;
            this.cycle8(f, ['U',1],['U',2],['U',3],['U',4],['U',5],['U',6],['U',7],['U',0]);
        }

        rotateR() {
            const f = this.faces;
            this.cycle4(f, ['F',9],['U',9],['B',11],['D',9]);
            this.cycle4(f, ['F',8],['U',8],['B',10],['D',8]);
            this.cycle4(f, ['F',0],['U',0],['B',4],['D',0]);
            this.cycle4(f, ['F',1],['U',1],['B',5],['D',1]);
            this.cycle4(f, ['F',2],['U',2],['B',6],['D',2]);
            this.cycle4(f, ['F',3],['U',3],['B',7],['D',3]);
            this.cycle4(f, ['R',2],['R',4],['R',6],['R',0]);
            this.cycle4(f, ['R',3],['R',5],['R',7],['R',1]);
            this.cycle4(f, ['R',9],['R',10],['R',11],['R',8]);
        }
        rotater() {
            const f = this.faces;
            this.cycle8(f, ['R',1],['R',2],['R',3],['R',4],['R',5],['R',6],['R',7],['R',0]);
        }

        rotateF() {
            const f = this.faces;
            this.cycle4(f, ['L',8],['U',9],['R',10],['D',11]);
            this.cycle4(f, ['L',9],['U',10],['R',11],['D',8]);
            this.cycle4(f, ['L',0],['U',2],['R',4],['D',6]);
            this.cycle4(f, ['L',1],['U',3],['R',5],['D',7]);
            this.cycle4(f, ['L',2],['U',4],['R',6],['D',0]);
            this.cycle4(f, ['L',3],['U',5],['R',7],['D',1]);
            this.cycle4(f, ['F',2],['F',4],['F',6],['F',0]);
            this.cycle4(f, ['F',3],['F',5],['F',7],['F',1]);
            this.cycle4(f, ['F',9],['F',10],['F',11],['F',8]);
        }
        rotatef() {
            const f = this.faces;
            this.cycle8(f, ['F',1],['F',2],['F',3],['F',4],['F',5],['F',6],['F',7],['F',0]);
        }

        rotateD() {
            const f = this.faces;
            this.cycle4(f, ['F',9],['R',9],['B',9],['L',9]);
            this.cycle4(f, ['F',10],['R',10],['B',10],['L',10]);
            this.cycle4(f, ['F',4],['R',4],['B',4],['L',4]);
            this.cycle4(f, ['F',5],['R',5],['B',5],['L',5]);
            this.cycle4(f, ['F',2],['R',2],['B',2],['L',2]);
            this.cycle4(f, ['F',3],['R',3],['B',3],['L',3]);
            this.cycle4(f, ['D',2],['D',4],['D',6],['D',0]);
            this.cycle4(f, ['D',3],['D',5],['D',7],['D',1]);
            this.cycle4(f, ['D',9],['D',10],['D',11],['D',8]);
        }
        rotated() {
            const f = this.faces;
            this.cycle8(f, ['D',1],['D',2],['D',3],['D',4],['D',5],['D',6],['D',7],['D',0]);
        }

        rotateB() {
            const f = this.faces;
            this.cycle4(f, ['R',9],['U',8],['L',11],['D',10]);
            this.cycle4(f, ['R',8],['U',11],['L',10],['D',9]);
            this.cycle4(f, ['R',0],['U',6],['L',4],['D',2]);
            this.cycle4(f, ['R',1],['U',7],['L',5],['D',3]);
            this.cycle4(f, ['R',2],['U',0],['L',6],['D',4]);
            this.cycle4(f, ['R',3],['U',1],['L',7],['D',5]);
            this.cycle4(f, ['B',2],['B',4],['B',6],['B',0]);
            this.cycle4(f, ['B',3],['B',5],['B',7],['B',1]);
            this.cycle4(f, ['B',9],['B',10],['B',11],['B',8]);
        }
        rotateb() {
            const f = this.faces;
            this.cycle8(f, ['B',1],['B',2],['B',3],['B',4],['B',5],['B',6],['B',7],['B',0]);
        }

        rotateL() {
            const f = this.faces;
            this.cycle4(f, ['U',10],['F',10],['D',10],['B',8]);
            this.cycle4(f, ['U',11],['F',11],['D',11],['B',9]);
            this.cycle4(f, ['U',6],['F',6],['D',6],['B',2]);
            this.cycle4(f, ['U',7],['F',7],['D',7],['B',3]);
            this.cycle4(f, ['U',5],['F',5],['D',5],['B',1]);
            this.cycle4(f, ['U',4],['F',4],['D',4],['B',0]);
            this.cycle4(f, ['L',2],['L',4],['L',6],['L',0]);
            this.cycle4(f, ['L',3],['L',5],['L',7],['L',1]);
            this.cycle4(f, ['L',9],['L',10],['L',11],['L',8]);
        }
        rotatel() {
            const f = this.faces;
            this.cycle8(f, ['L',1],['L',2],['L',3],['L',4],['L',5],['L',6],['L',7],['L',0]);
        }

        reset() {
            this.initializeCube();
            this.rotationHistory = [];
        }
    }

    // ===== 二阶魔轮打乱生成器 =====

    // 二阶魔轮·四分轮打乱生成器
    class SquareCircle4ScrambleGenerator extends BaseScrambleGenerator {
        constructor() {
            super();
            this.config = {
                cycles: 5,
                upperMin: 2,
                upperMax: 4,
                lowerMin: 3,
                lowerMax: 5
            };
        }

        generate() {
            const upperAxes = ['R', 'U', 'F'];
            const lowerAxes = ['r', 'u', 'f', 'l', 'd', 'b'];
            const upperDirs = ['', "'", '2'];
            const lowerDirs = ['', "'", '2'];

            let result = [];
            let lastUpperAxis = null;

            for (let cycle = 0; cycle < this.config.cycles; cycle++) {
                // 2-4步大写打乱，不同轴连续
                const upperCount = this.config.upperMin + Math.floor(Math.random() * (this.config.upperMax - this.config.upperMin + 1));
                for (let i = 0; i < upperCount; i++) {
                    const available = upperAxes.filter(a => a !== lastUpperAxis);
                    const axis = available[Math.floor(Math.random() * available.length)];
                    const dir = upperDirs[Math.floor(Math.random() * upperDirs.length)];
                    result.push(axis + dir);
                    lastUpperAxis = axis;
                }

                // 3-5步小写打乱，同周期内不重复
                const lowerCount = this.config.lowerMin + Math.floor(Math.random() * (this.config.lowerMax - this.config.lowerMin + 1));
                const selectedLower = this.shuffleArray([...lowerAxes]).slice(0, lowerCount);
                for (const axis of selectedLower) {
                    const dir = lowerDirs[Math.floor(Math.random() * lowerDirs.length)];
                    result.push(axis + dir);
                }
            }

            // 末尾追加2-4步大写打乱
            const tailCount = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < tailCount; i++) {
                const available = upperAxes.filter(a => a !== lastUpperAxis);
                const axis = available[Math.floor(Math.random() * available.length)];
                const dir = upperDirs[Math.floor(Math.random() * upperDirs.length)];
                result.push(axis + dir);
                lastUpperAxis = axis;
            }

            return result.join(' ');
        }

        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    }

    // 二阶魔轮·八分轮打乱生成器
    class SquareCircle8ScrambleGenerator extends BaseScrambleGenerator {
        constructor() {
            super();
            this.config = {
                cycles: 8,
                upperMin: 2,
                upperMax: 4,
                lowerMin: 3,
                lowerMax: 5,
                maxLianSe: 2,
                maxAttempts: 500
            };
        }

        generate() {
            let bestScramble = '';
            let bestLianSe = Infinity;

            for (let attempt = 0; attempt < this.config.maxAttempts; attempt++) {
                const scramble = this._generateRaw();
                const lianSe = this._countLianSe(scramble);

                if (lianSe <= this.config.maxLianSe) {
                    return scramble;
                }

                if (lianSe < bestLianSe) {
                    bestLianSe = lianSe;
                    bestScramble = scramble;
                }
            }

            return bestScramble;
        }

        _generateRaw() {
            const upperAxes = ['R', 'U', 'F'];
            const lowerAxes = ['r', 'u', 'f', 'l', 'd', 'b'];
            const upperDirs = ['', "'", '2'];
            const lowerCounts = [1, 2, 3, 4];
            const lowerDirs = ['+', '-'];

            let result = [];
            let lastUpperAxis = null;

            for (let cycle = 0; cycle < this.config.cycles; cycle++) {
                // 生成2-4个大写动作(R, U, F)，相邻不使用同一轴
                const upperCount = this.config.upperMin + Math.floor(Math.random() * (this.config.upperMax - this.config.upperMin + 1));
                for (let i = 0; i < upperCount; i++) {
                    const available = upperAxes.filter(a => a !== lastUpperAxis);
                    const axis = available[Math.floor(Math.random() * available.length)];
                    const dir = upperDirs[Math.floor(Math.random() * upperDirs.length)];
                    result.push(axis + dir);
                    lastUpperAxis = axis;
                }

                // 生成3-5个不同的小写动作(r, u, f, l, d, b)，不重复
                const lowerCount = this.config.lowerMin + Math.floor(Math.random() * (this.config.lowerMax - this.config.lowerMin + 1));
                const selectedLower = this.shuffleArray([...lowerAxes]).slice(0, lowerCount);
                for (const axis of selectedLower) {
                    const count = lowerCounts[Math.floor(Math.random() * lowerCounts.length)];
                    const dir = lowerDirs[Math.floor(Math.random() * lowerDirs.length)];
                    result.push(axis + count + dir);
                }
            }

            // 末尾追加2-4步大写打乱
            const tailCount = 2 + Math.floor(Math.random() * 3);
            for (let i = 0; i < tailCount; i++) {
                const available = upperAxes.filter(a => a !== lastUpperAxis);
                const axis = available[Math.floor(Math.random() * available.length)];
                const dir = upperDirs[Math.floor(Math.random() * upperDirs.length)];
                result.push(axis + dir);
                lastUpperAxis = axis;
            }

            return result.join(' ');
        }

        _countLianSe(scrambleStr) {
            const cube = new SquareCircle8Cube();
            const moves = scrambleStr.split(' ').filter(m => m.length > 0);
            for (const move of moves) {
                cube.rotate(move);
            }

            let count = 0;
            for (const key of cube.faceKeys) {
                const face = cube.faces[key];
                for (let i = 0; i < 8; i++) {
                    if (face[i] === face[(i + 1) % 8]) {
                        count++;
                    }
                }
            }
            return count;
        }

        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
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

        renderToCoordinateSVG(container, model, svgConfig) {
            // 转角三阶使用 Canvas 渲染。外层容器继续负责居中，
            // 内层 grid 只负责六个面的十字展开，避免覆盖父容器的 flex 布局。
            const faceNames = ['top', 'bottom', 'front', 'back', 'left', 'right'];
            container.innerHTML = '';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';

            const gap = 2;
            const availableWidth = Math.max(160, container.clientWidth - 16);
            const availableHeight = Math.max(120, container.clientHeight - 16);
            const faceSize = Math.max(36, Math.floor(Math.min(
                130,
                (availableWidth - gap * 3) / 4,
                (availableHeight - gap * 2) / 3
            )));

            const grid = document.createElement('div');
            grid.className = 'coordinate-corner-net';
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = `repeat(4, ${faceSize}px)`;
            grid.style.gridTemplateRows = `repeat(3, ${faceSize}px)`;
            grid.style.gap = `${gap}px`;
            grid.style.width = `${faceSize * 4 + gap * 3}px`;
            grid.style.height = `${faceSize * 3 + gap * 2}px`;
            grid.style.flex = '0 0 auto';

            // 面布局为十字形：U 在上方，L-F-R-B 在中间行，D 在下方。
            const facePositions = {
                top: { row: 1, col: 2 },
                left: { row: 2, col: 1 },
                front: { row: 2, col: 2 },
                right: { row: 2, col: 3 },
                back: { row: 2, col: 4 },
                bottom: { row: 3, col: 2 }
            };

            faceNames.forEach(faceName => {
                const pos = facePositions[faceName];
                const wrapper = document.createElement('div');
                wrapper.style.gridColumn = pos.col;
                wrapper.style.gridRow = pos.row;
                wrapper.style.minWidth = '0';
                wrapper.style.minHeight = '0';

                const canvas = document.createElement('canvas');
                canvas.width = 150;
                canvas.height = 150;
                canvas.style.display = 'block';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.borderRadius = '0';
                canvas.style.border = '1px solid var(--border-color)';

                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const savedCtx = this.canvasContextCache.get(faceName);
                const savedCanvas = this.canvasCache.get(faceName);
                this.canvasContextCache.set(faceName, ctx);
                this.canvasCache.set(faceName, canvas);
                this.drawCornerCubeFace(ctx, model.faces[faceName], faceName);

                if (savedCtx && savedCanvas) {
                    this.canvasContextCache.set(faceName, savedCtx);
                    this.canvasCache.set(faceName, savedCanvas);
                } else {
                    this.canvasContextCache.delete(faceName);
                    this.canvasCache.delete(faceName);
                }

                wrapper.appendChild(canvas);
                grid.appendChild(wrapper);
            });

            container.appendChild(grid);
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

        renderToCoordinateSVG(svgElement, model, svgConfig) {
            // svgElement是包含克隆计时器SVG的coordinateSvgContainer
            // 在克隆容器内查找SVG元素
            const svg = svgElement.querySelector('svg');
            if (!svg) return;
            
            // 设置viewBox以匹配计时器界面
            svg.setAttribute('viewBox', svgConfig.viewBox);
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.maxWidth = svgConfig.maxWidth || '100%';
            
            // 将每个面渲染到已有的face-group中
            this.faceKeys.forEach(faceKey => {
                const faceGroup = svg.querySelector(`.face-group[data-face="${faceKey}"]`);
                if (!faceGroup) return;
                
                faceGroup.innerHTML = '';
                const paths = [];
                this.createFaceGeometry(faceGroup, faceKey, model.faces[faceKey], paths);
            });
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

            // 与另外两种八面体统一为 2-3-4-1 的横向顺序：
            // 橙/黄、紫/绿、白/红、蓝/灰。
            switch(faceKey) {
                case 'top2': offsetX = 30; offsetY = 400; needsFlip = true; break;
                case 'top3': offsetX = 480; offsetY = 400; needsFlip = true; break;
                case 'top4': offsetX = 930; offsetY = 400; needsFlip = true; break;
                case 'top1': offsetX = 1380; offsetY = 400; needsFlip = true; break;
                case 'bottom2': offsetX = 30; offsetY = 400; needsFlip = false; break;
                case 'bottom3': offsetX = 480; offsetY = 400; needsFlip = false; break;
                case 'bottom4': offsetX = 930; offsetY = 400; needsFlip = false; break;
                case 'bottom1': offsetX = 1380; offsetY = 400; needsFlip = false; break;
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

        renderToCoordinateSVG(svgElement, model, svgConfig) {
            // svgElement是包含克隆计时器SVG的coordinateSvgContainer
            const svg = svgElement.querySelector('svg');
            if (!svg) return;
            
            svg.setAttribute('viewBox', svgConfig.viewBox);
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.maxWidth = svgConfig.maxWidth || '100%';
            
            this.faceKeys.forEach(faceKey => {
                const faceGroup = svg.querySelector(`.face-group[data-face="${faceKey}"]`);
                if (!faceGroup) return;
                
                faceGroup.innerHTML = '';
                const paths = [];
                this.createFaceGeometry(faceGroup, faceKey, model.faces[faceKey], paths);
            });
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

        renderToCoordinateSVG(svgElement, model, svgConfig) {
            const svg = svgElement.querySelector('svg');
            if (!svg) return;
            
            svg.setAttribute('viewBox', svgConfig.viewBox);
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.maxWidth = svgConfig.maxWidth || '100%';
            
            this.faceKeys.forEach(faceKey => {
                const faceGroup = svg.querySelector(`.face-group[data-face="${faceKey}"]`);
                if (!faceGroup) return;
                
                faceGroup.innerHTML = '';
                const paths = [];
                this.createFaceGeometry(faceGroup, faceKey, model.faces[faceKey], paths);
            });
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

    // 二阶魔轮·四分轮视图渲染器
    class SquareCircle4ViewRenderer extends BaseViewRenderer {
        constructor(containerId) {
            super(containerId);
            this.faceKeys = ['U', 'D', 'F', 'B', 'R', 'L'];
            this.facePositions = {
                U: [123, 40],
                L: [40, 123],
                F: [123, 123],
                R: [206, 123],
                B: [289, 123],
                D: [123, 206]
            };
            this.pathCache = {};
            this.isInitialized = false;
        }

        render(model) {
            if (!this.isInitialized) {
                this.initializePaths();
                this.isInitialized = true;
            }
            this.faceKeys.forEach(key => {
                const paths = this.pathCache[key];
                const colors = model.faces[key];
                if (!paths) return;
                paths.forEach((p, i) => {
                    p.setAttribute('fill', '#' + colors[i].toString(16).padStart(6, '0'));
                });
            });
        }

        initializePaths() {
            const s = 40;
            const r = 21.33;
            this.faceKeys.forEach(key => {
                const group = this.getFaceGroup(key);
                if (!group) return;
                group.innerHTML = '';

                const [ox, oy] = this.facePositions[key];
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('transform', `translate(${ox},${oy})`);

                // 背景方块
                g.appendChild(this.svgEl('rect', {x:-s, y:-s, width:s*2, height:s*2, fill:'#111', rx:4}));

                // 4个扇形(0-3) + 4个角块(4-7)，带弧形边缘
                const pathDefs = [
                    'M 0,0 L 21.33,0 A 21.33,21.33 0 0,1 0 21.33 Z',
                    'M 0,0 L 0,-21.33 A 21.33,21.33 0 0,1 21.33 0 Z',
                    'M 0,0 L -21.33,0 A 21.33,21.33 0 0,1 0 -21.33 Z',
                    'M 0,0 L 0,21.33 A 21.33,21.33 0 0,1 -21.33 0 Z',
                    'M 0,-40 L 0,-21.33 A 21.33,21.33 0 0,1 21.33 0 L 40,0 L 40,-40 Z',
                    'M 40,0 L 21.33,0 A 21.33,21.33 0 0,1 0 21.33 L 0,40 L 40,40 Z',
                    'M 0,40 L 0,21.33 A 21.33,21.33 0 0,1 -21.33 0 L -40,0 L -40,40 Z',
                    'M -40,-40 L -40,0 L -21.33,0 A 21.33,21.33 0 0,1 0 -21.33 L 0,-40 Z'
                ];

                const paths = pathDefs.map(d => this.svgEl('path', {d, stroke:'#333', 'stroke-width':0.5, fill:'#fff'}));
                paths.forEach(p => g.appendChild(p));

                g.appendChild(this.svgEl('circle', {cx:0, cy:0, r:r, fill:'none', stroke:'#555', 'stroke-width':0.75}));

                const axes = this.svgEl('g', {stroke:'#555', 'stroke-width':0.5});
                axes.appendChild(this.svgEl('line', {x1:-s, y1:0, x2:s, y2:0}));
                axes.appendChild(this.svgEl('line', {x1:0, y1:-s, x2:0, y2:s}));
                g.appendChild(axes);

                group.appendChild(g);
                this.pathCache[key] = paths;
            });
        }

        getFaceGroup(key) {
            return document.querySelector(`#squareCircle4-twod-container .face-group[data-face="${key}"]`);
        }

        svgEl(tag, attrs) {
            const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
            return el;
        }

        colorToHex(color) {
            return '#' + color.toString(16).padStart(6, '0');
        }

        renderToCoordinateSVG(svgElement, model, svgConfig) {
            const svg = svgElement.querySelector('svg');
            if (!svg) return;
            
            svg.setAttribute('viewBox', svgConfig.viewBox);
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.maxWidth = svgConfig.maxWidth || '100%';
            
            svg.querySelectorAll('.face-group').forEach(g => g.innerHTML = '');
            
            const s = 40;
            const r = 21.33;
            
            this.faceKeys.forEach(key => {
                const faceGroup = svg.querySelector(`.face-group[data-face="${key}"]`);
                if (!faceGroup) return;
                
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                const [ox, oy] = this.facePositions[key];
                g.setAttribute('transform', `translate(${ox},${oy})`);
                
                // 背景方块
                g.appendChild(this.svgEl('rect', {x:-s, y:-s, width:s*2, height:s*2, fill:'#111', rx:4}));
                
                // 4个扇形 + 4个角块
                const pathDefs = [
                    'M 0,0 L 21.33,0 A 21.33,21.33 0 0,1 0 21.33 Z',
                    'M 0,0 L 0,-21.33 A 21.33,21.33 0 0,1 21.33 0 Z',
                    'M 0,0 L -21.33,0 A 21.33,21.33 0 0,1 0 -21.33 Z',
                    'M 0,0 L 0,21.33 A 21.33,21.33 0 0,1 -21.33 0 Z',
                    'M 0,-40 L 0,-21.33 A 21.33,21.33 0 0,1 21.33 0 L 40,0 L 40,-40 Z',
                    'M 40,0 L 21.33,0 A 21.33,21.33 0 0,1 0 21.33 L 0,40 L 40,40 Z',
                    'M 0,40 L 0,21.33 A 21.33,21.33 0 0,1 -21.33 0 L -40,0 L -40,40 Z',
                    'M -40,-40 L -40,0 L -21.33,0 A 21.33,21.33 0 0,1 0 -21.33 L 0,-40 Z'
                ];
                
                const colors = model.faces[key];
                const paths = pathDefs.map((d, i) => 
                    this.svgEl('path', {d, stroke:'#333', 'stroke-width':0.5, fill: '#' + colors[i].toString(16).padStart(6, '0')})
                );
                paths.forEach(p => g.appendChild(p));
                
                g.appendChild(this.svgEl('circle', {cx:0, cy:0, r:r, fill:'none', stroke:'#555', 'stroke-width':0.75}));
                
                const axes = this.svgEl('g', {stroke:'#555', 'stroke-width':0.5});
                axes.appendChild(this.svgEl('line', {x1:-s, y1:0, x2:s, y2:0}));
                axes.appendChild(this.svgEl('line', {x1:0, y1:-s, x2:0, y2:s}));
                g.appendChild(axes);
                
                faceGroup.appendChild(g);
            });
        }
    }

    // 二阶魔轮·八分轮视图渲染器
    class SquareCircle8ViewRenderer extends BaseViewRenderer {
        constructor(containerId) {
            super(containerId);
            this.faceKeys = ['U', 'D', 'F', 'B', 'R', 'L'];
            this.facePositions = {
                U: [123, 40],
                L: [40, 123],
                F: [123, 123],
                R: [206, 123],
                B: [289, 123],
                D: [123, 206]
            };
            this.pathCache = {};
            this.isInitialized = false;
        }

        render(model) {
            if (!this.isInitialized) {
                this.initializePaths();
                this.isInitialized = true;
            }
            this.faceKeys.forEach(key => {
                const paths = this.pathCache[key];
                const colors = model.faces[key];
                if (!paths) return;
                paths.forEach((p, i) => {
                    p.setAttribute('fill', '#' + colors[i].toString(16).padStart(6, '0'));
                });
            });
        }

        initializePaths() {
            const s = 40;
            const r = 21.33;
            const c = r / Math.sqrt(2);
            this.faceKeys.forEach(key => {
                const group = this.getFaceGroup(key);
                if (!group) return;
                group.innerHTML = '';

                const [ox, oy] = this.facePositions[key];
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('transform', `translate(${ox},${oy})`);

                // 背景方块
                g.appendChild(this.svgEl('rect', {x:-s, y:-s, width:s*2, height:s*2, fill:'#111', rx:4}));

                // 8个扇形(0-7) + 4个角块(8-11)
                const pathDefs = [
                    `M 0,0 L 0,${-r} A ${r},${r} 0 0,1 ${c} ${-c} Z`,
                    `M 0,0 L ${c},${-c} A ${r},${r} 0 0,1 ${r},0 Z`,
                    `M 0,0 L ${r},0 A ${r},${r} 0 0,1 ${c},${c} Z`,
                    `M 0,0 L ${c},${c} A ${r},${r} 0 0,1 0,${r} Z`,
                    `M 0,0 L 0,${r} A ${r},${r} 0 0,1 ${-c},${c} Z`,
                    `M 0,0 L ${-c},${c} A ${r},${r} 0 0,1 ${-r},0 Z`,
                    `M 0,0 L ${-r},0 A ${r},${r} 0 0,1 ${-c},${-c} Z`,
                    `M 0,0 L ${-c},${-c} A ${r},${r} 0 0,1 0,${-r} Z`,
                    `M 0,${-s} L 0,${-r} A ${r},${r} 0 0,1 ${r},0 L ${s},0 L ${s},${-s} Z`,
                    `M ${s},0 L ${r},0 A ${r},${r} 0 0,1 0,${r} L 0,${s} L ${s},${s} Z`,
                    `M 0,${s} L 0,${r} A ${r},${r} 0 0,1 ${-r},0 L ${-s},0 L ${-s},${s} Z`,
                    `M ${-s},${-s} L ${-s},0 L ${-r},0 A ${r},${r} 0 0,1 0,${-r} L 0,${-s} Z`
                ];

                const paths = pathDefs.map(d => this.svgEl('path', {d, stroke:'#333', 'stroke-width':0.5, fill:'#fff'}));
                paths.forEach(p => g.appendChild(p));

                g.appendChild(this.svgEl('circle', {cx:0, cy:0, r:r, fill:'none', stroke:'#555', 'stroke-width':0.75}));

                const axes = this.svgEl('g', {stroke:'#555', 'stroke-width':0.5});
                axes.appendChild(this.svgEl('line', {x1:-s, y1:0, x2:s, y2:0}));
                axes.appendChild(this.svgEl('line', {x1:0, y1:-s, x2:0, y2:s}));
                g.appendChild(axes);

                group.appendChild(g);
                this.pathCache[key] = paths;
            });
        }

        getFaceGroup(key) {
            return document.querySelector(`#squareCircle8-twod-container .face-group[data-face="${key}"]`);
        }

        svgEl(tag, attrs) {
            const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
            return el;
        }

        colorToHex(color) {
            return '#' + color.toString(16).padStart(6, '0');
        }

        renderToCoordinateSVG(svgElement, model, svgConfig) {
            const svg = svgElement.querySelector('svg');
            if (!svg) return;
            
            svg.setAttribute('viewBox', svgConfig.viewBox);
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.maxWidth = svgConfig.maxWidth || '100%';
            
            svg.querySelectorAll('.face-group').forEach(g => g.innerHTML = '');
            
            const s = 40;
            const r = 21.33;
            const c = r / Math.sqrt(2);
            
            this.faceKeys.forEach(key => {
                const faceGroup = svg.querySelector(`.face-group[data-face="${key}"]`);
                if (!faceGroup) return;
                
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                const [ox, oy] = this.facePositions[key];
                g.setAttribute('transform', `translate(${ox},${oy})`);
                
                g.appendChild(this.svgEl('rect', {x:-s, y:-s, width:s*2, height:s*2, fill:'#111', rx:4}));
                
                const pathDefs = [
                    `M 0,0 L 0,${-r} A ${r},${r} 0 0,1 ${c} ${-c} Z`,
                    `M 0,0 L ${c},${-c} A ${r},${r} 0 0,1 ${r},0 Z`,
                    `M 0,0 L ${r},0 A ${r},${r} 0 0,1 ${c},${c} Z`,
                    `M 0,0 L ${c},${c} A ${r},${r} 0 0,1 0,${r} Z`,
                    `M 0,0 L 0,${r} A ${r},${r} 0 0,1 ${-c},${c} Z`,
                    `M 0,0 L ${-c},${c} A ${r},${r} 0 0,1 ${-r},0 Z`,
                    `M 0,0 L ${-r},0 A ${r},${r} 0 0,1 ${-c},${-c} Z`,
                    `M 0,0 L ${-c},${-c} A ${r},${r} 0 0,1 0,${-r} Z`,
                    `M 0,${-s} L 0,${-r} A ${r},${r} 0 0,1 ${r},0 L ${s},0 L ${s},${-s} Z`,
                    `M ${s},0 L ${r},0 A ${r},${r} 0 0,1 0,${r} L 0,${s} L ${s},${s} Z`,
                    `M 0,${s} L 0,${r} A ${r},${r} 0 0,1 ${-r},0 L ${-s},0 L ${-s},${s} Z`,
                    `M ${-s},${-s} L ${-s},0 L ${-r},0 A ${r},${r} 0 0,1 0,${-r} L 0,${-s} Z`
                ];
                
                const colors = model.faces[key];
                const paths = pathDefs.map((d, i) => 
                    this.svgEl('path', {d, stroke:'#333', 'stroke-width':0.5, fill: '#' + (colors[i] || 0).toString(16).padStart(6, '0')})
                );
                paths.forEach(p => g.appendChild(p));
                
                g.appendChild(this.svgEl('circle', {cx:0, cy:0, r:r, fill:'none', stroke:'#555', 'stroke-width':0.75}));
                
                faceGroup.appendChild(g);
            });
        }
    }

    // 注册二阶魔轮·四分轮
    cubeRegistry.register('squareCircle4', {
        name: '二阶魔轮·四分轮魔方',
        model: SquareCircle4Cube,
        scrambleGenerator: SquareCircle4ScrambleGenerator,
        viewRenderer: SquareCircle4ViewRenderer,
        controlPanelId: 'squareCircle4-controls',
        viewId: 'square-circle4-view'
    });

    // 注册二阶魔轮·八分轮
    cubeRegistry.register('squareCircle8', {
        name: '二阶魔轮·八分轮魔方',
        model: SquareCircle8Cube,
        scrambleGenerator: SquareCircle8ScrambleGenerator,
        viewRenderer: SquareCircle8ViewRenderer,
        controlPanelId: 'squareCircle8-controls',
        viewId: 'square-circle8-view'
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

    class Coordinate3DRenderer {
        constructor(canvas = null) {
            this.canvas = null;
            this.ctx = null;
            this.currentCubeType = null;
            this.model = null;
            this.faceTextureCache = {};
            // 二阶魔轮的圆盘需要单独绘制，才能表现高于方形基座的厚度。
            this.raisedTextureCache = {};
            this.magicWheelExtrusion = 0.16;
            // 用真实圆柱侧壁分片代替深色薄层堆叠。
            this.magicWheelSideSegments = 64;
            this.magicWheelSideAmbient = 0.78;
            this.magicWheelSideDiffuse = 0.18;
            // 设为 0 可完全关闭明暗处理；建议保持在 0~0.12。
            this.faceShadowStrength = 0.10;
            this.dragState = { active: false, x: 0, y: 0 };
            // 统一采用右手坐标系：+Y 为上，+Z 为前，摄像机位于 +Z。
            // 正的 pitch 才会在默认视角中看到顶面；原来的负值会使八面体显示底面。
            this.rotation = { yaw: -Math.PI / 4, pitch: 0.55 };
            this.cornerFaceRenderer = new CornerViewRenderer(null);
            this.octahedronFaceKeys = ['top1', 'top2', 'top3', 'top4', 'bottom1', 'bottom2', 'bottom3', 'bottom4'];
            this.setCanvas(canvas);
        }

        setCanvas(canvas) {
            if (!canvas) return;
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.bindEvents();
        }

        bindEvents() {
            if (!this.canvas || this.canvas.dataset.coordinate3dBound === 'true') return;

            this.canvas.addEventListener('pointerdown', (event) => {
                event.preventDefault();
                this.dragState.active = true;
                this.dragState.x = event.clientX;
                this.dragState.y = event.clientY;
                if (this.canvas.setPointerCapture) {
                    this.canvas.setPointerCapture(event.pointerId);
                }
            });

            this.canvas.addEventListener('pointermove', (event) => {
                if (!this.dragState.active) return;
                event.preventDefault();
                const dx = event.clientX - this.dragState.x;
                const dy = event.clientY - this.dragState.y;
                this.dragState.x = event.clientX;
                this.dragState.y = event.clientY;
                const yawDelta = dx * 0.01;
                const pitchDelta = dy * 0.01;
                // 所有模型共用同一套世界坐标，不再按模型类型反转拖动方向。
                this.rotation.yaw += yawDelta;
                this.rotation.pitch = Math.max(-1.2, Math.min(1.2, this.rotation.pitch + pitchDelta));
                this.render();
            });

            const stopDrag = () => {
                this.dragState.active = false;
            };

            this.canvas.addEventListener('pointerup', stopDrag);
            this.canvas.addEventListener('pointercancel', stopDrag);
            this.canvas.addEventListener('pointerleave', stopDrag);
            this.canvas.dataset.coordinate3dBound = 'true';
        }

        update(cubeType, model) {
            const typeChanged = this.currentCubeType !== cubeType;
            this.currentCubeType = cubeType;
            if (typeChanged) {
                this.resetViewForCubeType(cubeType);
            }
            this.model = model;
            this.faceTextureCache = this.prepareTextures(cubeType, model);
            this.prepareRaisedMagicWheelTextures(cubeType, model);
            this.render();
        }

        resetViewForCubeType(cubeType = this.currentCubeType) {
            if (cubeType === 'twinOctahedron') {
                // 二阶转面八面体：从“左、下、前”三个方向等角观察。
                // 初始可见面为：上方紫色 top3、中央绿色 bottom3、
                // 左侧黄色 bottom2、右侧红色 bottom4。
                this.rotation = {
                    yaw: Math.PI / 4,
                    pitch: -Math.asin(1 / Math.sqrt(3))
                };
            } else if (['octahedron', 'cornerOcta'].includes(cubeType)) {
                // 另外两种八面体继续正对 F 顶点。
                this.rotation = { yaw: 0, pitch: 0 };
            } else {
                // 立方体类仍使用可同时看到 U/F/R 的默认角度。
                this.rotation = { yaw: -Math.PI / 4, pitch: 0.55 };
            }
        }

        prepareTextures(cubeType, model) {
            if (!model) return {};

            if (cubeType === 'corner') {
                return this.buildCubeTextureMap({
                    U: this.createCornerFaceTexture(model.faces.top),
                    D: this.createCornerFaceTexture(model.faces.bottom),
                    F: this.createCornerFaceTexture(model.faces.front),
                    B: this.createCornerFaceTexture(model.faces.back),
                    L: this.createCornerFaceTexture(model.faces.left),
                    R: this.createCornerFaceTexture(model.faces.right)
                });
            }

            if (cubeType === 'squareCircle4') {
                return this.buildCubeTextureMap(
                    Object.fromEntries(
                        Object.entries(model.faces).map(([key, colors]) => [key, this.createSquareCircle4FaceTexture(colors)])
                    )
                );
            }

            if (cubeType === 'squareCircle8') {
                return this.buildCubeTextureMap(
                    Object.fromEntries(
                        Object.entries(model.faces).map(([key, colors]) => [key, this.createSquareCircle8FaceTexture(colors)])
                    )
                );
            }

            if (cubeType === 'octahedron') {
                return Object.fromEntries(
                    this.octahedronFaceKeys.map(key => [key, this.createOctahedronFaceTexture(key, model.faces[key])])
                );
            }

            if (cubeType === 'cornerOcta') {
                return Object.fromEntries(
                    this.octahedronFaceKeys.map(key => [key, this.createCornerOctaFaceTexture(key, model.faces[key])])
                );
            }

            if (cubeType === 'twinOctahedron') {
                return Object.fromEntries(
                    this.octahedronFaceKeys.map(key => [key, this.createTwinOctaFaceTexture(key, model.faces[key])])
                );
            }

            return {};
        }

        prepareRaisedMagicWheelTextures(cubeType, model) {
            this.raisedTextureCache = {};
            if (!model || !['squareCircle4', 'squareCircle8'].includes(cubeType)) return;

            const isFourPart = cubeType === 'squareCircle4';
            const createTexture = (colors) => isFourPart
                ? this.createSquareCircle4FaceTexture(colors, 256, true)
                : this.createSquareCircle8FaceTexture(colors, 256, true);

            const topTextures = Object.fromEntries(
                Object.entries(model.faces).map(([key, colors]) => [key, createTexture(colors)])
            );
            this.raisedTextureCache = this.buildCubeTextureMap(topTextures);
        }

        render() {
            if (!this.canvas || !this.ctx || !this.model || !this.currentCubeType) return;

            this.resizeCanvas();
            const ctx = this.ctx;
            const width = this.canvas.width;
            const height = this.canvas.height;
            ctx.clearRect(0, 0, width, height);

            ctx.save();
            ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
            ctx.fillRect(0, 0, width, height);
            ctx.restore();

            if (['corner', 'squareCircle4', 'squareCircle8'].includes(this.currentCubeType)) {
                this.drawCubePreview(width, height);
            } else {
                this.drawOctahedronPreview(width, height);
            }
        }

        resizeCanvas() {
            if (!this.canvas || !this.ctx) return;
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const width = Math.max(240, Math.round(rect.width * dpr));
            const height = Math.max(240, Math.round(rect.height * dpr));
            if (this.canvas.width !== width || this.canvas.height !== height) {
                this.canvas.width = width;
                this.canvas.height = height;
            }
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        drawCubePreview(width, height) {
            const ctx = this.ctx;
            const centerX = width / 2;
            const centerY = height / 2 - Math.min(width, height) * 0.03;
            const scale = Math.min(width, height) * 0.18;
            const light = this.normalize({ x: 0.45, y: 0.75, z: 1.1 });
            const isMagicWheel = this.currentCubeType === 'squareCircle4' || this.currentCubeType === 'squareCircle8';

            const faces = [
                { key: 'U', vertices: [{ x: -1, y: 1, z: -1 }, { x: 1, y: 1, z: -1 }, { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }] },
                { key: 'D', vertices: [{ x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 }, { x: 1, y: -1, z: -1 }, { x: -1, y: -1, z: -1 }] },
                { key: 'F', vertices: [{ x: -1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }, { x: 1, y: -1, z: 1 }, { x: -1, y: -1, z: 1 }] },
                { key: 'B', vertices: [{ x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 }, { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 }] },
                { key: 'R', vertices: [{ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: -1 }, { x: 1, y: -1, z: -1 }, { x: 1, y: -1, z: 1 }] },
                { key: 'L', vertices: [{ x: -1, y: 1, z: -1 }, { x: -1, y: 1, z: 1 }, { x: -1, y: -1, z: 1 }, { x: -1, y: -1, z: -1 }] }
            ];

            ctx.save();
            ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
            ctx.beginPath();
            ctx.ellipse(centerX, centerY + scale * 1.55, scale * 2.1, scale * 0.42, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            const projectedFaces = faces.map(face => {
                const rotated = face.vertices.map(vertex => this.rotatePoint(vertex));
                // 贴图顶点顺序由各面的 2D 朝向决定，不保证三维绕序一致。
                // 根据面中心自动把法线修正到朝外，避免显示背面。
                const normal = this.getOutwardNormal(rotated);
                const projected = rotated.map(point => this.projectPoint(point, scale, centerX, centerY));
                return {
                    key: face.key,
                    normal,
                    rotated,
                    projected,
                    depth: rotated.reduce((sum, point) => sum + point.z, 0) / rotated.length
                };
            }).filter(face => face.normal.z > 0.02)
              .sort((a, b) => a.depth - b.depth);

            projectedFaces.forEach(face => {
                const texture = this.faceTextureCache[face.key];
                if (texture) {
                    const quad = this.getCubeTextureQuad(face.key, face.projected);
                    this.drawAffineTexturedQuad(ctx, texture, quad[0], quad[1], quad[2], quad[3]);
                }

                // 原公式即使在最亮面也会覆盖约 20% 黑色，导致 3D 颜色明显偏暗。
                // 现在只对背离光源的面施加 0~10% 的阴影，最亮面保持原始贴图颜色。
                const diffuse = Math.max(0, Math.min(1, this.dot(face.normal, light)));
                const overlay = (1 - diffuse) * this.faceShadowStrength;
                ctx.save();
                ctx.beginPath();
                face.projected.forEach((point, index) => {
                    if (index === 0) ctx.moveTo(point.x, point.y);
                    else ctx.lineTo(point.x, point.y);
                });
                ctx.closePath();
                ctx.fillStyle = `rgba(0, 0, 0, ${overlay.toFixed(3)})`;
                ctx.fill();
                ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
                ctx.lineWidth = isMagicWheel
                    ? Math.max(0.9, Math.min(width, height) * 0.0022)
                    : Math.max(1.35, Math.min(width, height) * 0.0044);
                ctx.stroke();
                ctx.restore();

                if (isMagicWheel) {
                    this.drawRaisedMagicWheel(face, scale, light);
                }
            });
        }

        drawRaisedMagicWheel(face, scale, light) {
            const topTexture = this.raisedTextureCache[face.key];
            const faceColors = this.model?.faces?.[face.key];
            if (!topTexture || !faceColors || !face.rotated) return;

            const quad = this.getCubeTextureQuad(face.key, face.projected);
            const depth = this.magicWheelExtrusion;
            const dx = face.normal.x * scale * depth;
            const dy = -face.normal.y * scale * depth;

            // 圆盘在 256×256 贴图中的半径是 21.33/80。
            const radiusUV = 21.33 / 80;
            const mapUV = (u, v) => ({
                x: quad[0].x + (quad[1].x - quad[0].x) * u + (quad[3].x - quad[0].x) * v,
                y: quad[0].y + (quad[1].y - quad[0].y) * u + (quad[3].y - quad[0].y) * v
            });
            const circlePoint = (angle, raised = false) => {
                const point = mapUV(
                    0.5 + Math.cos(angle) * radiusUV,
                    0.5 + Math.sin(angle) * radiusUV
                );
                return raised ? { x: point.x + dx, y: point.y + dy } : point;
            };

            // 贴图横向和纵向在旋转后的三维空间中的单位基向量。
            const basisU = this.normalize(this.subtract(face.rotated[1], face.rotated[0]));
            const basisV = this.normalize(this.subtract(face.rotated[3], face.rotated[0]));
            const sideNormalAt = (angle) => this.normalize({
                x: basisU.x * Math.cos(angle) + basisV.x * Math.sin(angle),
                y: basisU.y * Math.cos(angle) + basisV.y * Math.sin(angle),
                z: basisU.z * Math.cos(angle) + basisV.z * Math.sin(angle)
            });

            // 只绘制朝向摄像机的半圆周侧壁。每一片是真正的四边形侧面，
            // 不再反复覆盖整张深色圆盘，因此不会产生发黑的抗锯齿叠层。
            for (let i = 0; i < this.magicWheelSideSegments; i++) {
                const a0 = i / this.magicWheelSideSegments * Math.PI * 2;
                const a1 = (i + 1) / this.magicWheelSideSegments * Math.PI * 2;
                const mid = (a0 + a1) / 2;
                const sideNormal = sideNormalAt(mid);
                if (sideNormal.z <= 0.001) continue;

                const base0 = circlePoint(a0, false);
                const base1 = circlePoint(a1, false);
                const top1 = circlePoint(a1, true);
                const top0 = circlePoint(a0, true);
                const sectorIndex = this.getMagicWheelSectorIndex(mid);
                const sourceColor = faceColors[sectorIndex] ?? faceColors[0];
                const diffuse = Math.max(0, Math.min(1, this.dot(sideNormal, light)));
                const factor = Math.min(1, this.magicWheelSideAmbient + this.magicWheelSideDiffuse * diffuse);

                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.moveTo(base0.x, base0.y);
                this.ctx.lineTo(base1.x, base1.y);
                this.ctx.lineTo(top1.x, top1.y);
                this.ctx.lineTo(top0.x, top0.y);
                this.ctx.closePath();
                const sideColor = this.shadeColor(sourceColor, factor);
                this.ctx.fillStyle = sideColor;
                this.ctx.strokeStyle = sideColor;
                this.ctx.lineWidth = 0.8;
                this.ctx.fill();
                // 用同色描边封住分片之间的抗锯齿细缝，不会形成黑色圆周。
                this.ctx.stroke();
                this.ctx.restore();
            }

            // 只在真实扇区分界处画侧壁接缝，避免 64 个分片都出现黑线。
            const sectorCount = this.currentCubeType === 'squareCircle4' ? 4 : 8;
            for (let i = 0; i < sectorCount; i++) {
                const angle = -Math.PI / 2 + i * Math.PI * 2 / sectorCount;
                if (sideNormalAt(angle).z <= 0.001) continue;
                const base = circlePoint(angle, false);
                const top = circlePoint(angle, true);
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.moveTo(base.x, base.y);
                this.ctx.lineTo(top.x, top.y);
                this.ctx.strokeStyle = 'rgba(15, 23, 42, 0.28)';
                this.ctx.lineWidth = Math.max(0.45, scale * 0.006);
                this.ctx.stroke();
                this.ctx.restore();
            }

            // 最后只绘制一次原色圆盘顶面。
            const topQuad = quad.map(point => ({ x: point.x + dx, y: point.y + dy }));
            this.drawAffineTexturedQuad(
                this.ctx,
                topTexture,
                topQuad[0], topQuad[1], topQuad[2], topQuad[3]
            );
        }

        getMagicWheelSectorIndex(angle) {
            let normalized = angle;
            while (normalized < -Math.PI / 2) normalized += Math.PI * 2;
            while (normalized >= Math.PI * 3 / 2) normalized -= Math.PI * 2;

            if (this.currentCubeType === 'squareCircle8') {
                return Math.floor((normalized + Math.PI / 2) / (Math.PI / 4)) % 8;
            }

            // 四分轮的 2D 路径编号为：右下、右上、左上、左下。
            const x = Math.cos(angle);
            const y = Math.sin(angle);
            if (x >= 0 && y >= 0) return 0;
            if (x >= 0 && y < 0) return 1;
            if (x < 0 && y < 0) return 2;
            return 3;
        }

        shadeColor(color, factor) {
            const hex = this.normalizeColor(color).replace('#', '');
            const value = Number.parseInt(hex, 16);
            if (!Number.isFinite(value)) return this.normalizeColor(color);
            const clamp = channel => Math.max(0, Math.min(255, Math.round(channel * factor)));
            const r = clamp((value >> 16) & 255);
            const g = clamp((value >> 8) & 255);
            const b = clamp(value & 255);
            return `rgb(${r}, ${g}, ${b})`;
        }

        drawOctahedronPreview(width, height) {
            const ctx = this.ctx;
            const centerX = width / 2;
            const centerY = height / 2 - Math.min(width, height) * 0.02;
            const scale = Math.min(width, height) * 0.26;
            const light = this.normalize({ x: 0.45, y: 0.85, z: 1.15 });
            const faceVertices = this.getOctahedronFaceVertices();

            ctx.save();
            ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
            ctx.beginPath();
            ctx.ellipse(centerX, centerY + scale * 1.2, scale * 1.45, scale * 0.28, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            const visibleFaces = Object.entries(faceVertices).map(([faceKey, vertices]) => {
                const rotated = vertices.map(vertex => this.rotatePoint(vertex));
                // 贴图顶点顺序由各面的 2D 朝向决定，不保证三维绕序一致。
                // 根据面中心自动把法线修正到朝外，避免显示背面。
                const normal = this.getOutwardNormal(rotated);
                return {
                    faceKey,
                    normal,
                    projected: rotated.map(point => this.projectPoint(point, scale, centerX, centerY)),
                    depth: rotated.reduce((sum, point) => sum + point.z, 0) / rotated.length,
                    texture: this.faceTextureCache[faceKey]
                };
            }).filter(face => face.normal.z > 0.01)
              .sort((a, b) => a.depth - b.depth);

            visibleFaces.forEach(face => {
                if (!face.texture) return;
                const uv = face.texture.uv;
                this.drawTexturedTriangle(
                    ctx,
                    face.texture.canvas,
                    uv[0].x, uv[0].y,
                    uv[1].x, uv[1].y,
                    uv[2].x, uv[2].y,
                    face.projected[0].x, face.projected[0].y,
                    face.projected[1].x, face.projected[1].y,
                    face.projected[2].x, face.projected[2].y
                );

                const diffuse = Math.max(0, Math.min(1, this.dot(face.normal, light)));
                const overlay = (1 - diffuse) * this.faceShadowStrength;
                ctx.save();
                ctx.beginPath();
                face.projected.forEach((point, index) => {
                    if (index === 0) ctx.moveTo(point.x, point.y);
                    else ctx.lineTo(point.x, point.y);
                });
                ctx.closePath();
                ctx.fillStyle = `rgba(0, 0, 0, ${overlay.toFixed(3)})`;
                ctx.fill();
                ctx.strokeStyle = 'rgba(15, 23, 42, 0.42)';
                ctx.lineWidth = Math.max(0.95, Math.min(width, height) * 0.003);
                ctx.stroke();
                ctx.restore();
            });
        }

        getOctahedronFaceVertices() {
            const v = {
                T: { x: 0, y: 1.15, z: 0 },   // U 顶点
                D: { x: 0, y: -1.15, z: 0 },  // D 顶点
                R: { x: 1.05, y: 0, z: 0 },
                F: { x: 0, y: 0, z: 1.05 },
                L: { x: -1.05, y: 0, z: 0 },
                B: { x: 0, y: 0, z: -1.05 }
            };

            // 数组顺序不是随意的：它表示贴图局部三角形的 [v0, v1, v2]。
            // 三种八面体的 2D 编号方向不同，因此分别声明 UV -> 空间顶点映射。
            if (this.currentCubeType === 'octahedron') {
                // 双子八面体：局部 v2 是 U/D，v1 是 F/B，v0 是 R/L。
                return {
                    top4: [v.R, v.F, v.T],
                    top1: [v.R, v.B, v.T],
                    top2: [v.L, v.B, v.T],
                    top3: [v.L, v.F, v.T],
                    bottom4: [v.R, v.F, v.D],
                    bottom1: [v.R, v.B, v.D],
                    bottom2: [v.L, v.B, v.D],
                    bottom3: [v.L, v.F, v.D]
                };
            }

            if (['cornerOcta', 'twinOctahedron'].includes(this.currentCubeType)) {
                // 转角八面体和二阶转面八面体的局部 v0/v1 方向都是交替的。
                // 白(top4)、橙(top2)、绿(bottom3)、灰(bottom1)四个面
                // 必须交换前两个 UV 顶点，否则其内部图案会左右镜像。
                return {
                    top4: [v.R, v.F, v.T],
                    top1: [v.B, v.R, v.T],
                    top2: [v.L, v.B, v.T],
                    top3: [v.F, v.L, v.T],
                    bottom4: [v.F, v.R, v.D],
                    bottom1: [v.R, v.B, v.D],
                    bottom2: [v.B, v.L, v.D],
                    bottom3: [v.L, v.F, v.D]
                };
            }

            return {};
        }

        createCornerFaceTexture(faceColors, size = 256) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, size, size);
            ctx.save();
            const ratio = size / 150;
            ctx.scale(ratio, ratio);
            this.cornerFaceRenderer.drawCornerCubeFace(ctx, faceColors, 'front');
            ctx.restore();
            return canvas;
        }

        createSquareCircle4FaceTexture(faceColors, size = 256, wheelOnly = false, darken = 0) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const s = 40;
            const r = 21.33;
            const scale = size / 80;
            const pathDefs = [
                'M 0,0 L 21.33,0 A 21.33,21.33 0 0,1 0 21.33 Z',
                'M 0,0 L 0,-21.33 A 21.33,21.33 0 0,1 21.33 0 Z',
                'M 0,0 L -21.33,0 A 21.33,21.33 0 0,1 0 -21.33 Z',
                'M 0,0 L 0,21.33 A 21.33,21.33 0 0,1 -21.33 0 Z',
                'M 0,-40 L 0,-21.33 A 21.33,21.33 0 0,1 21.33 0 L 40,0 L 40,-40 Z',
                'M 40,0 L 21.33,0 A 21.33,21.33 0 0,1 0 21.33 L 0,40 L 40,40 Z',
                'M 0,40 L 0,21.33 A 21.33,21.33 0 0,1 -21.33 0 L -40,0 L -40,40 Z',
                'M -40,-40 L -40,0 L -21.33,0 A 21.33,21.33 0 0,1 0 -21.33 L 0,-40 Z'
            ];

            ctx.clearRect(0, 0, size, size);
            ctx.save();
            ctx.translate(size / 2, size / 2);
            ctx.scale(scale, scale);
            if (wheelOnly) {
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.clip();
            }
            const visiblePaths = wheelOnly ? pathDefs.slice(0, 4) : pathDefs;
            visiblePaths.forEach((path, index) => {
                const piece = new Path2D(path);
                ctx.fillStyle = this.normalizeColor(faceColors[index] || 0);
                ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
                ctx.lineWidth = 0.55;
                ctx.fill(piece);
                ctx.stroke(piece);
            });
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.75)';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-s, 0);
            ctx.lineTo(s, 0);
            ctx.moveTo(0, -s);
            ctx.lineTo(0, s);
            ctx.stroke();
            ctx.restore();

            if (darken > 0) {
                ctx.save();
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = `rgba(0, 0, 0, ${darken})`;
                ctx.fillRect(0, 0, size, size);
                ctx.restore();
            }
            return canvas;
        }

        createSquareCircle8FaceTexture(faceColors, size = 256, wheelOnly = false, darken = 0) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const s = 40;
            const r = 21.33;
            const c = r / Math.sqrt(2);
            const scale = size / 80;
            const pathDefs = [
                `M 0,0 L 0,${-r} A ${r},${r} 0 0,1 ${c} ${-c} Z`,
                `M 0,0 L ${c},${-c} A ${r},${r} 0 0,1 ${r},0 Z`,
                `M 0,0 L ${r},0 A ${r},${r} 0 0,1 ${c},${c} Z`,
                `M 0,0 L ${c},${c} A ${r},${r} 0 0,1 0,${r} Z`,
                `M 0,0 L 0,${r} A ${r},${r} 0 0,1 ${-c},${c} Z`,
                `M 0,0 L ${-c},${c} A ${r},${r} 0 0,1 ${-r},0 Z`,
                `M 0,0 L ${-r},0 A ${r},${r} 0 0,1 ${-c},${-c} Z`,
                `M 0,0 L ${-c},${-c} A ${r},${r} 0 0,1 0,${-r} Z`,
                `M 0,${-s} L 0,${-r} A ${r},${r} 0 0,1 ${r},0 L ${s},0 L ${s},${-s} Z`,
                `M ${s},0 L ${r},0 A ${r},${r} 0 0,1 0,${r} L 0,${s} L ${s},${s} Z`,
                `M 0,${s} L 0,${r} A ${r},${r} 0 0,1 ${-r},0 L ${-s},0 L ${-s},${s} Z`,
                `M ${-s},${-s} L ${-s},0 L ${-r},0 A ${r},${r} 0 0,1 0,${-r} L 0,${-s} Z`
            ];

            ctx.clearRect(0, 0, size, size);
            ctx.save();
            ctx.translate(size / 2, size / 2);
            ctx.scale(scale, scale);
            if (wheelOnly) {
                ctx.beginPath();
                ctx.arc(0, 0, r, 0, Math.PI * 2);
                ctx.clip();
            }
            const visiblePaths = wheelOnly ? pathDefs.slice(0, 8) : pathDefs;
            visiblePaths.forEach((path, index) => {
                const piece = new Path2D(path);
                ctx.fillStyle = this.normalizeColor(faceColors[index] || 0);
                ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
                ctx.lineWidth = 0.55;
                ctx.fill(piece);
                ctx.stroke(piece);
            });
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.75)';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-s, 0);
            ctx.lineTo(s, 0);
            ctx.moveTo(0, -s);
            ctx.lineTo(0, s);
            ctx.stroke();
            ctx.restore();

            if (darken > 0) {
                ctx.save();
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = `rgba(0, 0, 0, ${darken})`;
                ctx.fillRect(0, 0, size, size);
                ctx.restore();
            }
            return canvas;
        }

        buildCubeTextureMap(textures) {
            if (!textures) return {};
            // 数据面与几何面必须一一对应。旧代码在这里交换了 L/R，
            // 会直接造成左右两个面的颜色和状态互换。
            return {
                U: textures.U,
                D: textures.D,
                F: textures.F,
                B: textures.B,
                L: textures.L,
                R: textures.R
            };
        }

        getCubeTextureQuad(faceKey, projected) {
            // drawCubePreview 中每个面的顶点本来就是
            // [左上, 右上, 右下, 左下]，无需再将 U/F/D/B 旋转 180°。
            return projected;
        }

        createOctahedronFaceTexture(faceKey, faceColors, size = 260) {
            const isTopFace = faceKey.startsWith('top');
            const needsMirror = faceKey === 'top1' || faceKey === 'top3' || faceKey === 'bottom1' || faceKey === 'bottom3';
            const a = 1.5 * RENDER_CONFIG.SVG_SCALE_TWIN;
            const projectionFactor = RENDER_CONFIG.PROJECTION_FACTOR;
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
            const centerTriangle = [9, 10, 11];

            const projectedPoints = points3D.map((p) => {
                let x;
                let y;
                if (isTopFace) {
                    x = (p[0] - p[1]) * projectionFactor;
                    y = (p[0] + p[1] - p[2] * 0.5) * projectionFactor;
                } else {
                    x = (p[0] - p[1]) * projectionFactor;
                    y = (-p[0] - p[1] + p[2] * 0.5) * projectionFactor;
                }
                if (needsMirror) x = -x;
                return { x, y };
            });

            const polygons = quads.map((quad, index) => ({
                points: quad.map(i => projectedPoints[i]),
                color: faceColors[index] || 0
            }));
            polygons.push({
                points: centerTriangle.map(i => projectedPoints[i]),
                color: faceColors[6] || 0
            });

            return this.buildTriangleTexture(
                [projectedPoints[0], projectedPoints[1], projectedPoints[2]],
                polygons,
                size,
                { strokeStyle: 'rgba(15, 23, 42, 0.68)', lineWidth: 1.05 }
            );
        }

        createCornerOctaFaceTexture(faceKey, faceColors, size = 260) {
            const scale = RENDER_CONFIG.SVG_SCALE_CORNER;
            const a = scale;
            const basePoints = [
                [0, 0], [a, 0], [2*a, 0], [3*a, 0],
                [0.5*a, Math.sqrt(3)/2*a], [1.5*a, Math.sqrt(3)/2*a], [2.5*a, Math.sqrt(3)/2*a],
                [a, Math.sqrt(3)*a], [2*a, Math.sqrt(3)*a], [1.5*a, 3*Math.sqrt(3)/2*a]
            ];
            const triangles = [
                [0, 1, 4], [1, 2, 5], [2, 3, 6], [1, 4, 5],
                [2, 5, 6], [4, 5, 7], [5, 6, 8], [5, 7, 8], [7, 8, 9]
            ];
            const needsFlip = faceKey.startsWith('top');

            const points = basePoints.map(([x0, y0]) => {
                let x = x0;
                let y = y0;
                if (needsFlip) {
                    y = -y;
                    x = 3*a - x;
                }
                return { x, y };
            });

            const polygons = triangles.map((triangle, index) => ({
                points: triangle.map(i => points[i]),
                color: faceColors[index] || 0
            }));

            return this.buildTriangleTexture(
                [points[0], points[3], points[9]],
                polygons,
                size,
                { strokeStyle: 'rgba(15, 23, 42, 0.68)', lineWidth: 1.0 }
            );
        }

        createTwinOctaFaceTexture(faceKey, faceColors, size = 260) {
            const a = RENDER_CONFIG.SVG_SCALE_TWIN_OCTA;
            const basePoints = [
                [0, 0],
                [2*a, 0],
                [a, Math.sqrt(3)*a],
                [a, 0],
                [a/2, Math.sqrt(3)/2*a],
                [3*a/2, Math.sqrt(3)/2*a]
            ];
            const triangles = [
                [0, 3, 4],
                [1, 5, 3],
                [2, 4, 5],
                [3, 5, 4]
            ];
            const needsFlip = faceKey === 'top1' || faceKey === 'top2' || faceKey === 'top3' || faceKey === 'top4';

            const points = basePoints.map(([x0, y0]) => {
                let x = x0;
                let y = y0;
                if (needsFlip) {
                    y = -y;
                    x = 2*a - x;
                }
                return { x, y };
            });

            const polygons = triangles.map((triangle, index) => ({
                points: triangle.map(i => points[i]),
                color: faceColors[index] || 0
            }));

            return this.buildTriangleTexture(
                [points[0], points[1], points[2]],
                polygons,
                size,
                { strokeStyle: 'rgba(15, 23, 42, 0.68)', lineWidth: 1.0 }
            );
        }

        buildTriangleTexture(trianglePoints, polygons, size = 260, options = {}) {
            const margin = options.margin || size * 0.1;
            const allPoints = [...trianglePoints, ...polygons.flatMap(item => item.points)];
            const xs = allPoints.map(point => point.x);
            const ys = allPoints.map(point => point.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            const drawableWidth = Math.max(1, maxX - minX);
            const drawableHeight = Math.max(1, maxY - minY);
            const scale = Math.min((size - margin * 2) / drawableWidth, (size - margin * 2) / drawableHeight);

            const transformPoint = (point) => ({
                x: (point.x - minX) * scale + margin,
                y: (point.y - minY) * scale + margin
            });

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, size, size);

            polygons.forEach(item => {
                const transformed = item.points.map(transformPoint);
                ctx.beginPath();
                transformed.forEach((point, index) => {
                    if (index === 0) ctx.moveTo(point.x, point.y);
                    else ctx.lineTo(point.x, point.y);
                });
                ctx.closePath();
                ctx.fillStyle = this.normalizeColor(item.color);
                ctx.fill();
                ctx.strokeStyle = options.strokeStyle || 'rgba(15, 23, 42, 0.7)';
                ctx.lineWidth = options.lineWidth || 1;
                ctx.stroke();
            });

            return {
                canvas,
                uv: trianglePoints.map(transformPoint)
            };
        }

        drawAffineTexturedQuad(ctx, image, p0, p1, p2, p3) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.clip();

            const width = image.width;
            const height = image.height;
            const vxX = (p1.x - p0.x) / width;
            const vxY = (p1.y - p0.y) / width;
            const vyX = (p3.x - p0.x) / height;
            const vyY = (p3.y - p0.y) / height;
            ctx.transform(vxX, vxY, vyX, vyY, p0.x, p0.y);
            ctx.drawImage(image, 0, 0);
            ctx.restore();
        }

        drawTexturedQuad(ctx, image, p0, p1, p2, p3) {
            this.drawTexturedTriangle(ctx, image,
                0, 0,
                image.width, 0,
                image.width, image.height,
                p0.x, p0.y,
                p1.x, p1.y,
                p2.x, p2.y
            );
            this.drawTexturedTriangle(ctx, image,
                0, 0,
                image.width, image.height,
                0, image.height,
                p0.x, p0.y,
                p2.x, p2.y,
                p3.x, p3.y
            );
        }

        drawTexturedTriangle(ctx, image, sx0, sy0, sx1, sy1, sx2, sy2, dx0, dy0, dx1, dy1, dx2, dy2) {
            const denominator = sx0 * (sy1 - sy2) + sx1 * (sy2 - sy0) + sx2 * (sy0 - sy1);
            if (denominator === 0) return;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(dx0, dy0);
            ctx.lineTo(dx1, dy1);
            ctx.lineTo(dx2, dy2);
            ctx.closePath();
            ctx.clip();

            const m11 = (dx0 * (sy1 - sy2) + dx1 * (sy2 - sy0) + dx2 * (sy0 - sy1)) / denominator;
            const m12 = (dy0 * (sy1 - sy2) + dy1 * (sy2 - sy0) + dy2 * (sy0 - sy1)) / denominator;
            const m21 = (dx0 * (sx2 - sx1) + dx1 * (sx0 - sx2) + dx2 * (sx1 - sx0)) / denominator;
            const m22 = (dy0 * (sx2 - sx1) + dy1 * (sx0 - sx2) + dy2 * (sx1 - sx0)) / denominator;
            const m31 = (dx0 * (sx1 * sy2 - sx2 * sy1) + dx1 * (sx2 * sy0 - sx0 * sy2) + dx2 * (sx0 * sy1 - sx1 * sy0)) / denominator;
            const m32 = (dy0 * (sx1 * sy2 - sx2 * sy1) + dy1 * (sx2 * sy0 - sx0 * sy2) + dy2 * (sx0 * sy1 - sx1 * sy0)) / denominator;

            ctx.transform(m11, m12, m21, m22, m31, m32);
            ctx.drawImage(image, 0, 0);
            ctx.restore();
        }

        normalizeColor(color) {
            if (typeof color === 'number') {
                return '#' + color.toString(16).padStart(6, '0');
            }
            if (typeof color === 'string') {
                if (color.startsWith('#')) return color;
                return CORNER_CUBE_COLOR_MAP[color] || color;
            }
            return '#94a3b8';
        }

        getOutwardNormal(vertices) {
            let normal = this.normalize(this.cross(
                this.subtract(vertices[1], vertices[0]),
                this.subtract(vertices[2], vertices[0])
            ));
            const center = vertices.reduce((sum, point) => ({
                x: sum.x + point.x,
                y: sum.y + point.y,
                z: sum.z + point.z
            }), { x: 0, y: 0, z: 0 });

            // 模型都以原点为中心；若法线指向面中心的反方向，则将其翻转。
            if (this.dot(normal, center) < 0) {
                normal = { x: -normal.x, y: -normal.y, z: -normal.z };
            }
            return normal;
        }

        subtract(a, b) {
            return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
        }

        cross(a, b) {
            return {
                x: a.y * b.z - a.z * b.y,
                y: a.z * b.x - a.x * b.z,
                z: a.x * b.y - a.y * b.x
            };
        }

        dot(a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        }

        normalize(vector) {
            const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
            return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
        }

        rotatePoint(point) {
            const cosY = Math.cos(this.rotation.yaw);
            const sinY = Math.sin(this.rotation.yaw);
            const x1 = point.x * cosY + point.z * sinY;
            const z1 = -point.x * sinY + point.z * cosY;

            const cosX = Math.cos(this.rotation.pitch);
            const sinX = Math.sin(this.rotation.pitch);
            const y2 = point.y * cosX - z1 * sinX;
            const z2 = point.y * sinX + z1 * cosX;

            return { x: x1, y: y2, z: z2 };
        }

        projectPoint(point, scale, centerX, centerY) {
            return {
                x: centerX + point.x * scale,
                y: centerY - point.y * scale,
                z: point.z
            };
        }
    }

    // ===== 魔方计时器应用主控制器 =====
    class CubeTimerApp {
        constructor() {
            this.state = {
                theme: 'light',
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
                    twinOctahedron: [],
                    squareCircle4: [],
                    squareCircle8: []
                },
                // 统一的打乱计数器结构（按魔方类型分组）
                counters: {
                    corner: 1,
                    octahedron: 1,
                    cornerOcta: 1,
                    twinOctahedron: 1,
                    squareCircle4: 1,
                    squareCircle8: 1
                },
                // 统一的生成打乱公式结构（按魔方类型分组）
                generatedScrambles: {
                    corner: [],
                    octahedron: [],
                    cornerOcta: [],
                    twinOctahedron: [],
                    squareCircle4: [],
                    squareCircle8: []
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
            this.elements.cycleSelect = getEl('cycleSelect', true);
            this.elements.zeroProbSelect = getEl('zeroProbSelect', true);

            // 双子八面体魔方视图和控制面板元素
            this.elements.octahedronView = getEl('face-container-octa-twin');
            this.elements.octahedronControls = getEl('octahedron-scramble-controls', true);

            // 转角八面体魔方视图和控制面板元素
            this.elements.cornerOctaView = getEl('face-container-octa-corner');
            this.elements.cornerOctaControls = getEl('cornerOcta-scramble-controls');

            // 二阶转面八面体魔方视图和控制面板元素
            this.elements.twinOctahedronView = getEl('face-container-twin-octahedron');
            this.elements.twinOctahedronControls = getEl('twinOctahedron-scramble-controls', true);

            // 二阶魔轮·四分轮视图和控制面板元素
            this.elements.squareCircle4View = getEl('face-container-square-circle4');
            this.elements.squareCircle4Controls = getEl('squareCircle4-scramble-controls', true);

            // 二阶魔轮·八分轮视图和控制面板元素
            this.elements.squareCircle8View = getEl('face-container-square-circle8');
            this.elements.squareCircle8Controls = getEl('squareCircle8-scramble-controls', true);

            // 通用元素
            this.elements.scrambleContent = getEl('scrambleContent');
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
            this.elements.timerStartBtn = getEl('timerStartBtn', true);
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
            this.elements.scrambleExportToggle = getEl('scrambleExportToggle', true);
            this.elements.exportScramblesBtn = getEl('exportScramblesBtn');
            this.elements.scramblesList = getEl('scramblesList', true); // 可选元素

            // 打乱控制选项元素
            this.elements.cornerOctaScrambleType = getEl('cornerOctaScrambleType', true);

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
                updateCustomCubeSelect();
            });
            
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
                    this.toggleTimer();
                });
            }
            
            if (this.elements.timerResetBtn) {
                this.elements.timerResetBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.resetTimer();
                });
            }
            
            // 添加触摸覆盖层的事件监听
            const timerTouchOverlay = document.getElementById('timerTouchOverlay');
            if (timerTouchOverlay) {
                timerTouchOverlay.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleTimer();
                });

                // 添加触摸事件支持
                timerTouchOverlay.addEventListener('touchstart', (e) => {
                    e.preventDefault();
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
            if (this.elements.scrambleExportToggle) {
                this.elements.scrambleExportToggle.addEventListener('click', () => this.toggleScrambleExportPanel());
            }
            if (this.elements.exportScramblesBtn) {
                this.elements.exportScramblesBtn.addEventListener('click', () => {
                    this.exportScrambles();
                    this.closeScrambleExportPanel();
                });
            }
            
            // 键盘事件监听 - 使用capture阶段确保事件优先处理
            document.addEventListener('keydown', (e) => {
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
                                
                                // 如果按住时间超过0.5秒，则直接开始计时
                                if (this.spaceIsLongPress && this.state.timerState === 'ready') {
                                    this.startTimer();
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
                statsContainer.classList.remove('closing');
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
                statsContainer.classList.add('closing');
                statsContainer.classList.remove('show');
                window.setTimeout(() => {
                    statsContainer.classList.remove('closing');
                }, 160);
            }
            if (closeBtn) {
                window.setTimeout(() => {
                    closeBtn.classList.remove('show');
                }, 120);
            }
        }

        toggleScrambleExportPanel() {
            const section = document.querySelector('.scramble-export-section');
            if (!section) return;

            const isOpen = section.classList.toggle('open');
            if (this.elements.scrambleExportToggle) {
                this.elements.scrambleExportToggle.setAttribute('aria-expanded', String(isOpen));
            }
        }

        closeScrambleExportPanel() {
            const section = document.querySelector('.scramble-export-section');
            if (section) {
                section.classList.remove('open');
            }
            if (this.elements.scrambleExportToggle) {
                this.elements.scrambleExportToggle.setAttribute('aria-expanded', 'false');
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
                    updateCustomCubeSelect();
        
        
        
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
            const squareCircle4Controls = document.getElementById('squareCircle4-scramble-controls');
            const squareCircle8Controls = document.getElementById('squareCircle8-scramble-controls');

            if (cornerControls) cornerControls.style.display = this.state.currentCubeType === 'corner' ? 'flex' : 'none';
            if (cornerOctaControls) cornerOctaControls.style.display = this.state.currentCubeType === 'cornerOcta' ? 'flex' : 'none';
            if (octahedronControls) octahedronControls.style.display = this.state.currentCubeType === 'octahedron' ? 'flex' : 'none';
            if (twinOctahedronControls) twinOctahedronControls.style.display = this.state.currentCubeType === 'twinOctahedron' ? 'flex' : 'none';
            if (squareCircle4Controls) squareCircle4Controls.style.display = this.state.currentCubeType === 'squareCircle4' ? 'flex' : 'none';
            if (squareCircle8Controls) squareCircle8Controls.style.display = this.state.currentCubeType === 'squareCircle8' ? 'flex' : 'none';

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

            const squareCircle4Elements = [
                this.elements.squareCircle4View,
                this.elements.squareCircle4Controls
            ];

            const squareCircle8Elements = [
                this.elements.squareCircle8View,
                this.elements.squareCircle8Controls
            ];

            // 根据当前状态统一设置显示状态
            const isCorner = this.state.currentCubeType === 'corner';
            const isOctahedron = this.state.currentCubeType === 'octahedron';
            const isCornerOcta = this.state.currentCubeType === 'cornerOcta';
            const isTwinOctahedron = this.state.currentCubeType === 'twinOctahedron';
            const isSquareCircle4 = this.state.currentCubeType === 'squareCircle4';
            const isSquareCircle8 = this.state.currentCubeType === 'squareCircle8';
            
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
            if (this.elements.squareCircle4View) {
                this.elements.squareCircle4View.style.display = isSquareCircle4 ? 'grid' : 'none';
            }
            if (this.elements.squareCircle8View) {
                this.elements.squareCircle8View.style.display = isSquareCircle8 ? 'grid' : 'none';
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
            if (this.elements.squareCircle4Controls) {
                this.elements.squareCircle4Controls.style.display = isSquareCircle4 ? 'flex' : 'none';
            }
            if (this.elements.squareCircle8Controls) {
                this.elements.squareCircle8Controls.style.display = isSquareCircle8 ? 'flex' : 'none';
            }
        }
        
        // 更新打乱计数器 - 基于currentCubeType状态
        updateScrambleCounter() {
            this.state.scrambleCounter = this.getCurrentCounter();
        }
        
        // 更新打乱计数器显示
        updateScrambleCounterDisplay() {
            // scrambleNumber显示已移除
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
                // 转角三阶魔方使用83步打乱
                config.scrambleLength = 83;
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
            const savedTheme = StorageHelper.getItem(APP_CONFIG.STORAGE_KEYS.THEME, 'light');
            this.applyTheme(savedTheme);
        }

        saveTheme(theme) {
            StorageHelper.setItem(APP_CONFIG.STORAGE_KEYS.THEME, theme);
        }
        
        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            document.body.setAttribute('data-theme', theme);
            updateLogoForTheme(theme);
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
                console.warn('Error playing beep:', error);
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
            StorageHelper.setItem(APP_CONFIG.STORAGE_KEYS.SOUND_ENABLED, this.state.soundEnabled);
        }

        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            document.body.setAttribute('data-theme', newTheme);
            updateLogoForTheme(newTheme);
            
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
            StorageHelper.setItem(APP_CONFIG.STORAGE_KEYS.THEME, newTheme);
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
            const saved = StorageHelper.getItem(APP_CONFIG.STORAGE_KEYS.SOUND_ENABLED);
            if (saved !== null) {
                this.state.soundEnabled = saved === true || saved === 'true';
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
                const timeRecords = {
                    currentCubeType: this.state.currentCubeType || 'corner',
                    times: this.state.times,
                    counters: this.state.counters,
                    generatedScrambles: this.state.generatedScrambles
                };
                const data = JSON.stringify(timeRecords);
                StorageHelper.setItem(APP_CONFIG.STORAGE_KEYS.RECORDS, data);
            } catch (e) {
                console.error('保存时间记录失败:', e);
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
                        twinOctahedron: [],
                        squareCircle4: [],
                        squareCircle8: []
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

            const cubeTypes = ['corner', 'octahedron', 'cornerOcta', 'twinOctahedron', 'squareCircle4', 'squareCircle8'];

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
                twinOctahedron: [],
                squareCircle4: [],
                squareCircle8: []
            };
            this.state.counters = {
                corner: 1,
                octahedron: 1,
                cornerOcta: 1,
                twinOctahedron: 1,
                squareCircle4: 1,
                squareCircle8: 1
            };
            this.state.generatedScrambles = {
                corner: [],
                octahedron: [],
                cornerOcta: [],
                twinOctahedron: [],
                squareCircle4: [],
                squareCircle8: []
            };
            this.state.scrambleCounter = 1;
        }

        /**
 * 从localStorage恢复时间记录
 * 包括所有魔方类型的成绩、计数器和生成的打乱公式
 */
        restoreTimeRecords() {
            try {
                const savedRecords = StorageHelper.getItem(APP_CONFIG.STORAGE_KEYS.RECORDS);

                if (!savedRecords) {
                    this.initializeDefaultState();
                    return;
                }

                const timeRecords = typeof savedRecords === 'string' ? JSON.parse(savedRecords) : savedRecords;

                if (!this.validateTimeRecords(timeRecords)) {
                    this.initializeDefaultState();
                    return;
                }

                this.state.currentCubeType = timeRecords.currentCubeType || 'corner';

                if (timeRecords.times && timeRecords.counters && timeRecords.generatedScrambles) {
                    this.state.times = timeRecords.times;
                    this.state.counters = timeRecords.counters;
                    this.state.generatedScrambles = timeRecords.generatedScrambles;
                } else {
                    this.state.times = {
                        corner: timeRecords.cornerTimes || [],
                        octahedron: timeRecords.octahedronTimes || [],
                        cornerOcta: timeRecords.cornerOctaTimes || [],
                        twinOctahedron: timeRecords.twinOctahedronTimes || [],
                        squareCircle4: [],
                        squareCircle8: []
                    };
                    this.state.counters = {
                        corner: timeRecords.cornerScrambleCounter || 1,
                        octahedron: timeRecords.octahedronScrambleCounter || 1,
                        cornerOcta: timeRecords.cornerOctaScrambleCounter || 1,
                        twinOctahedron: timeRecords.twinOctahedronScrambleCounter || 1,
                        squareCircle4: 1,
                        squareCircle8: 1
                    };
                    this.state.generatedScrambles = {
                        corner: timeRecords.cornerGeneratedScrambles || [],
                        octahedron: timeRecords.octahedronGeneratedScrambles || [],
                        cornerOcta: timeRecords.cornerOctaGeneratedScrambles || [],
                        twinOctahedron: timeRecords.twinOctahedronGeneratedScrambles || [],
                        squareCircle4: [],
                        squareCircle8: []
                    };
                }
            } catch (e) {
                console.error('恢复时间记录失败:', e);
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
    
            // 获取当前打乱步骤（可能是数组或字符串）
            let steps = this.state.currentScramble;
            if (typeof steps === 'string') {
                steps = steps.split(' ');
            } else if (!Array.isArray(steps)) {
                steps = [];
            }

            steps.forEach(step => {
                const stepElement = document.createElement('span');
                // 基础类保留
                stepElement.className = 'scramble-step';
        
                // 根据是否包含小写字母添加额外类
                // 检测字符串中是否有任何小写字母
                if (/[a-z]/.test(step)) {
                    stepElement.classList.add('scramble-step-lower');
                } else {
                    stepElement.classList.add('scramble-step-upper');
                }
        
                stepElement.textContent = step;
                this.elements.scrambleContent.appendChild(stepElement);
            });

            this.adjustScrambleSectionHeight();
        }


        // 动态调整打乱公式区域高度和计时区位置
        adjustScrambleSectionHeight() {
            const scrambleControlsSection = document.querySelector('.scramble-controls-section');
            const timerSection = document.querySelector('.timer-main-section');

            if (timerSection) {
                if (window.innerWidth <= 768) {
                    // 手机端打乱区和计时区都处于正常文档流，打乱区已经占据了自身高度，
                    // 不能再次把它的高度作为计时区顶部 padding，否则会产生一整块重复空白。
                    timerSection.style.top = '';
                    timerSection.style.height = '';
                    timerSection.style.removeProperty('--mobile-scramble-offset');
                    return;
                }

                if (scrambleControlsSection) {
                    // 计时区顶部 = 打乱区底部 + 1rem (16px)
                    const scrambleBottom = scrambleControlsSection.offsetTop + scrambleControlsSection.offsetHeight;
                    const timerTop = scrambleBottom + 16;
                    timerSection.style.top = timerTop + 'px';

                    // 计时区高度 = 容器高度 - 计时区顶部 - 1rem (16px)，与历史区底边对齐
                    const containerHeight = document.querySelector('.container').offsetHeight;
                    const newTimerHeight = containerHeight - timerTop - 16;
                    timerSection.style.height = Math.max(320, newTimerHeight) + 'px';
                }
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
                // 先显示模态框，确保2D/3D容器拥有正确尺寸后再渲染
                modal.style.display = 'flex';
                requestAnimationFrame(() => this.updateCoordinateModalContent());
                
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
            
            const currentCubeType = this.state.currentCubeType;
            const cubeInfo = cubeRegistry.getConfig(currentCubeType);
            if (!cubeInfo) return;
            
            // 初始化坐标弹窗的持久化魔方实例
            this.coordinateCube = new cubeInfo.model();
            this.coordinateCubeType = currentCubeType;
            
            // 更新标题
            const header = document.querySelector('.coordinate-header h3');
            if (header) {
                const typeNames = {
                    corner: '转角三阶',
                    octahedron: '双子八面体',
                    cornerOcta: '转角八面体',
                    twinOctahedron: '二阶转面八面体',
                    squareCircle4: '二阶魔轮·四分轮',
                    squareCircle8: '二阶魔轮·八分轮'
                };
                header.textContent = `${typeNames[currentCubeType] || '魔方'}转动方式`;
            }
            
            // 清空并设置容器
            const svgContainer = document.getElementById('coordinateSvgContainer');
            const buttonsContainer = document.getElementById('coordinateMoveButtons');
            
            if (svgContainer) {
                svgContainer.innerHTML = '';
            }
            
            if (buttonsContainer) {
                buttonsContainer.innerHTML = '';
                const moves = this.getMoveButtonsForCubeType(currentCubeType);
                const firstLowercaseIndex = moves.findIndex(move => /^[a-z]/.test(move));
                
                moves.forEach((move, index) => {
                    const btn = document.createElement('button');
                    btn.className = 'coordinate-move-btn';
                    // 在响应式网格列数不能整除 6 时，也强制小写组另起一行。
                    if (index === firstLowercaseIndex) {
                        btn.classList.add('coordinate-move-btn-group-start');
                    }
                    btn.textContent = move;
                    btn.addEventListener('click', () => {
                        this.handleMoveButtonClick(move, currentCubeType);
                    });
                    buttonsContainer.appendChild(btn);
                });
            }
            
            // 设置重置按钮
            const resetBtn = document.getElementById('coordinateResetBtn');
            if (resetBtn) {
                resetBtn.textContent = typeof t === 'function' ? t('resetCube') : '重置魔方';
                resetBtn.onclick = () => {
                    this.resetCoordinateCube();
                };
            }

            // 初始化3D渲染器
            const coordinate3dCanvas = document.getElementById('coordinate3dCanvas');
            if (coordinate3dCanvas) {
                if (!this.coordinate3DRenderer) {
                    this.coordinate3DRenderer = new Coordinate3DRenderer(coordinate3dCanvas);
                } else {
                    this.coordinate3DRenderer.setCanvas(coordinate3dCanvas);
                }
                // 每次打开“转动方式”都恢复该魔方类型的标准观察方向。
                this.coordinate3DRenderer.resetViewForCubeType(currentCubeType);
            }
            
            // 渲染初始已还原状态（延迟到下一帧，确保容器尺寸正确）
            requestAnimationFrame(() => {
                this.renderCoordinateView(currentCubeType, this.coordinateCube);
            });
        }
        
        getMoveButtonsForCubeType(cubeType) {
            const moveSets = {
                corner: [
                    'U', 'R', 'F', 'D', 'B', 'L',
                    'UFR', 'UFL', 'DFR', 'DFL',
                    'UBR', 'UBL', 'DBR', 'DBL'
                ],
                octahedron: ['U', 'R', 'F', 'D', 'B', 'L'],
                cornerOcta: [
                    'U', 'R', 'F', 'D', 'B', 'L',
                    'u', 'r', 'f', 'd', 'b', 'l'
                ],
                twinOctahedron: ['R', 'U', 'F', 'L'],
                squareCircle4: [
                    'U', 'R', 'F', 'D', 'B', 'L',
                    'u', 'r', 'f', 'd', 'b', 'l'
                ],
                squareCircle8: [
                    'U', 'R', 'F', 'D', 'B', 'L',
                    'u', 'r', 'f', 'd', 'b', 'l'
                ]
            };
            return moveSets[cubeType] || [];
        }
        
        handleMoveButtonClick(move, cubeType) {
            if (!this.coordinateCube || this.coordinateCubeType !== cubeType) {
                const cubeInfo = cubeRegistry.getConfig(cubeType);
                if (!cubeInfo) return;
                this.coordinateCube = new cubeInfo.model();
                this.coordinateCubeType = cubeType;
            }
            
            this.coordinateCube.rotate(move);
            this.renderCoordinateView(cubeType, this.coordinateCube);
        }
        
        resetCoordinateCube() {
            if (!this.coordinateCube) return;
            this.coordinateCube.reset();
            this.renderCoordinateView(this.coordinateCubeType, this.coordinateCube);
        }
        
        renderCoordinateView(cubeType, model = null) {
            const cubeInfo = cubeRegistry.getConfig(cubeType);
            if (!cubeInfo) return;
            
            const svgContainer = document.getElementById('coordinateSvgContainer');
            if (!svgContainer) return;

            const cube = model || new cubeInfo.model();
            if (!cube) return;
            
            // 转角三阶使用Canvas - 特殊处理
            if (cubeType === 'corner') {
                svgContainer.style.display = 'block';
                svgContainer.innerHTML = '';
                const svgConfig = this.getCoordinateSVGConfig(cubeType);
                const renderer = new cubeInfo.viewRenderer(null);
                renderer.renderToCoordinateSVG(svgContainer, cube, svgConfig);
            } else {
                // 对于其他魔方类型，克隆计时器界面的SVG
                // 确保布局（变换、viewBox、面位置）完全一致
                const timerSvgContainers = {
                    octahedron: 'twod-container',
                    cornerOcta: 'cornerOcta-twod-container',
                    twinOctahedron: 'twinOctahedron-twod-container',
                    squareCircle4: 'squareCircle4-twod-container',
                    squareCircle8: 'squareCircle8-twod-container'
                };
                
                const timerContainerId = timerSvgContainers[cubeType];
                if (!timerContainerId) return;
                
                const timerContainer = document.getElementById(timerContainerId);
                if (!timerContainer) return;
                
                // 清空并克隆SVG结构
                svgContainer.style.display = 'block';
                svgContainer.innerHTML = '';
                
                const clonedContainer = timerContainer.cloneNode(true);
                clonedContainer.id = 'coordinate-cloned-' + cubeType;
                clonedContainer.style.position = 'relative';
                clonedContainer.style.width = '100%';
                clonedContainer.style.height = '100%';
                svgContainer.appendChild(clonedContainer);
                
                // 使用渲染器渲染 - 会使用克隆的face-group
                const renderer = new cubeInfo.viewRenderer(null);
                renderer.renderToCoordinateSVG(svgContainer, cube, this.getCoordinateSVGConfig(cubeType));
            }

            // 同步渲染3D视图
            if (this.coordinate3DRenderer) {
                this.coordinate3DRenderer.update(cubeType, cube);
            }
        }
        
        getCoordinateSVGConfig(cubeType) {
            const configs = {
                corner: {
                    viewBox: '0 0 900 600',
                    maxWidth: '100%'
                },
                octahedron: {
                    viewBox: '0 0 2000 800',
                    maxWidth: '100%'
                },
                cornerOcta: {
                    viewBox: '0 0 2000 800',
                    maxWidth: '100%'
                },
                twinOctahedron: {
                    viewBox: '0 0 1200 600',
                    maxWidth: '100%'
                },
                squareCircle4: {
                    viewBox: '0 0 329 246',
                    maxWidth: '100%'
                },
                squareCircle8: {
                    viewBox: '0 0 329 246',
                    maxWidth: '100%'
                }
            };
            return configs[cubeType] || { viewBox: '0 0 1000 800', maxWidth: '100%' };
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
            } else {
                // 其他魔方类型（包括二阶转面八面体）直接应用标准记号
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
            
            // 与 OctahedronViewRenderer 和 TwinOctahedronViewRenderer 保持一致：
            // 第 1～4 列依次显示 2、3、4、1 号面。
            switch(faceKey) {
                case 'top2': // 橙色
                    offsetX = 30;
                    offsetY = 400;
                    needsFlip = true;
                    break;
                case 'top3': // 紫色
                    offsetX = 480;
                    offsetY = 400;
                    needsFlip = true;
                    break;
                case 'top4': // 白色
                    offsetX = 930;
                    offsetY = 400;
                    needsFlip = true;
                    break;
                case 'top1': // 蓝色
                    offsetX = 1380;
                    offsetY = 400;
                    needsFlip = true;
                    break;
                case 'bottom2': // 黄色
                    offsetX = 30;
                    offsetY = 400;
                    needsFlip = false;
                    break;
                case 'bottom3': // 绿色
                    offsetX = 480;
                    offsetY = 400;
                    needsFlip = false;
                    break;
                case 'bottom4': // 红色
                    offsetX = 930;
                    offsetY = 400;
                    needsFlip = false;
                    break;
                case 'bottom1': // 灰色
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
            if (this.state.timerState !== 'running') {
                return;
            }

            // 使用最后一次更新的时间戳，确保与显示时间一致
            const elapsed = this.state.lastUpdateTime ? this.state.lastUpdateTime - this.state.startTime : Date.now() - this.state.startTime;
            let time = elapsed / 1000;
            let penalty = '';

            // 应用观察时间惩罚
            if (this.state.inspectionPenalty === 'DNF') {
                time = null; // DNF成绩
                penalty = 'DNF';
            } else if (this.state.inspectionPenalty === '+2') {
                time += 2; // 加2秒惩罚
                penalty = '+2'; // 用于显示格式
            }

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
            this.saveTime(time, penalty);

            // 准备下一个打乱（这里会更新计数器并生成新打乱）
            this.prepareNextScramble();
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
 * @returns {string} 格式化后的时间字符串，小于60秒显示 ss.000，超过后显示 m:ss.000
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

            const secsStr = secs.toFixed(3);
            const [integerPart, decimalPart = '000'] = secsStr.split('.');
            const timeStr = minutes > 0
                ? `${minutes}:${integerPart.padStart(2, '0')}.${decimalPart}`
                : `${parseInt(integerPart, 10)}.${decimalPart}`;

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
            const currentNumber = this.getCurrentCounter();

            const timeRecord = {
                number: currentNumber,
                time: time,
                penalty: penalty,
                scramble: this.getScrambleText(),
                cubeType: this.state.currentCubeType,
                timestamp: Date.now()
            };

            // 使用通用方法获取当前时间记录数组
            const currentTimes = this.getCurrentTimes();
            currentTimes.unshift(timeRecord);

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
                'twinOctahedron': t('twinOctahedron2x2Full'),
                'squareCircle4': t('squareCircle4Full'),
                'squareCircle8': t('squareCircle8Full')
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
            const aoRules = {
                5: { removeCount: 1 },
                12: { removeCount: 2 },
                50: { removeCount: 5 },
                100: { removeCount: 10 }
            };

            const rule = aoRules[windowSize];
            if (!rule || times.length < windowSize) return null;

            const windowRecords = times.slice(0, windowSize);
            const validTimes = windowRecords.filter(record => record.time !== null);
            const dnfCount = windowRecords.length - validTimes.length;
            const removeCount = rule.removeCount;

            if (dnfCount > removeCount) return null;

            const sortedValid = validTimes.map(record => record.time).sort((a, b) => a - b);
            const effectiveTimes = sortedValid.slice(removeCount, sortedValid.length - (removeCount - dnfCount));

            if (effectiveTimes.length === 0) return null;

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
        
        findBestRollingAverage(records, windowSize) {
            if (records.length < windowSize) return null;

            let bestAverage = Infinity;
            let bestStartIndex = -1;

            for (let i = 0; i <= records.length - windowSize; i++) {
                const windowRecords = records.slice(i, i + windowSize);
                const average = this.calculateAO(windowRecords, windowSize);
                if (average !== null && average < bestAverage) {
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
                'twinOctahedron': t('twinOctahedron2x2Full'),
                'squareCircle4': t('squareCircle4Full'),
                'squareCircle8': t('squareCircle8Full')
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
                'twinOctahedron': t('twinOctahedron2x2Full'),
                'squareCircle4': t('squareCircle4Full'),
                'squareCircle8': t('squareCircle8Full')
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
        
                        'twinOctahedron': t('twinOctahedron2x2Full'),
        
                        'squareCircle4': t('squareCircle4Full'),
        
                        'squareCircle8': t('squareCircle8Full')
        
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
        // 延迟初始化，确保DOM完全渲染
        setTimeout(() => {
            app = new CubeTimerApp();
            window.app = app;

            // 初始化语言设置
            initLanguage();

            // 在app初始化后更新所有文本（包括历史摘要）
            updateAllText();
        }, 100);
    });
