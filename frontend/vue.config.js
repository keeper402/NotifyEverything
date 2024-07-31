const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
    chainWebpack: (config) => {
        // 通过 babel-loader 配置 Babel 插件
        config.module
            .rule('js')
            .use('babel-loader')
            .tap((options) => {
                // 确保插件被添加
                options.plugins = [
                    ...(options.plugins || []),
                    '@babel/plugin-transform-class-static-block'
                ];
                return options;
            });
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:80', // 后端服务地址
                changeOrigin: true,
                pathRewrite: { '^/api': '' } // 可选，重写路径
            }
        }
    }
});
