type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

const sensitiveFields = ["apiKey", "Authorization"];

function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...context };

  for (const [key, value] of Object.entries(sanitized)) {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeContext(value as Record<string, unknown>);
    }
  }

  return sanitized;
}

export function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context: context ? sanitizeContext(context) : undefined,
  };

  // In production, this would send to a proper logging service
  // For now, we just console.log with appropriate level
  switch (level) {
    case "debug":
      console.debug(JSON.stringify(entry, null, 2));
      break;
    case "info":
      console.info(JSON.stringify(entry, null, 2));
      break;
    case "warn":
      console.warn(JSON.stringify(entry, null, 2));
      break;
    case "error":
      console.error(JSON.stringify(entry, null, 2));
      break;
  }
}
