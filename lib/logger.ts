/**
 * Prism Writing Console Logger
 * Centralized logging system with color-coded output
 */

type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  data?: any;
}

class PrismLogger {
  private logs: LogEntry[] = [];
  private startTime: number = Date.now();

  private formatTime(): string {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(3);
    return `+${elapsed}s`;
  }

  private log(level: LogLevel, message: string, ...data: any[]) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      data: data.length > 0 ? data : undefined,
    };
    this.logs.push(entry);

    const time = this.formatTime();
    const prefix = `[PRISM ${time}]`;

    switch (level) {
      case 'info':
        console.log(`%c${prefix} ${message}`, 'color: #06b6d4; font-weight: bold', ...data);
        break;
      case 'success':
        console.log(`%c${prefix} ✓ ${message}`, 'color: #10b981; font-weight: bold', ...data);
        break;
      case 'warn':
        console.warn(`%c${prefix} ⚠ ${message}`, 'color: #f59e0b; font-weight: bold', ...data);
        break;
      case 'error':
        console.error(`%c${prefix} ✗ ${message}`, 'color: #ef4444; font-weight: bold', ...data);
        break;
      case 'debug':
        console.debug(`%c${prefix} 🔍 ${message}`, 'color: #a855f7; font-weight: bold', ...data);
        break;
    }
  }

  info(message: string, ...data: any[]) {
    this.log('info', message, ...data);
  }

  success(message: string, ...data: any[]) {
    this.log('success', message, ...data);
  }

  warn(message: string, ...data: any[]) {
    this.log('warn', message, ...data);
  }

  error(message: string, ...data: any[]) {
    this.log('error', message, ...data);
  }

  debug(message: string, ...data: any[]) {
    this.log('debug', message, ...data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
    this.startTime = Date.now();
  }

  summary() {
    console.group('%c[PRISM] Loading Summary', 'color: #ec4899; font-weight: bold; font-size: 14px');
    console.log(`Total logs: ${this.logs.length}`);
    console.log(`Errors: ${this.logs.filter(l => l.level === 'error').length}`);
    console.log(`Warnings: ${this.logs.filter(l => l.level === 'warn').length}`);
    console.log(`Success: ${this.logs.filter(l => l.level === 'success').length}`);
    console.log(`Total time: ${((Date.now() - this.startTime) / 1000).toFixed(2)}s`);
    console.groupEnd();
  }
}

export const logger = new PrismLogger();

// Make logger available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).prismLogger = logger;
}
