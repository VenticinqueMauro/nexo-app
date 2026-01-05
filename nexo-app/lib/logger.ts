/**
 * Centralized logging utility
 * Provides consistent logging across the application with environment awareness
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogContext = {
  module?: string
  action?: string
  userId?: string
  [key: string]: unknown
}

const isDev = process.env.NODE_ENV === 'development'

/**
 * Format log message with timestamp and context
 */
function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString()
  const contextStr = context ? ` ${JSON.stringify(context)}` : ''
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
}

/**
 * Logger utility with environment-aware logging
 * In production, only warn and error are logged
 * In development, all levels are logged
 */
export const logger = {
  /**
   * Debug level - only logs in development
   */
  debug(message: string, context?: LogContext): void {
    if (isDev) {
      console.debug(formatMessage('debug', message, context))
    }
  },

  /**
   * Info level - only logs in development
   */
  info(message: string, context?: LogContext): void {
    if (isDev) {
      console.info(formatMessage('info', message, context))
    }
  },

  /**
   * Warning level - always logs
   */
  warn(message: string, context?: LogContext): void {
    console.warn(formatMessage('warn', message, context))
  },

  /**
   * Error level - always logs
   * Optionally accepts an Error object for stack trace
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      ...(error instanceof Error && {
        errorName: error.name,
        errorMessage: error.message,
        stack: isDev ? error.stack : undefined,
      }),
    }
    console.error(formatMessage('error', message, errorContext))
  },
}

/**
 * Create a scoped logger for a specific module
 * Automatically adds module context to all log calls
 */
export function createLogger(module: string) {
  return {
    debug: (message: string, context?: Omit<LogContext, 'module'>) =>
      logger.debug(message, { module, ...context }),
    info: (message: string, context?: Omit<LogContext, 'module'>) =>
      logger.info(message, { module, ...context }),
    warn: (message: string, context?: Omit<LogContext, 'module'>) =>
      logger.warn(message, { module, ...context }),
    error: (message: string, error?: unknown, context?: Omit<LogContext, 'module'>) =>
      logger.error(message, error, { module, ...context }),
  }
}
