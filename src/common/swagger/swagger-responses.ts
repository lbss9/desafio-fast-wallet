import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * Decorator que adiciona as respostas de erro padrão da API
 * para endpoints que não requerem autenticação
 */
export function ApiCommonErrorResponses() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Dados de entrada inválidos',
      schema: {
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
      },
    }),
    ApiTooManyRequestsResponse({
      description: 'Muitas requisições - Rate limiting ativo',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'string',
            example: 'Muitas requisições. Tente novamente em alguns instantes.',
          },
          code: { type: 'string', example: 'RATE_LIMIT_EXCEEDED' },
          statusCode: { type: 'number', example: 429 },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Erro interno do servidor',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Erro interno do servidor' },
          code: { type: 'string', example: 'INTERNAL_SERVER_ERROR' },
          statusCode: { type: 'number', example: 500 },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },
    }),
  );
}

/**
 * Decorator que adiciona as respostas de erro padrão da API
 * para endpoints que requerem autenticação
 */
export function ApiAuthErrorResponses() {
  return applyDecorators(
    ApiCommonErrorResponses(),
    ApiUnauthorizedResponse({
      description: 'Token JWT inválido, expirado ou não fornecido',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'string',
            example: 'Token de acesso inválido ou expirado',
          },
          code: { type: 'string', example: 'UNAUTHORIZED' },
          statusCode: { type: 'number', example: 401 },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Usuário não tem permissão para acessar este recurso',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'string',
            example: 'Acesso negado. Permissões insuficientes.',
          },
          code: { type: 'string', example: 'FORBIDDEN' },
          statusCode: { type: 'number', example: 403 },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },
    }),
  );
}

/**
 * Decorator que adiciona respostas para operações de recursos específicos
 */
export function ApiResourceErrorResponses() {
  return applyDecorators(
    ApiAuthErrorResponses(),
    ApiNotFoundResponse({
      description: 'Recurso não encontrado',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Recurso não encontrado' },
          code: { type: 'string', example: 'NOT_FOUND' },
          statusCode: { type: 'number', example: 404 },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },
    }),
  );
}

/**
 * Decorator que adiciona respostas para operações de criação
 */
export function ApiCreateErrorResponses() {
  return applyDecorators(
    ApiCommonErrorResponses(),
    ApiConflictResponse({
      description: 'Recurso já existe (dados duplicados)',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Email já está em uso' },
          code: { type: 'string', example: 'CONFLICT' },
          statusCode: { type: 'number', example: 409 },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00Z',
          },
          details: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'email' },
              value: { type: 'string', example: 'joao@email.com' },
            },
          },
        },
      },
    }),
  );
}

/**
 * Decorator para respostas de sucesso padrão
 */
export function ApiSuccessResponse(description: string, dataSchema?: any) {
  return applyDecorators();
  // O decorator específico de sucesso deve ser adicionado no controller
}

/**
 * Schema base para todas as respostas de sucesso
 */
export const SuccessResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string' },
    code: { type: 'string', example: 'SUCCESS' },
    timestamp: { type: 'string', format: 'date-time' },
    data: { type: 'object' },
  },
};

/**
 * Schema para respostas de lista paginada
 */
export const PaginatedResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'Dados obtidos com sucesso' },
    code: { type: 'string', example: 'SUCCESS' },
    timestamp: { type: 'string', format: 'date-time' },
    data: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { type: 'object' } },
        total: { type: 'number', example: 100 },
        page: { type: 'number', example: 1 },
        pageSize: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 10 },
      },
    },
  },
};

