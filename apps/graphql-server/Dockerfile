FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install --prod && pnpm build
EXPOSE 4000
CMD ["node", "dist/index.js"]
