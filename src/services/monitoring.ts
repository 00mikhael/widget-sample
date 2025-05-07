import { init, captureException } from '@sentry/react';
import { IS_PRODUCTION, SENTRY_DSN, APP_VERSION, APP_ENV } from '../config';

class MonitoringService {
  private static instance: MonitoringService;

  private constructor() {
    if (IS_PRODUCTION) {
      init({
        dsn: SENTRY_DSN,
        environment: APP_ENV,
        enabled: IS_PRODUCTION,
        release: `lawma-ai-widget@${APP_VERSION}`,
        tracesSampleRate: 0.1,
        sendDefaultPii: false,
        defaultIntegrations: false,
        integrations: [],
      });
    }
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // Core error tracking only
  public captureError(error: Error, context?: Record<string, any>): void {
    if (IS_PRODUCTION) {
      captureException(error, { extra: context });
    }
  }
}

export const monitoring = MonitoringService.getInstance();
