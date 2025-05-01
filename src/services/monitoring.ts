import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from '@sentry/browser';
import mixpanel from 'mixpanel-browser';

import { SENTRY_DSN, MIXPANEL_TOKEN, IS_PRODUCTION, APP_VERSION, APP_ENV } from '../config';

class MonitoringService {
  private static instance: MonitoringService;

  private constructor() {
    // Initialize Sentry
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [
        browserTracingIntegration(),
      ],
      tracesSampleRate: 1.0,
      // Adjust this value in production
      environment: APP_ENV,
      // Only capture errors in production
      enabled: IS_PRODUCTION,
      // Include version for source map association
      release: `lawma-ai-widget@${APP_VERSION}`,
    });

    // Initialize Mixpanel
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: !IS_PRODUCTION,
      track_pageview: true,
      persistence: 'localStorage',
    });
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // Error tracking
  public captureError(error: Error, context?: Record<string, any>) {
    Sentry.captureException(error, { extra: context });
  }

  // Performance monitoring
  private startTime: number | null = null;

  public startPerformanceTransaction(name: string, data?: Record<string, any>): void {
    this.startTime = performance.now();
  }

  public finishTransaction(): void {
    if (this.startTime) {
      const duration = performance.now() - this.startTime;
      Sentry.addBreadcrumb({
        type: 'debug',
        category: 'performance',
        message: `Operation took ${duration}ms`,
        data: { duration }
      });
      this.startTime = null;
    }
  }

  // User behavior tracking
  public trackEvent(eventName: string, properties?: Record<string, any>) {
    mixpanel.track(eventName, properties);
  }

  public setUserProperties(properties: Record<string, any>) {
    mixpanel.people.set(properties);
  }

  public identifyUser(userId: string) {
    Sentry.setUser({ id: userId });
    mixpanel.identify(userId);
  }
}

export const monitoring = MonitoringService.getInstance();
