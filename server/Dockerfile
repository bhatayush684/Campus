FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app/server
COPY --from=server-build /app/server/package*.json ./
RUN npm ci --omit=dev
COPY --from=server-build /app/server/dist ./dist
COPY --from=frontend-build /app/dist /app/dist
COPY --from=frontend-build /app/public /app/public
EXPOSE 3001
CMD ["npm", "start"]
