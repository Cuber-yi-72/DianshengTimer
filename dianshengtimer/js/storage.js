// ===== localStorage安全操作封装 =====
const StorageHelper = {
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`无法保存到localStorage [${key}]:`, error);
            return false;
        }
    },

    getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            return JSON.parse(item);
        } catch (error) {
            console.warn(`无法从localStorage读取 [${key}]:`, error);
            return defaultValue;
        }
    },

    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`无法从localStorage删除 [${key}]:`, error);
            return false;
        }
    }
};