FROM ubuntu:16.04

USER root
#网易apt-get镜像
RUN sed -i 's/http:\/\/archive\.ubuntu\.com\/ubuntu\//http:\/\/mirrors\.163\.com\/ubuntu\//g' /etc/apt/sources.list

RUN apt-get update
RUN apt-get install -yqq nginx
RUN apt-get install -y curl
RUN apt-get install -y gnupg

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get update && apt-get install -y nodejs
#设置npm淘宝镜像
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

# RUN cd $(npm root -g)/npm && npm install fs-extra && sed -i -e s/graceful-fs/fs-extra/ -e s/fs.rename/fs.move/ ./lib/utils/rename.js

# 复制项目代码
COPY . /src
WORKDIR /src

#RUN npm cache clean
RUN cnpm i 
RUN npm run build:test

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]