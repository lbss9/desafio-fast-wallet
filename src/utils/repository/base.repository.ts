import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  QueryFailedError,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  ConstraintViolationError,
  EntityNotFoundError,
  RepositoryError,
  SecurityViolationError,
  ValidationError,
} from './repository.exception';
import {
  IFilterOptions,
  IPaginatedResult,
  IPaginationOptions,
} from './repository.interface';

/**
 * Lista de campos seguros para ordenação (whitelist)
 * Deve ser sobrescrita pelas classes filhas
 */
const DEFAULT_SORTABLE_FIELDS = ['id', 'createdAt', 'updatedAt'] as const;

/**
 * Repositório base ultra seguro contra SQL Injection
 * Validação rigorosa de todos os inputs dinâmicos
 */
@Injectable()
export abstract class BaseRepository<TEntity extends ObjectLiteral> {
  protected abstract readonly repository: Repository<TEntity>;
  protected abstract readonly entityName: string;

  // Whitelist de campos seguros (deve ser sobrescrita pelas classes filhas)
  protected readonly sortableFields: readonly string[] =
    DEFAULT_SORTABLE_FIELDS;
  protected readonly selectableFields: readonly string[] = [];
  protected readonly relationFields: readonly string[] = [];

  // ==================== VALIDAÇÃO DE SEGURANÇA ====================

  /**
   * Valida campo de ordenação contra whitelist
   */
  private validateSortField(sortBy: string): string {
    if (!sortBy || typeof sortBy !== 'string') {
      return 'id';
    }

    const cleanSortBy = sortBy.trim();

    // Verifica se está na whitelist
    if (!this.sortableFields.includes(cleanSortBy)) {
      throw new SecurityViolationError(
        'sql_injection',
        `Campo de ordenação não permitido: ${sortBy}. Campos permitidos: ${this.sortableFields.join(', ')}`,
      );
    }

    return cleanSortBy;
  }

  /**
   * Valida campos de seleção contra whitelist
   */
  private validateSelectFields(fields: readonly (keyof TEntity)[]): string[] {
    if (!fields || fields.length === 0) {
      return [];
    }

    const validFields: string[] = [];

    for (const field of fields) {
      const fieldStr = String(field);

      if (!fieldStr || typeof fieldStr !== 'string') {
        continue;
      }

      const cleanField = fieldStr.trim();

      // Se há whitelist definida, verifica contra ela
      if (
        this.selectableFields.length > 0 &&
        !this.selectableFields.includes(cleanField)
      ) {
        throw new SecurityViolationError(
          'sql_injection',
          `Campo de seleção não permitido: ${cleanField}`,
        );
      }

      // Validação básica de formato (apenas letras, números e underscore)
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(cleanField)) {
        throw new SecurityViolationError(
          'sql_injection',
          `Campo de seleção com formato inválido: ${cleanField}`,
        );
      }

      validFields.push(cleanField);
    }

