// ===== 魔方类型常量 =====
const CUBE_TYPES = {
    CORNER: 'corner',
    OCTAHEDRON: 'octahedron',
    CORNER_OCTA: 'cornerOcta',
    TWIN_OCTAHEDRON: 'twinOctahedron'
};

// ===== 转角三阶魔方常量 =====
const CORNER_CUBE = {
    FACE_SIZE: 17,
    FACES: ['top', 'bottom', 'front', 'back', 'left', 'right']
};

// ===== 八面体魔方常量 =====
const OCTAHEDRON_CUBE = {
    FACE_SIZE_TWIN: 7,
    FACE_SIZE_CORNER: 9,
    FACE_COUNT: 8
};

// ===== 历史记录限制 =====
const HISTORY_LIMITS = {
    SCRAMBLE_HISTORY: 100,
    TIME_RECORDS: 1000,
    TIMES_LIST_DISPLAY: 50
};

// ===== 渲染常量 =====
const RENDER_CONFIG = {
    CANVAS_SIZE: 150,
    CANVAS_SCALE: 50,
    SVG_SCALE_TWIN: 8.0,
    SVG_SCALE_CORNER: 150.0,
    SVG_SCALE_TWIN_OCTA: 127.5,
    PROJECTION_FACTOR: 20.9,
    STROKE_COLOR: '#666666',
    DEFAULT_COLOR: '#CCCCCC'
};

// ===== 颜色常量 =====
const CUBE_COLORS = {
    WHITE: '#FFFFFF',
    YELLOW: '#FFD700',
    GREEN: '#00AA00',
    BLUE: '#0066CC',
    RED: '#DD0000',
    ORANGE: '#FF8800',
    OCTAHEDRON_BLUE: 0x0072BD,
    OCTAHEDRON_ORANGE: 0xD95319,
    OCTAHEDRON_PURPLE: 0x7E2F8E,
    OCTAHEDRON_WHITE: 0xFFFFFF,
    OCTAHEDRON_GRAY: 0x999999,
    OCTAHEDRON_YELLOW: 0xEDB120,
    OCTAHEDRON_GREEN: 0x77AC30,
    OCTAHEDRON_RED: 0xA2142F
};

const OCTAHEDRON_DEFAULT_COLORS = [
    CUBE_COLORS.OCTAHEDRON_BLUE,
    CUBE_COLORS.OCTAHEDRON_ORANGE,
    CUBE_COLORS.OCTAHEDRON_PURPLE,
    CUBE_COLORS.OCTAHEDRON_WHITE,
    CUBE_COLORS.OCTAHEDRON_GRAY,
    CUBE_COLORS.OCTAHEDRON_YELLOW,
    CUBE_COLORS.OCTAHEDRON_GREEN,
    CUBE_COLORS.OCTAHEDRON_RED
];

const CORNER_CUBE_COLOR_MAP = {
    'white': CUBE_COLORS.WHITE,
    'yellow': CUBE_COLORS.YELLOW,
    'green': CUBE_COLORS.GREEN,
    'blue': CUBE_COLORS.BLUE,
    'red': CUBE_COLORS.RED,
    'orange': CUBE_COLORS.ORANGE
};

// ===== 计时器警告时间常量 =====
const TIMER_WARNING = {
    TIME_8S: 8,
    TIME_12S: 12
};

// ===== 音频常量 =====
const AUDIO_CONFIG = {
    START_FREQ: 1000,
    START_DURATION: 150,
    STOP_FREQ: 600,
    STOP_DURATION: 200,
    PENALTY_FREQ: 400,
    PENALTY_DURATION: 100,
    READY_FREQ: 800,
    READY_DURATION: 50,
    VOLUME: 0.3
};

// ===== 应用配置常量 =====
const APP_CONFIG = {
    INSPECTION_TIME: 15,
    INSPECTION_TIMEOUT_DNF: 17,
    INSPECTION_TIMEOUT_PLUS2: 15,
    AO5: { count: 5, remove: 1, name: 'Ao5' },
    AO12: { count: 12, remove: 2, name: 'Ao12' },
    AO50: { count: 50, remove: 5, name: 'Ao50' },
    AO100: { count: 100, remove: 10, name: 'Ao100' },
    MIN_EXPORT_COUNT: 1,
    MAX_EXPORT_COUNT: 100,
    MIN_START_ID: 1,
    MAX_START_ID: 9999,
    STORAGE_KEYS: {
        THEME: 'cubeTimerTheme',
        LANGUAGE: 'cubeTimerLanguage',
        TIMES: 'cubeTimerTimes'
    }
};