# Node.js의 공식 이미지를 기반으로 합니다.
FROM node:20

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# package.json과 package-lock.json을 복사합니다.
COPY ./package.json ./
COPY ./package-lock.json ./

# 의존성을 설치합니다.
RUN npm install

# 애플리케이션 소스 코드를 복사합니다.
COPY . .

# TypeScript를 컴파일합니다.
RUN npx tsc

# 애플리케이션이 사용할 포트를 설정합니다.
EXPOSE 4000

# 애플리케이션을 실행합니다.
CMD ["node", "./dist/main.js"]
