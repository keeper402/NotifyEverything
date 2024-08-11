# 使用基础镜像
FROM ubuntu:20.04

# 设置环境变量以避免交互式提示
ENV DEBIAN_FRONTEND=noninteractive

# 请在运行容器设置 KV 环境变量！！！！！！！！！！！！！！！！！！！！！
ENV KV_URL=""
ENV KV_REST_API_URL=""
ENV KV_REST_API_TOKEN=""
ENV KV_REST_API_READ_ONLY_TOKEN=""

# 更新包列表并安装依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl gnupg2 && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# 安装 Node.js（20.x 版本）
RUN curl -k -fsSL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh && \
    bash /tmp/nodesource_setup.sh && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm /tmp/nodesource_setup.sh
# 安装 Yarn
RUN npm install -g yarn
# 安装 Nginx（如果需要）
RUN apt-get update && \
    apt-get install -y --no-install-recommends nginx && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# 复制 package.json 和 package-lock.json
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install
# 复制后端和前端代码到镜像中
COPY . .

# 复制 Nginx 配置
COPY nginx/nginx-docker.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

# 复制启动脚本
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# 使用脚本启动 Nginx 和应用程序
CMD ["/usr/local/bin/start.sh"]