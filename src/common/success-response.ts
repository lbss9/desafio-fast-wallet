import { HttpStatus } from '@nestjs/common';

export interface SuccessResponseOptions<T> {
  message: string;
  code: string;
  data?: T;
  successCode?: HttpStatus;
  meta?: Record<string, any>;
  requestId?: string;
}

export class SuccessResponse<T> {
  constructor(
    public readonly message: string,
    private readonly code: string,
    public readonly data?: T,
    public readonly successCode?: HttpStatus,
    public readonly meta?: Record<string, any>,
    public readonly requestId?: string,
  ) {}

  public static toJson<T>(options: SuccessResponseOptions<T>): {
    success: boolean;
    message: string;
    code: string;
    successCode: number;
    data?: T;
    meta?: Record<string, any>;
    timestamp: string;
    requestId?: string;
  } {
    const {
      message,
      code,
      data,
      successCode = HttpStatus.OK,
      meta,
      requestId,
    } = options;

    return {
      success: true,
      message,
      code,
      successCode,
      data,
      meta,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }
}
