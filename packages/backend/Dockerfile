FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ && npm install -g pnpm
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY ./packages/backend ./packages/backend/
COPY ./packages/shared ./packages/shared/

RUN HUSKY=0 pnpm install --no-frozen-lockfile

COPY ./packages/backend ./packages/backend
COPY ./packages/shared ./packages/shared
COPY ./tsconfig.json ./
RUN cd ./packages/backend && pnpm build

FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/backend/package.json ./packages/backend/
COPY --from=builder /app/packages/shared/package.json ./packages/shared/

RUN HUSKY=0 pnpm install --no-frozen-lockfile --prod --ignore-scripts

COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

COPY --from=builder /app/packages/shared ./packages/shared

WORKDIR /app/packages/backend

EXPOSE 3000

CMD ["node", "dist/main"]