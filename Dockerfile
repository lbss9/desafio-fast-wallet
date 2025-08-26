# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas as dependências (incluindo devDependencies para o build)
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npm run prisma:generate

# Build da aplicação
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache dumb-init

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copiar arquivos necessários do stage de build
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Expor porta
EXPOSE 3000

# Trocar para usuário não-root
USER nestjs

# Comando para iniciar a aplicação
CMD ["dumb-init", "node", "dist/main"]
