# backend/Dockerfile
FROM node:18

# 设置工作目录
WORKDIR /app

ENV KV_URL=""
ENV KV_REST_API_URL=""
ENV KV_REST_API_TOKEN=""
ENV KV_REST_API_READ_ONLY_TOKEN=""

# 复制 package.json 和 package-lock.json
COPY package.json ./

# 安装依赖
RUN yarn install

# 复制后端代码
COPY . .

# 暴露端口
EXPOSE 80

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

# 启动后端应用
CMD ["yarn", "build:server"]
