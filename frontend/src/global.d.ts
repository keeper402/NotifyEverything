import { ComponentCustomProperties } from 'vue';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $registerTask: (taskId: string, task: () => void) => void;
        $startInterval: () => void;
        $stopInterval: () => void;
    }
}