# 🏦 Desafio Backend Pleno - API de Carteira Digital

## 📋 Objetivo
Desenvolver uma API REST para um sistema de carteira digital simplificado que demonstre conhecimentos em arquitetura, segurança, performance e boas práticas de desenvolvimento.

## 🎯 Funcionalidades Principais

### Autenticação & Autorização
- Cadastro e login de usuários
- Autenticação JWT com refresh tokens
- Middleware de autorização por roles (USER, ADMIN)

### Gestão de Contas
- Criação de conta digital para usuário
- Consulta de saldo e extrato
- Bloqueio/desbloqueio de conta (admin)

### Transações
- **PIX Simulado**: Transferência instantânea entre contas
- **Depósito**: Adição de saldo à conta
- **Saque**: Remoção de saldo (com validações)
- Histórico completo de transações com filtros

### Notificações
- Sistema de notificações assíncronas
- Notificação por email em transações importantes
- Webhook para sistemas externos

## 🛠 Stack Técnica Requerida

### Backend
- **Framework**: NestJS + TypeScript
- **Banco de Dados**: PostgreSQL (principal) + Redis (cache)
- **ORM**: TypeORM ou Prisma
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest (unitários + E2E)

### Infraestrutura & DevOps
- **Containerização**: Docker + Docker Compose
- **Queue**: Bull Queue + Redis
- **Logs**: Winston ou similar
- **CI/CD**: GitHub Actions
- **Variables**: dotenv para configurações

## 📐 Arquitetura Esperada

```
src/
├── modules/
│   ├── auth/          # Autenticação JWT
│   ├── users/         # Gestão de usuários
│   ├── accounts/      # Contas digitais
│   ├── transactions/  # PIX, depósitos, saques
│   └── notifications/ # Sistema de notificações
├── shared/
│   ├── guards/        # Auth guards
│   ├── interceptors/  # Logging, transforms
│   ├── pipes/         # Validação de dados
│   └── decorators/    # Custom decorators
├── config/            # Configurações (DB, Redis, etc.)
└── main.ts
```

## 🔧 Funcionalidades Técnicas Importantes

### 1. Validação Robusta
- DTOs com class-validator
- Pipes customizados para sanitização
- Tratamento global de exceções

### 2. Segurança
- Rate limiting (ThrottlerGuard)
- Sanitização de inputs
- Logs de auditoria para transações
- Criptografia de dados sensíveis

### 3. Performance
- Cache Redis para consultas frequentes
- Paginação em listagens
- Índices otimizados no banco
- Connection pooling

### 4. Processamento Assíncrono
- Fila para envio de notificações
- Workers para processamento em background
- Retry automático para falhas

## 📝 Entregáveis

### 1. Código
- Repositório GitHub bem organizado
- README.md detalhado com setup
- Commits semânticos bem estruturados
- Código limpo e documentado

### 2. Documentação
- Swagger UI funcional em `/api/docs`
- Collection do Postman/Insomnia
- Diagramas de arquitetura (opcional)

### 3. Testes
- Mínimo 70% de cobertura de testes
- Testes unitários para services
- Testes E2E para fluxos principais
- Mocks apropriados

### 4. Deploy
- Docker compose funcional
- Scripts de inicialização do banco
- Variáveis de ambiente documentadas
- Health checks implementados

## 🎪 Endpoints Principais

```typescript
// Autenticação
POST /auth/register
POST /auth/login
POST /auth/refresh

// Contas
GET /accounts/me
GET /accounts/balance
GET /accounts/statement?page=1&limit=10

// Transações
POST /transactions/deposit
POST /transactions/withdraw  
POST /transactions/pix
GET /transactions/history

// Admin
GET /admin/accounts
PUT /admin/accounts/:id/block
```

## 🏆 Diferenciais que Impressionam

### Nível Básico ✅
- API funcionando completamente
- Testes automatizados
- Docker setup
- Documentação clara

### Nível Intermediário 🌟
- Rate limiting implementado
- Logs estruturados
- Validações robustas
- Cache inteligente

### Nível Avançado 🚀
- Webhook system para notificações
- Idempotência em transações críticas  
- Circuit breaker para APIs externas
- Métricas e observabilidade
- GitHub Actions com deploy automatizado

## ⏱ Tempo Estimado
**3-5 dias** para implementação completa com qualidade de produção.

---