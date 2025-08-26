/**
 * Schemas simples para documentação Swagger sem dependências circulares
 */

/**
 * Schema para respostas de sucesso da API
 */
export const SuccessResponseSchemaExample = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'Operação realizada com sucesso' },
    code: { type: 'string', example: 'SUCCESS' },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2024-01-15T10:30:00Z',
    },
    data: { type: 'object' },
  },
};

/**
 * Schema para respostas de erro da API
 */
export const ErrorResponseSchemaExample = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string', example: 'Erro ao processar solicitação' },
    code: { type: 'string', example: 'BAD_REQUEST' },
    statusCode: { type: 'number', example: 400 },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2024-01-15T10:30:00Z',
    },
    error: { type: 'string', example: 'BAD_REQUEST' },
  },
};

/**
 * Schema para erros de validação
 */
export const ValidationErrorSchemaExample = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string', example: 'Dados de entrada inválidos' },
    code: { type: 'string', example: 'VALIDATION_ERROR' },
    statusCode: { type: 'number', example: 400 },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2024-01-15T10:30:00Z',
    },
    validation: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string', example: 'email' },
          message: {
            type: 'string',
            example: 'Email deve ter um formato válido',
          },
          value: { type: 'string', example: 'email-invalido' },
        },
      },
    },
  },
};

/**
 * Schemas simplificados para evitar dependências circulares
 */

/**
 * Schema para informações de usuário
 */
export const UserInfoSchemaExample = {
  type: 'object',
  properties: {
    id: { type: 'number', example: 1 },
    name: { type: 'string', example: 'João Silva' },
    email: { type: 'string', example: 'joao.silva@email.com' },
    userType: {
      type: 'string',
      enum: [
        'fastwallet__administrator',
        'fastwallet__client',
        'fastwallet__supplier',
        'fastwallet__employee',
        'fastwallet__carrier',
      ],
      example: 'fastwallet__client',
    },
    phone: { type: 'string', example: '(11) 98765-4321' },
    address: { type: 'string', example: 'Rua das Flores, 123' },
    city: { type: 'string', example: 'São Paulo' },
    state: { type: 'string', example: 'São Paulo' },
    zipCode: { type: 'string', example: '01234-567' },
    complement: { type: 'string', example: 'Apto 45' },
    taxId: { type: 'string', example: '123.456.789-01' },
    businessTaxId: { type: 'string', example: '12.345.678/0001-95' },
    stateRegistration: { type: 'string', example: '123456789' },
    observations: { type: 'string', example: 'Cliente preferencial' },
    createdAt: {
      type: 'string',
      format: 'date-time',
      example: '2024-01-15T10:30:00Z',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      example: '2024-01-20T15:45:00Z',
    },
  },
};

/**
 * Schema para resposta de login
 */
export const LoginResponseSchemaExample = {
  type: 'object',
  properties: {
    userId: { type: 'number', example: 1 },
    token: {
      type: 'string',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjMwNTYwMDAwLCJleHAiOjE2MzA1NjM2MDB9.signature',
    },
    refreshToken: {
      type: 'string',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjMwNTYwMDAwLCJleHAiOjE2MzEzMDQwMDB9.signature',
    },
  },
};

/**
 * Schema para tokens de autenticação
 */
export const AuthTokensSchemaExample = {
  type: 'object',
  properties: {
    token: {
      type: 'string',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjMwNTYwMDAwLCJleHAiOjE2MzA1NjM2MDB9.signature',
      description: 'Token JWT (válido por 1 hora)',
    },
    refreshToken: {
      type: 'string',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjMwNTYwMDAwLCJleHAiOjE2MzEzMDQwMDB9.signature',
      description: 'Token de renovação (válido por 7 dias)',
    },
  },
};
