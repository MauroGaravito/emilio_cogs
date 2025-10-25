import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Redirects any request from baseFrom to baseTo, preserving the remainder of the path and query string.
// Example: baseFrom='/admin', baseTo='/api/admin' -> '/admin/users?x=1' -> '/api/admin/users?x=1'
const ExternalRedirect = ({ baseFrom = '', baseTo = '' }) => {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    const rest = pathname.startsWith(baseFrom) ? pathname.slice(baseFrom.length) : pathname;
    const target = `${baseTo}${rest}${search || ''}${hash || ''}` || baseTo;
    window.location.replace(target);
  }, [pathname, search, hash, baseFrom, baseTo]);
  return null;
};

export default ExternalRedirect;

