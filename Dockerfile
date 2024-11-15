# 1. Build Stage
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 앱의 의존성 파일만 먼저 복사 (캐시 활용)
COPY package*.json ./

# 종속성 설치 (외부 스크립트 제외)
RUN npm install --ignore-scripts

# 소스 코드 복사
COPY . .

# 환경 변수 설정 (APP_ENV 사용)
ARG APP_ENV
RUN echo "APP_ENV=${APP_ENV}"

# 프로덕션 환경에서는 빌드, 개발 환경에서는 개발용 빌드
RUN if [[ "${APP_ENV}" = "production" ]] ; then \
      npm run build --max-old-space-size=4096; \
    else \
      npm run build:dev --max-old-space-size=4096; \
    fi

# 2. Production Stage
FROM node:18-alpine AS production

WORKDIR /app

# 필요한 파일만 복사 (빌드된 결과물과 의존성)
COPY --from=build /app /app

# 프로덕션 환경 변수를 설정
ENV NODE_ENV=production
ENV PORT 80

EXPOSE $PORT

# 앱 실행
CMD ["npm", "run", "start"]
