FROM node:22-alpine AS build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.28-alpine AS runtime

LABEL com.azure.containerizationassist.createdby="containerization-assist"

RUN adduser -D -u 10001 appuser
COPY --from=build --chown=10001:10001 /app/dist /usr/share/nginx/html
COPY --chown=10001:10001 frontend/nginx.conf /etc/nginx/nginx.conf

USER 10001
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget --spider -q http://127.0.0.1:8080/health || exit 1
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]