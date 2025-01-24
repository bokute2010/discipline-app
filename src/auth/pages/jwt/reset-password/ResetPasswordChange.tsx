import { KeenIcon } from '@/components';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { useAuthContext } from '@/auth/useAuthContext';
import { useLayout } from '@/providers';

const initialValues = {
  code: '',
  password: '',
  confirmpassword: ''
};

const forgotPasswordSchema = Yup.object().shape({
  code: Yup.string()
    .min(6, 'Tối thiểu 6 ký tự')
    .max(6, 'Tối đa 6 ký tự')
    .required('Mã xác nhận là bắt buộc'),

  password: Yup.string()
    .min(8, 'Tối thiểu 8 ký tự')
    .max(50, 'Tối đa 50 ký tự')
    .required('Mật khẩu là bắt buộc')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Mật khẩu phải chứa ít nhất 8 ký tự, một ký tự viết hoa, một ký tự số và một ký tự đặc biệt'
    ),
  confirmpassword: Yup.string()
    .min(8, 'Minimum 8 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password confirmation is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Mật khẩu phải chứa ít nhất 8 ký tự, một ký tự viết hoa, một ký tự số và một ký tự đặc biệt'
    )
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
});
const ResetPasswordChange = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const { handleConfirmResetPassword } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      try {
        if (!handleConfirmResetPassword) {
          throw new Error('JWTProvider is required for this form.');
        }

        const username = localStorage.getItem('account_reset_pw');
        if (!username) {
          throw new Error('Username is required for this form.');
        }

        await handleConfirmResetPassword(username, values.code.toString(), values.password);

        localStorage.removeItem('account_reset_pw');

        navigate('/auth/reset-password/changed');

        setHasErrors(false);
        setLoading(false);
      } catch (error: any) {
        console.error(error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'The confirm signup details are incorrect';
        setStatus(errorMessage);
        setSubmitting(false);
        setHasErrors(false);
      } finally {
        setHasErrors(false);
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  const togglePassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className="card max-w-[370px] w-full">
      <form
        noValidate
        onSubmit={formik.handleSubmit}
        className="card-body flex flex-col gap-5 p-10"
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Đặt lại mật khẩu</h3>
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Mã xác nhận</label>

          <label className="input">
            <input
              placeholder="123456"
              type="number"
              autoComplete="off"
              {...formik.getFieldProps('code')}
              maxLength={6}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.code && formik.errors.code },
                {
                  'is-valid': formik.touched.code && !formik.errors.code
                }
              )}
            />
          </label>
          {formik.touched.code && formik.errors.code && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.code}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Mật khẩu mới</label>

          <label className="input">
            <input
              placeholder="Nhập mật khẩu mới"
              type={showPassword ? 'text' : 'password'}
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.password && formik.errors.password
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password
                }
              )}
            />
            <button className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showPassword })} />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showPassword })}
              />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">	Xác nhận mật khẩu</label>

          <label className="input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              autoComplete="off"
              {...formik.getFieldProps('confirmpassword')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.confirmpassword && formik.errors.confirmpassword
                },
                {
                  'is-valid': formik.touched.confirmpassword && !formik.errors.confirmpassword
                }
              )}
            />
            <button className="btn btn-icon" onClick={toggleConfirmPassword}>
              <KeenIcon
                icon="eye"
                className={clsx('text-gray-500', { hidden: showConfirmPassword })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showConfirmPassword })}
              />
            </button>
          </label>
          {formik.touched.confirmpassword && formik.errors.confirmpassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.confirmpassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Vui lòng đợi...' : 'Đặt lại mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export { ResetPasswordChange };
