// ==================== TIPOS UTILITÁRIOS ====================

/**
 * Utilitário para tornar campos opcionais
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ==================== INTERFACES BASE ====================

/**
 * Item base para criação (com timestamps automáticos)
 */
export interface BaseItemCreate {
  readonly id?: number | string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

/**
 * Propriedades de consulta
 */
export interface QueryProps<T, K extends keyof T = keyof T> {
  readonly attributes?: readonly K[];
  readonly relations?: readonly string[];
  readonly where?: Partial<Record<keyof T, unknown>>;
  readonly limit?: number;
  readonly page?: number;
  readonly sort?: 'ASC' | 'DESC';
  readonly sortBy?: keyof T;
}

// ==================== SUAS INTERFACES PRINCIPAIS ====================

/**
 * Opções para consultas paginadas
 */
export interface IPaginationOptions {
  /** Número da página (base 1, mín: 1, máx: 10000) */
  readonly page?: number;
  /** Número de itens por página (mín: 1, máx: 1000) */
  readonly limit?: number;
  /** Campo para ordenação (deve ser um campo válido da entidade) */
  readonly sortBy?: string;
  /** Ordem de classificação */
  readonly sortOrder?: 'ASC' | 'DESC';
}

/**
 * Estrutura de resultado paginado
 */
export interface IPaginatedResult<T> {
  /** Array de itens de dados */
  readonly data: readonly T[];
  /** Número total de itens */
  readonly total: number;
  /** Número da página atual */
  readonly page: number;
  /** Itens por página */
  readonly limit: number;
  /** Número total de páginas */
  readonly totalPages: number;
  /** Se há próxima página */
  readonly hasNextPage: boolean;
  /** Se há página anterior */
  readonly hasPrevPage: boolean;
  /** Tempo de execução da consulta em milissegundos */
  readonly executionTimeMs: number;
}

/**
 * Opções para filtrar consultas
 */
export interface IFilterOptions<T = unknown> {
  /** Condições WHERE */
  readonly where?: Partial<Record<keyof T, unknown>>;
  /** Relações para incluir (máx 5 relações para performance) */
  readonly relations?: readonly string[];
  /** Campos para selecionar (se vazio, seleciona todos) */
  readonly select?: readonly (keyof T)[];
}

// ==================== TIPOS DE OPERAÇÕES ESSENCIAIS ====================

/**
 * Tipo para criação de item
 */
export type CreateItem<T extends BaseItemCreate, K = T> = (
  item: Optional<T, 'createdAt' | 'updatedAt' | 'id'>,
) => Promise<K>;

/**
 * Tipo para atualização de item
 */
export type UpdateItem<Keys, Payload, Return = Payload> = (
  keys: Keys,
  item: Omit<Payload, 'createdAt' | 'updatedAt' | 'id'> & {
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
  },
) => Promise<Return>;

/**
 * Tipo para exclusão de item
 */
export type DeleteItem<Keys, Return = void> = (keys: Keys) => Promise<Return>;

/**
 * Consulta de item único
 */
export type QueryOneItem<Input, Return> = <
  T extends Partial<Return> = Return,
  K extends keyof T = keyof T,
>(
  input: Input,
  attributes?: QueryProps<T, K>['attributes'],
  relations?: QueryProps<T, K>['relations'],
) => Promise<Pick<T, K> | null>;

/**
 * Consulta paginada
 */
export type QueryPaginated<Input, Return> = <
  T extends Partial<Return> = Return,
  K extends keyof T = keyof T,
>(
  input: Input,
  options?: QueryProps<T, K>,
  pagination?: IPaginationOptions,
) => Promise<IPaginatedResult<Pick<T, K>>>;
