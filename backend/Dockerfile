# Build-Stage
FROM node:22.4-alpine as builder

WORKDIR /app

# Kopieren der package.json und package-lock.json
COPY package*.json ./

# Installation der Abhängigkeiten
RUN npm install

# Kopieren des Quellcodes
COPY . .

# TypeScript kompilieren
RUN npm run build

# Production-Stage
FROM node:22.4-alpine

WORKDIR /app

# Kopieren der package.json und package-lock.json
COPY package*.json ./

# Nur Produktionsabhängigkeiten installieren
RUN npm install --production

# Kopieren der kompilierten Dateien von der Build-Stage
COPY --from=builder /app/dist ./dist

# Umgebungsvariablen setzen
ENV NODE_ENV=production

# Port freigeben
EXPOSE 3000

# Anwendung starten
CMD ["node", "dist/index.js"]