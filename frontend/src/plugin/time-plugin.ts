import {App} from 'vue';

// 创建插件
const timerPlugin = {
    install(app: App) {
        let intervalId: NodeJS.Timeout | null = null; // 定时器 ID
        const tasks: Map<string, () => void> = new Map(); // 存储需要执行的函数

        // 启动定时器
        const startInterval = () => {
            if (intervalId) return; // 防止重复启动
            intervalId = setInterval(() => {
                // 每分钟执行注册的函数
                // 只遍历值
                for (const task of tasks.values()) {
                    task();
                }
            }, 60 * 1000); // 每分钟执行一次
        };

        // 停止定时器
        const stopInterval = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                tasks.clear(); // 清空任务列表
            }
        };

        // 注册任务
        const registerTask = (taskId: string, task: () => void) => {
            if (!tasks.has(taskId)) {
                tasks.set(taskId, task);
            }
        };

        // 将方法添加到 Vue 原型上
        app.config.globalProperties.$startInterval = startInterval;
        app.config.globalProperties.$stopInterval = stopInterval;
        app.config.globalProperties.$registerTask = registerTask;
    }
};

export default timerPlugin;
