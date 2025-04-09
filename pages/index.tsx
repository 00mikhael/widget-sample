// @ts-ignore
import WidgetModule from '../src/widget';

// To satisfy nextjs component requirement
// export default function Home() {
//   return <></>;
// }

// Declare global window interface
declare global {
  interface Window {
    LAWMAai: typeof WidgetModule;
  }
}

// Export the init function for standalone use
if (typeof window !== 'undefined') {
  window.LAWMAai = WidgetModule;
}
