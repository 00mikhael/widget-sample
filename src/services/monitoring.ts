import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from '@sentry/browser';
import { Transaction, Hub, Scope } from '@sentry/types';
import mixpanel from 'mixpanel-browser';

import { SENTRY_DSN, MIXPANEL_TOKEN } from '../config';

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
      environment: process.env.NODE_ENV || 'development',
      // Only capture errors in production
      enabled: process.env.NODE_ENV === 'production',
    });

    // Initialize Mixpanel
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV !== 'production',
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
  public startPerformanceTransaction(name: string, data?: Record<string, any>): Transaction {
    const hub = (Sentry as any).getCurrentHub();
    const transaction = hub.startTransaction({
      name: name,
      op: 'widget-transaction',
      ...data
    });

    hub.configureScope((scope: Scope) => {
      scope.setSpan(transaction);
    });

    return transaction;
  }

  public finishTransaction(transaction: Transaction) {
    transaction.finish();
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
