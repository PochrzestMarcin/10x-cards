type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export class OpenRouterLogger {
  private static readonly sensitiveFields = ['apiKey', 'Authorization'];

  private static sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...context };
    
    for (const [key, value] of Object.entries(sanitized)) {
      if (this.sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeContext(value as Record<string, unknown>);
      }
    }
    
    return sanitized;
  }

  static log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context ? this.sanitizeContext(context) : undefined
    };

    // In production, this would send to a proper logging service
    // For now, we just console.log with appropriate level
    switch (level) {
      case 'debug':
        console.debug(JSON.stringify(entry, null, 2));
        break;
      case 'info':
        console.info(JSON.stringify(entry, null, 2));
        break;
      case 'warn':
        console.warn(JSON.stringify(entry, null, 2));
        break;
      case 'error':
        console.error(JSON.stringify(entry, null, 2));
        break;
    }
  }
}
