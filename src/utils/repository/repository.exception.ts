/**
 * Classe base de erro do repositório com rastreamento aprimorado de erro
 */
export class RepositoryError extends Error {
  public readonly originalError?: Error;
  public readonly entity?: unknown;
  public readonly timestamp: Date;
  public readonly operation: string;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';

  public constructor(
    message: string,
    operation: string,
    originalError?: Error,
    entity?: unknown,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  ) {
    super(message);
    this.name = 'RepositoryError';
    this.operation = operation;
    this.originalError = originalError;
    this.entity = entity;
    this.timestamp = new Date();
    this.severity = severity;

    // Mantém stack trace apropriado
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RepositoryError);
    }
  }
}

/**
 * Erro lançado quando entidade não é encontrada
 */
export class EntityNotFoundError extends RepositoryError {
  public constructor(entityName: string, criteria: Record<string, unknown>) {
    super(
      `${entityName} não encontrada com critérios: ${JSON.stringify(criteria)}`,
      'busca',
      undefined,
      undefined,
      'low',
    );
    this.name = 'EntityNotFoundError';
  }
}

/**
 * Erro lançado quando validação falha
 */
export class ValidationError extends RepositoryError {
  public readonly validationErrors: readonly string[];

  public constructor(entityName: string, errors: readonly string[]) {
    super(
      `Validação falhou para ${entityName}`,
      'validacao',
      undefined,
      undefined,
      'medium',
    );
    this.name = 'ValidationError';
    this.validationErrors = Object.freeze([...errors]);
  }
}

/**
 * Erro lançado quando restrição de banco é violada
 */
export class ConstraintViolationError extends RepositoryError {
  public readonly constraintType:
    | 'unique'
    | 'foreign_key'
    | 'not_null'
    | 'check';

  public constructor(
    entityName: string,
    constraintType: 'unique' | 'foreign_key' | 'not_null' | 'check',
    details?: string,
  ) {
    super(
      `Violação de restrição ${constraintType.replace('_', ' ')} em ${entityName}${
        details ? `: ${details}` : ''
      }`,
      'restricao_banco',
      undefined,
      undefined,
      'high',
    );
    this.name = 'ConstraintViolationError';
    this.constraintType = constraintType;
  }
}

/**
 * Erro lançado quando há tentativa de ataque de segurança
 */
export class SecurityViolationError extends RepositoryError {
  public readonly violationType:
    | 'sql_injection'
    | 'rate_limit'
    | 'unauthorized_access'
    | 'data_breach';

  public constructor(
    violationType:
      | 'sql_injection'
      | 'rate_limit'
      | 'unauthorized_access'
      | 'data_breach',
    details?: string,
  ) {
    super(
      `Violação de segurança detectada: ${violationType.replace('_', ' ')}${
        details ? `: ${details}` : ''
      }`,
      'seguranca',
      undefined,
      undefined,
      'critical',
    );
    this.name = 'SecurityViolationError';
    this.violationType = violationType;
  }
}
