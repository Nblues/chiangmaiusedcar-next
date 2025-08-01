import React, { useEffect, useState } from 'react';

function ClientOnlyComponent({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  return <>{children}</>;
}

export default ClientOnlyComponent;
