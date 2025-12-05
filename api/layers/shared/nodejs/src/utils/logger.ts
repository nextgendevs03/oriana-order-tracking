export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogContext {
  requestId?: string;
  [key: string]: unknown;
}

// Log level hierarchy for filtering
const LOG_LEVEL_PRIORITY: Record<string, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  private context: LogContext = {};
  private minLevel: number;

  constructor() {
    // Default to WARN in production (less verbose), INFO if explicitly set
    const configuredLevel = process.env.LOG_LEVEL?.toUpperCase() || 'WARN';
    this.minLevel = LOG_LEVEL_PRIORITY[configuredLevel] ?? LOG_LEVEL_PRIORITY.WARN;
  }

  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  clearContext(): void {
    this.context = {};
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= this.minLevel;
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const logEntry: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
    };
    if (data !== undefined) {
      logEntry.data = data;
    }
    return JSON.stringify(logEntry);
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, data));
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage(LogLevel.INFO, message, data));
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, data));
    }
  }

  error(message: string, error?: Error | unknown): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorData =
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : error;
      console.error(this.formatMessage(LogLevel.ERROR, message, errorData));
    }
  }
}

export const logger = new Logger();
