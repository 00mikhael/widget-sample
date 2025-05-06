import React from 'react';
import { monitoring } from '../services/monitoring';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class WidgetErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    monitoring.captureError(error, {
      component: 'ChatWidget',
      level: 'fatal',
      location: 'error-boundary'
    });
  }

  render() {
    if (this.state.hasError) {
      // Hide widget on fatal errors
      return null;
    }
    return this.props.children;
  }
}

export default WidgetErrorBoundary;
