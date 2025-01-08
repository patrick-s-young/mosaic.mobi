import ReactGA from 'react-ga4';

export const traceEvent = ({ category, action, label }: { category: string, action: string, label: string }) => {
  ReactGA.event({
    category,
    action,
    label
  });
}