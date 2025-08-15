// Comprehensive monitoring and logging service for banking application

interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

interface LogEntry {
  level: keyof LogLevel;
  message: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  stack?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
}

interface SecurityEvent {
  type: 'auth_failure' | 'suspicious_activity' | 'data_access' | 'privilege_escalation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId?: string;
  ipAddress?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

class MonitoringService {
  private logs: LogEntry[] = [];
  private metrics: PerformanceMetric[] = [];
  private securityEvents: SecurityEvent[] = [];
  private performanceObserver?: PerformanceObserver;
  private errorHandler?: (event: ErrorEvent) => void;
  private unhandledRejectionHandler?: (event: PromiseRejectionEvent) => void;

  constructor() {
    this.setupErrorHandling();
    this.setupPerformanceMonitoring();
  }

  // Logging methods
  public error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.log('ERROR', message, {
      ...metadata,
      stack: error?.stack,
      errorName: error?.name,
      errorMessage: error?.message,
    });
  }

  public warn(message: string, metadata?: Record<string, any>) {
    this.log('WARN', message, metadata);
  }

  public info(message: string, metadata?: Record<string, any>) {
    this.log('INFO', message, metadata);
  }

  public debug(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, metadata);
    }
  }

  private log(level: keyof LogLevel, message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      metadata,
    };

    this.logs.push(entry);
    
    // Console output in development
    if (process.env.NODE_ENV === 'development') {
      console[level.toLowerCase() as keyof Console](
        `[${entry.timestamp}] ${level}: ${message}`,
        metadata || ''
      );
    }

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(entry);
    }

    // Limit log storage
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-500);
    }
  }

  // Performance monitoring
  public recordMetric(name: string, value: number, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      tags,
    };

    this.metrics.push(metric);

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendMetricToAnalytics(metric);
    }
  }

  public startTimer(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(`timer.${name}`, duration, { unit: 'ms' });
    };
  }

  // Security monitoring
  public recordSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    this.securityEvents.push(securityEvent);

    // Immediate alert for critical events
    if (event.severity === 'critical') {
      this.sendSecurityAlert(securityEvent);
    }

    // Send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendSecurityEventToService(securityEvent);
    }
  }

  // User interaction tracking
  public trackUserAction(action: string, metadata?: Record<string, any>) {
    this.info(`User action: ${action}`, {
      action,
      ...metadata,
      page: window.location.pathname,
      referrer: document.referrer,
    });
  }

  public trackPageView(page: string) {
    this.info(`Page view: ${page}`, {
      page,
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
    });

    // Track performance for page loads
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.recordMetric('page.load_time', navigation.loadEventEnd - navigation.fetchStart, {
          page,
          type: 'navigation',
        });
      }
    }
  }

  // Banking-specific monitoring
  public trackTransactionAttempt(type: string, amount: number, success: boolean) {
    this.info(`Transaction attempt: ${type}`, {
      transaction_type: type,
      amount,
      success,
      timestamp: new Date().toISOString(),
    });

    if (!success) {
      this.recordSecurityEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        description: `Failed transaction attempt: ${type} for $${amount}`,
        metadata: { transaction_type: type, amount },
      });
    }
  }

  public trackAuthenticationAttempt(method: string, success: boolean, reason?: string) {
    const message = `Authentication attempt: ${method} - ${success ? 'success' : 'failure'}`;
    
    if (success) {
      this.info(message, { auth_method: method, success });
    } else {
      this.warn(message, { auth_method: method, success, reason });
      
      this.recordSecurityEvent({
        type: 'auth_failure',
        severity: 'medium',
        description: `Failed authentication: ${method}${reason ? ` - ${reason}` : ''}`,
        metadata: { auth_method: method, reason },
      });
    }
  }

  // Error handling setup
  private setupErrorHandling() {
    // Global error handler
    this.errorHandler = (event: ErrorEvent) => {
      this.error('Uncaught error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    // Unhandled promise rejection handler
    this.unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      this.error('Unhandled promise rejection', event.reason, {
        type: 'unhandled_rejection',
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.errorHandler);
      window.addEventListener('unhandledrejection', this.unhandledRejectionHandler);
    }
  }

  // Performance monitoring setup
  private setupPerformanceMonitoring() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor Core Web Vitals
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            this.recordMetric(`performance.${entry.name}`, entry.duration);
          } else if (entry.entryType === 'navigation') {
            const nav = entry as PerformanceNavigationTiming;
            this.recordMetric('performance.dom_content_loaded', nav.domContentLoadedEventEnd - nav.fetchStart);
            this.recordMetric('performance.first_paint', nav.loadEventEnd - nav.fetchStart);
          }
        }
      });

      try {
        this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        this.debug('Performance observer not supported', { error: error.message });
      }
    }
  }

  // Data export and retrieval
  public getLogs(level?: keyof LogLevel, limit: number = 100): LogEntry[] {
    let filtered = this.logs;
    
    if (level) {
      filtered = this.logs.filter(log => log.level === level);
    }
    
    return filtered.slice(-limit);
  }

  public getMetrics(name?: string, limit: number = 100): PerformanceMetric[] {
    let filtered = this.metrics;
    
    if (name) {
      filtered = this.metrics.filter(metric => metric.name === name);
    }
    
    return filtered.slice(-limit);
  }

  public getSecurityEvents(severity?: SecurityEvent['severity'], limit: number = 100): SecurityEvent[] {
    let filtered = this.securityEvents;
    
    if (severity) {
      filtered = this.securityEvents.filter(event => event.severity === severity);
    }
    
    return filtered.slice(-limit);
  }

  public exportDiagnostics() {
    return {
      logs: this.getLogs(),
      metrics: this.getMetrics(),
      securityEvents: this.getSecurityEvents(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  // Utility methods
  private getCurrentUserId(): string | undefined {
    // This would integrate with your auth system
    return localStorage.getItem('userId') || undefined;
  }

  private getSessionId(): string | undefined {
    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  private async sendToExternalService(entry: LogEntry) {
    try {
      // In production, send to your logging service (e.g., LogRocket, Sentry, etc.)
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  private async sendMetricToAnalytics(metric: PerformanceMetric) {
    try {
      // Send to analytics service (e.g., Google Analytics, Mixpanel, etc.)
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.error('Failed to send metric to analytics:', error);
    }
  }

  private async sendSecurityEventToService(event: SecurityEvent) {
    try {
      // Send to security monitoring service
      await fetch('/api/security-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send security event:', error);
    }
  }

  private async sendSecurityAlert(event: SecurityEvent) {
    try {
      // Send immediate alert for critical security events
      await fetch('/api/security-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send security alert:', error);
    }
  }

  // Cleanup
  public destroy() {
    if (typeof window !== 'undefined') {
      if (this.errorHandler) {
        window.removeEventListener('error', this.errorHandler);
      }
      if (this.unhandledRejectionHandler) {
        window.removeEventListener('unhandledrejection', this.unhandledRejectionHandler);
      }
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}

// Create singleton instance
export const monitoring = new MonitoringService();

// React hook for monitoring
export const useMonitoring = () => {
  React.useEffect(() => {
    // Track page view when component mounts
    monitoring.trackPageView(window.location.pathname);
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return {
    error: monitoring.error.bind(monitoring),
    warn: monitoring.warn.bind(monitoring),
    info: monitoring.info.bind(monitoring),
    debug: monitoring.debug.bind(monitoring),
    trackUserAction: monitoring.trackUserAction.bind(monitoring),
    recordMetric: monitoring.recordMetric.bind(monitoring),
    startTimer: monitoring.startTimer.bind(monitoring),
    trackTransactionAttempt: monitoring.trackTransactionAttempt.bind(monitoring),
    trackAuthenticationAttempt: monitoring.trackAuthenticationAttempt.bind(monitoring),
  };
};

export default monitoring;
