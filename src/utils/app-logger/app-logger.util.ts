import { Inject, Injectable } from '@nestjs/common';
import type { Params } from 'nestjs-pino';
import { PARAMS_PROVIDER_TOKEN, PinoLogger } from 'nestjs-pino';

/**
 * Classe de logger customizada que estende PinoLogger
 * Fornece funcionalidades adicionais como captura de contexto do caller
 * e formatação estruturada de mensagens de log
 *
 * @class AppLogger
 * @extends PinoLogger
 */
@Injectable()
export class AppLogger extends PinoLogger {
  /**
   * Construtor da classe AppLogger
   * @param params - Parâmetros de configuração do PinoLogger
   */
  constructor(@Inject(PARAMS_PROVIDER_TOKEN) params: Params) {
    super(params);
  }

  /**
   * Obtém informações sobre quem chamou o método de log
   * Analisa a stack trace para identificar o arquivo e linha de origem
   *
   * @private
   * @returns {string} Informações do caller no formato "arquivo:linha"
   */
  private getCallerInfo() {
    const e = new Error();
    const stack = e.stack.toString().split(/\r\n|\n/);
    // Retorna a linha 4 da stack trace (após os frames internos do logger)
    return stack[4]?.replace('at', '')?.trim() ?? '';
  }

  /**
   * Constrói a mensagem de log estruturada
   * Inclui contexto, caller e dados adicionais quando fornecidos
   *
   * @private
   * @param {string} message - Mensagem principal do log
   * @param {unknown} data - Dados adicionais para incluir no log (opcional)
   * @param {boolean} isError - Indica se é um log de erro (padrão: false)
   * @returns {object} Objeto estruturado com todas as informações do log
   */
  private buildLogMessage(message: string, data?: unknown, isError = false) {
    if (isError) {
      return { message, error: data, context: this.context };
    }

    const caller = this.getCallerInfo();

    const result = data
      ? { message, data, context: this.context, caller }
      : { message, context: this.context, caller };

    return result;
  }

  /**
   * Registra uma mensagem de log informativa
   * Inclui automaticamente contexto e informações do caller
   *
   * @public
   * @param {string} message - Mensagem a ser logada
   * @param {unknown} data - Dados adicionais para incluir no log (opcional)
   */
  public log(message: string, data?: unknown): void {
    return this.logger.info(this.buildLogMessage(message, data));
  }

  /**
   * Registra uma mensagem de erro
   * Inclui automaticamente contexto e marca os dados como erro
   *
   * @public
   * @param {string} message - Mensagem de erro
   * @param {unknown} data - Dados do erro (opcional)
   */
  public error(message: string, data?: unknown): void {
    return this.logger.error(this.buildLogMessage(message, data, true));
  }

  /**
   * Registra uma mensagem de warning
   * Inclui automaticamente contexto e informações do caller
   *
   * @public
   * @param {string} message - Mensagem de warning
   * @param {unknown} data - Dados adicionais para incluir no log (opcional)
   */
  public warn(message: string, data?: unknown): void {
    return this.logger.warn(this.buildLogMessage(message, data));
  }
}
