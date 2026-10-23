# Etapa 1: compilar con Vite. La dirección de la API queda escrita dentro del JavaScript resultante.
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Etapa 2: servir solo los archivos estáticos con nginx (sin Node en la imagen final)
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget -q --spider http://127.0.0.1/ || exit 1
