FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://your-domain.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM busybox:1.37
COPY --from=build /app/out /www
EXPOSE 80
CMD ["httpd", "-f", "-p", "80", "-h", "/www"]
