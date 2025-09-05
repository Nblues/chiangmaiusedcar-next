/**
 * NoSSR Component - Prevents hydration mismatches by only rendering on client
 * Use this wrapper for components that must render differently on server vs client
 */
import { useState, useEffect } from 'react';

export default function NoSSR({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return children;
}

// Alternative HOC approach
export function withNoSSR(Component, fallback = null) {
  const NoSSRComponent = props => (
    <NoSSR fallback={fallback}>
      <Component {...props} />
    </NoSSR>
  );

  NoSSRComponent.displayName = `withNoSSR(${Component.displayName || Component.name})`;

  return NoSSRComponent;
}
