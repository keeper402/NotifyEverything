#!/bin/sh

# 启动前端和后端
yarn start:frontend &
yarn start:backend &

# 启动 Nginx
nginx -g 'daemon off;' &
# 等待所有后台进程
wait