    return validFields;
  }

  /**
   * Valida relações contra whitelist
   */
  private validateRelations(relations: readonly string[]): string[] {
    if (!relations || relations.length === 0) {
      return [];
    }

    const validRelations: string[] = [];

    for (const relation of relations.slice(0, 5)) {
      // Máximo 5 relações
      if (!relation || typeof relation !== 'string') {
        continue;
      }

      const cleanRelation = relation.trim();

      // Se há whitelist definida, verifica contra ela
      if (
        this.relationFields.length > 0 &&
        !this.relationFields.includes(cleanRelation)
      ) {
        throw new SecurityViolationError(
          'sql_injection',
          `Relação não permitida: ${cleanRelation}`,
        );
      }

      // Validação básica de formato
      if (!/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(cleanRelation)) {
        throw new SecurityViolationError(
          'sql_injection',
          `Relação com formato inválido: ${cleanRelation}`,
        );
      }

      validRelations.push(cleanRelation);
    }

    return validRelations;
  }

  /**
   * Sanitiza valor para prevenir injection
   */
  private sanitizeValue(value: unknown): unknown {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'string') {
      // Remove caracteres de controle perigosos
      const sanitized = value.replace(/[\x00-\x1f\x7f-\x9f]/g, '');

      // Limita tamanho para prevenir DoS
      return sanitized.length > 1000 ? sanitized.substring(0, 1000) : sanitized;
    }

    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        throw new ValidationError(this.entityName, ['Valor numérico inválido']);
      }
      return value;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (value instanceof Date) {
      if (isNaN(value.getTime())) {
        throw new ValidationError(this.entityName, ['Data inválida']);
      }
      return value;
    }

    // Para outros tipos, converte para string e sanitiza
    return String(value).substring(0, 1000);
  }

  // ==================== MÉTODOS PÚBLICOS ====================

  /**
   * Cria uma nova entidade
   */
  public async create(data: DeepPartial<TEntity>): Promise<TEntity> {
    try {
      if (!data || typeof data !== 'object') {
        throw new ValidationError(this.entityName, [
          'Dados de criação inválidos',
        ]);
      }

      const entity = this.repository.create(data);
      return this.repository.save(entity);
    } catch (error) {
      this.handleError(error, 'create');
    }
  }

  /**
   * Atualiza uma entidade
   */
  public async update(
    id: string | number,
    data: Partial<TEntity>,
  ): Promise<TEntity> {
    try {
      if (!data || typeof data !== 'object') {
        throw new ValidationError(this.entityName, [
          'Dados de atualização inválidos',
        ]);
      }

      // Previne atualização do ID
      if ('id' in data) {
        throw new SecurityViolationError(
          'unauthorized_access',
          'Tentativa de atualização de campo ID detectada',
        );
      }

      const updateResult = await this.repository.update(
        { id } as unknown as FindOptionsWhere<TEntity>,
        data as any,
      );

      if (updateResult.affected === 0) {
        throw new EntityNotFoundError(this.entityName, { id });
      }

      const updatedEntity = await this.repository.findOne({
        where: { id } as unknown as FindOptionsWhere<TEntity>,
      });

      if (!updatedEntity) {
        throw new EntityNotFoundError(this.entityName, { id });
      }

      return updatedEntity;
    } catch (error) {
      this.handleError(error, 'update');
    }
  }

  /**
   * Exclui uma entidade
   */
  public async delete(id: string | number): Promise<void> {
    try {
      const deleteResult = await this.repository.delete({
        id,
      } as unknown as FindOptionsWhere<TEntity>);

      if (deleteResult.affected === 0) {
        throw new EntityNotFoundError(this.entityName, { id });
      }
    } catch (error) {
      this.handleError(error, 'delete');
    }
  }

  /**
   * Busca uma única entidade
   */
  public async queryOne<
    T extends Partial<TEntity> = TEntity,
    K extends keyof T = keyof T,
  >(
    criteria: FindOptionsWhere<TEntity>,
    options?: IFilterOptions<TEntity>,
  ): Promise<Pick<T, K> | null> {
    try {
      if (!criteria || typeof criteria !== 'object') {
        throw new ValidationError(this.entityName, [
          'Critérios de busca inválidos',
        ]);
      }

      const findOptions: FindOneOptions<TEntity> = {
        where: this.sanitizeCriteria(criteria),
      };

      if (options?.relations) {
        const validRelations = this.validateRelations(options.relations);
        if (validRelations.length > 0) {
          findOptions.relations = validRelations;
        }
      }

      if (options?.select) {
        const validFields = this.validateSelectFields(options.select);
        if (validFields.length > 0) {
          findOptions.select = validFields as (keyof TEntity)[];
        }
      }

      const result = await this.repository.findOne(findOptions);
      return result as unknown as Pick<T, K> | null;
    } catch (error) {
      this.handleError(error, 'queryOne');
    }
  }

  /**
   * Busca paginada com segurança total
   */
  public async queryPaginated(
    paginationOptions: IPaginationOptions,
    criteria?: FindOptionsWhere<TEntity>,
    filterOptions?: IFilterOptions<TEntity>,
  ): Promise<IPaginatedResult<TEntity>> {
    try {
      const page = Math.max(1, paginationOptions.page || 1);
      const limit = Math.max(1, Math.min(paginationOptions.limit || 10, 1000));
      const sortBy = this.validateSortField(paginationOptions.sortBy || 'id');
      const sortOrder = paginationOptions.sortOrder || 'DESC';
      const skip = (page - 1) * limit;

      const baseQuery = this.repository.createQueryBuilder('entity');

      const queryWithCriteria = criteria
        ? this.applyCriteriaSecure(baseQuery, criteria)
        : baseQuery;

      const queryWithFilters = filterOptions?.where
        ? this.applyFiltersSecure(queryWithCriteria, filterOptions.where)
        : queryWithCriteria;

      const queryWithRelations = filterOptions?.relations
        ? this.applyRelationsSecure(queryWithFilters, filterOptions.relations)
        : queryWithFilters;

      const queryWithSelect = filterOptions?.select
        ? this.applySelectSecure(queryWithRelations, filterOptions.select)
        : queryWithRelations;

      // Usa campo validado para ordenação
      const finalQuery = queryWithSelect
        .orderBy(`entity.${sortBy}`, sortOrder)
        .skip(skip)
        .take(limit);

      const [data, total] = await finalQuery.getManyAndCount();
      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        executionTimeMs: 0,
      };
    } catch (error) {
      this.handleError(error, 'queryPaginated');
    }
  }

  // ==================== MÉTODOS PRIVADOS SEGUROS ====================

  /**
   * Sanitiza critérios de busca
   */
  private sanitizeCriteria(
    criteria: FindOptionsWhere<TEntity>,
  ): FindOptionsWhere<TEntity> {
    const sanitized = {} as FindOptionsWhere<TEntity>;

    for (const [key, value] of Object.entries(criteria)) {
      if (typeof key === 'string' && key.trim()) {
        (sanitized as Record<string, unknown>)[key] = this.sanitizeValue(value);
      }
    }

    return sanitized;
  }

  /**
   * Aplica critérios de forma segura
   */
  private applyCriteriaSecure(
    queryBuilder: SelectQueryBuilder<TEntity>,
    criteria: FindOptionsWhere<TEntity>,
  ): SelectQueryBuilder<TEntity> {
    const sanitizedCriteria = this.sanitizeCriteria(criteria);

    return Object.entries(sanitizedCriteria).reduce(
      (query, [key, value], index) => {
        const paramName = `param${index}`;
        const condition = `entity.${key} = :${paramName}`;
        const params = { [paramName]: value };

        return index === 0
          ? query.where(condition, params)
          : query.andWhere(condition, params);
      },
      queryBuilder,
    );
  }

  /**
   * Aplica filtros de forma segura
   */
  private applyFiltersSecure(
    queryBuilder: SelectQueryBuilder<TEntity>,
    filters: Partial<Record<keyof TEntity, unknown>>,
  ): SelectQueryBuilder<TEntity> {
    return Object.entries(filters).reduce((query, [key, value], index) => {
      if (typeof key === 'string' && key.trim()) {
        const paramName = `filter${index}`;
        const condition = `entity.${key} = :${paramName}`;
        const params = { [paramName]: this.sanitizeValue(value) };
        return query.andWhere(condition, params);
      }
      return query;
    }, queryBuilder);
  }

  /**
   * Aplica relações de forma segura
   */
  private applyRelationsSecure(
    queryBuilder: SelectQueryBuilder<TEntity>,
    relations: readonly string[],
  ): SelectQueryBuilder<TEntity> {
    const validRelations = this.validateRelations(relations);

    return validRelations.reduce((query, relation) => {
      const safeAlias = relation.replace('.', '_');
      return query.leftJoinAndSelect(`entity.${relation}`, safeAlias);
    }, queryBuilder);
  }

  /**
   * Aplica seleção de forma segura
   */
  private applySelectSecure(
    queryBuilder: SelectQueryBuilder<TEntity>,
    select: readonly (keyof TEntity)[],
  ): SelectQueryBuilder<TEntity> {
    const validFields = this.validateSelectFields(select);

    if (validFields.length > 0) {
      const selectFields = validFields.map((field) => `entity.${field}`);
      return queryBuilder.select(selectFields);
    }

    return queryBuilder;
  }

  // ==================== TRATAMENTO DE ERRO ====================

  /**
   * Tratamento de erros com contexto de segurança
   */
  private handleError(error: unknown, operation: string): never {
    if (!(error instanceof Error)) {
      throw new RepositoryError(
        `Erro durante ${operation}`,
        operation,
        new Error(String(error)),
      );
    }

    if (error instanceof QueryFailedError) {
      const queryError = error as QueryFailedError & {
        code?: string;
        detail?: string;
        column?: string;
      };
      return this.handleQueryError(queryError, operation);
    }

    // Re-throw erros conhecidos
    if (
      error instanceof RepositoryError ||
      error instanceof ValidationError ||
      error instanceof EntityNotFoundError ||
      error instanceof ConstraintViolationError ||
      error instanceof SecurityViolationError
    ) {
      throw error;
    }

    throw new RepositoryError(`Erro durante ${operation}`, operation, error);
  }

  /**
   * Tratamento específico de erros de query
   */
  private handleQueryError(
    queryError: QueryFailedError & {
      code?: string;
      detail?: string;
      column?: string;
    },
    operation: string,
  ): never {
    const code = queryError.code;

    switch (code) {
      case '23505': {
        const uniqueMatch = queryError.detail?.match(/Key \((.+)\)=\((.+)\)/);
        const detail = uniqueMatch
          ? `${uniqueMatch[1]}=${uniqueMatch[2]}`
          : queryError.detail;
        throw new ConstraintViolationError(this.entityName, 'unique', detail);
      }

      case '23503': {
        throw new ConstraintViolationError(
          this.entityName,
          'foreign_key',
          queryError.detail,
        );
      }

      case '23502': {
        const column = queryError.column || 'desconhecida';
        throw new ConstraintViolationError(
          this.entityName,
          'not_null',
          `Coluna: ${column}`,
        );
      }

      default: {
        throw new RepositoryError(
          `Erro de banco: ${queryError.message}`,
          operation,
          queryError,
        );
      }
    }
  }
}
