FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++ && npm install -g pnpm
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY ./tsconfig.json ./
COPY ./packages/shared/ ./packages/shared/
COPY ./packages/frontend/ ./packages/frontend/

RUN HUSKY=0 pnpm install --no-frozen-lockfile
COPY ./packages/frontend/src ./packages/frontend/src
COPY ./packages/frontend/public ./packages/frontend/public
COPY ./packages/frontend/index.html ./packages/frontend
COPY ./packages/frontend/vite.config.ts ./packages/frontend
RUN cd ./packages/frontend && pnpm build


FROM nginx:alpine AS production

RUN echo 'events { worker_connections 1024; }' > /etc/nginx/nginx.conf && \
    echo 'http {' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/mime.types;' >> /etc/nginx/nginx.conf && \
    echo '    default_type application/octet-stream;' >> /etc/nginx/nginx.conf && \
    echo '    server_tokens off;' >> /etc/nginx/nginx.conf && \
    echo '    access_log off;' >> /etc/nginx/nginx.conf && \
    echo '    error_log stderr crit;' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/conf.d/*.conf;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf

COPY --from=builder /app/packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]