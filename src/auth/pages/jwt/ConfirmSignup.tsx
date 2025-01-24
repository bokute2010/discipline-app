import clsx from 'clsx';
import { useFormik, FormikProps } from 'formik';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { useLayout } from '@/providers';
import { useAuthContext } from '@/auth';

// Constants
const initialValues = { code: '' };
const signupSchema = Yup.object().shape({
  code: Yup.string()
    .min(6, 'Tối thiểu 6 ký tự')
    .max(6, 'Tối đa 6 ký tự')
    .required('Mã xác nhận là bắt buộc')
});

// Utility Functions
const getUsername = () => localStorage.getItem('signup_username');
const ConfirmSignup = () => {
  const [loading, setLoading] = useState(false);
  const { register, confirmRegister, resendCodeConfirmRegister } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/auth/login';
  const { currentLayout } = useLayout();

  // Formik Setup
  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (!register) throw new Error('JWTProvider is required for this form.');

        const username = getUsername();
        if (!username) {
          navigate('/auth/login', { replace: true });
          throw new Error('Username is required');
        }

        await confirmRegister(username, values.code);
        navigate(from, { replace: true });
      } catch (error: any) {
        console.error(error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'The confirm signup details are incorrect';
        setStatus(errorMessage);
        setSubmitting(false);
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  // Handle Resend Code
  const handleResend = async () => {
    try {
      if (!resendCodeConfirmRegister) throw new Error('JWTProvider is required for this form.');

      const username = getUsername();
      if (!username) {
        navigate('/auth/login', { replace: true });
        throw new Error('Username is required');
      }

      await resendCodeConfirmRegister(username);
    } catch (error) {
      console.error(error);
    }
  };

  // Render Form
  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <Header currentLayout={currentLayout} />
        <InputField formik={formik} />
        <SubmitButton loading={loading} isSubmitting={formik.isSubmitting} />
        <ResendButton handleResend={handleResend} />
        {formik.status && <AlertMessage message={formik.status} />}
      </form>
    </div>
  );
};

// Subcomponents
const Header = ({ currentLayout }: { currentLayout: any }) => (
  <div className="text-center mb-2.5">
    <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">Xác nhận đăng ký</h3>
    <div className="flex items-center justify-center font-medium">
      <span className="text-2sm text-gray-600 me-1.5">Đã có tài khoản?</span>
      <Link
        to={currentLayout?.name === 'auth-branded' ? '/auth/login' : '/auth/classic/login'}
        className="text-2sm link"
      >
        Đăng nhập ngay
      </Link>
    </div>
  </div>
);

const InputField = ({ formik }: { formik: FormikProps<{ code: string }> }) => (
  <div className="flex flex-col gap-1">
    <label className="form-label text-gray-900">Mã xác nhận</label>
    <label className="input">
      <input
        placeholder="123456"
        type="text"
        autoComplete="off"
        {...formik.getFieldProps('code')}
        maxLength={6}
        className={clsx(
          'form-control bg-transparent',
          { 'is-invalid': formik.touched.code && formik.errors.code },
          { 'is-valid': formik.touched.code && !formik.errors.code }
        )}
      />
    </label>
    {formik.touched.code && formik.errors.code && (
      <span role="alert" className="text-danger text-xs mt-1">
        {formik.errors.code}
      </span>
    )}
  </div>
);

const SubmitButton = ({ loading, isSubmitting }: { loading: boolean; isSubmitting: boolean }) => (
  <button
    type="submit"
    className="btn btn-primary flex justify-center grow"
    disabled={loading || isSubmitting}
  >
    {loading ? 'Vui lòng chờ...' : 'Xác nhận'}
  </button>
);

const ResendButton = ({ handleResend }: { handleResend: () => void }) => (
  <div className="flex items-center justify-center gap-1">
    <span className="text-xs text-gray-600">Không nhận được mã?</span>
    <button onClick={handleResend} type="button" className="text-xs font-medium link">
      Gửi lại mã
    </button>
  </div>
);

const AlertMessage = ({ message }: { message: string }) => (
  <div className="text-danger text-xs mt-1" role="alert">
    {message}
  </div>
);

export { ConfirmSignup };
