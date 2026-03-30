FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared-types/package*.json ./packages/shared-types/
RUN npm install
COPY . .
RUN npm run build --workspace @aj/shared-types && npm run build --workspace api

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install --omit=dev --workspace api
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
EXPOSE 4000
CMD ["node", "apps/api/dist/server.js"]
