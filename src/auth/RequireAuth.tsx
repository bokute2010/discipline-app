import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/loaders';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

const RequireAuth = () => {

  const location = useLocation();
  const { user, loading } = useFirebaseAuth();

  if (loading) {
    return <ScreenLoader />;
  }

  return user ? <Outlet /> : <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export { RequireAuth };
