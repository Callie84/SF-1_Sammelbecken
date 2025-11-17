FROM mcr.microsoft.com/playwright:v1.47.0-jammy
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . ./
RUN npm run build
ENV NODE_ENV=production
CMD ["node","dist/index.js"]