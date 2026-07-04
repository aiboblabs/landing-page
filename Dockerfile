# --- Build stage (no-op for static, kept for parity & future bundling) ---
FROM alpine:3.20 AS build
WORKDIR /src
COPY index.html styles.css main.js flocking.js i18n.js VERSION ./
COPY favicon.svg favicon.ico favicon-32.png apple-touch-icon.png icon-192.png icon-512.png manifest.webmanifest ./
# Sanity check
RUN test -f index.html && test -f VERSION

# --- Runtime stage ---
FROM nginx:1.27-alpine
LABEL org.opencontainers.image.title="bob-labs-landing" \
      org.opencontainers.image.source="https://boblabs.eu" \
      org.opencontainers.image.licenses="MIT"

# Replace default config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy site
COPY --from=build /src/ /usr/share/nginx/html/

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
