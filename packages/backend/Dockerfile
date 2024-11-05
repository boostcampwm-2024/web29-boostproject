# Node.js 20 버전을 기본 이미지로 사용
FROM node:20

# 컨테이너 안에서 작업 디렉토리를 설정
WORKDIR /app

# 패키지 매니저 파일을 복사
COPY package.json pnpm-lock.yaml ./

# pnpm을 설치
RUN npm install -g pnpm

# pnpm을 사용하여 의존성 설치
RUN pnpm install

# 프로젝트의 나머지 파일들을 모두 복사
COPY . .

# NestJS 프로젝트를 빌드
RUN pnpm build

# 애플리케이션이 실행될 포트를 노출
EXPOSE 3000

# NestJS 애플리케이션을 프로덕션 모드에서 실행하는 명령어 설정
CMD ["pnpm", "start:prod"]
