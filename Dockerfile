FROM node:18-alpine

WORKDIR /app

ARG APP_ENV

COPY package*.json ./

# 스크립트 훅 실행 방지
RUN npm install --ignore-scripts

COPY . .

# RUN npm build
RUN npm run build
# RUN echo "APP_ENV=${APP_ENV}"
# RUN if [[ "${APP_ENV}" = "production" ]] ; then npm run build ; else npm run build:dev ; fi

ENV PORT 80
EXPOSE $PORT

CMD "npm" "run" "start"

