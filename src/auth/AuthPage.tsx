import { Navigate, Route, Routes } from 'react-router';
import {
  Login,
  ResetPassword,
  ResetPasswordChange,
  ResetPasswordChanged,
  ResetPasswordCheckEmail,
  Signup,
  ConfirmSignup
} from './pages/jwt';
import { AuthBrandedLayout } from '@/layouts/auth-branded';
import { CheckEmail } from '@/auth/pages/jwt';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { ScreenLoader } from '@/components';



const AuthPage = () => {
  const { user, loading } = useFirebaseAuth();
  if (loading) {
    return <ScreenLoader />;
  }


  if (user) {
    return <Navigate to="/" />;
  }
  return (
    (
      <Routes>
        <Route element={<AuthBrandedLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="confirm-signup" element={<ConfirmSignup />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="signup/check-email" element={<CheckEmail />} />
    
          <Route path="/reset-password/check-email" element={<ResetPasswordCheckEmail />} />
          <Route path="/reset-password/change" element={<ResetPasswordChange />} />
          <Route path="/reset-password/changed" element={<ResetPasswordChanged />} />
          <Route path="*" element={<Navigate to="/error/404" />} />
        </Route>
      </Routes>
    )
  )
}

export { AuthPage };
