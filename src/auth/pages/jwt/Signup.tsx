import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { useAuthContext } from '../../useAuthContext';
import { KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import { useSignUp } from '@/api/mutations/auth.mutation';

const randomNumber = Math.round(Math.random() * 10000000000);

const initialValues =
  import.meta.env.VITE_APP_MODE === 'DEV'
    ? {
       
        email: `weedlee.developer+${randomNumber}@gmail.com`,
        password: '@Test123',
        confirmpassword: '@Test123',
        acceptTerms: false
      }
    : {
      
        email: '',
        password: '',
        confirmpassword: '',
        acceptTerms: false
      };

const signupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Sai định dạng email')
    .min(3, 'Tối thiểu 3 ký tự')
    .max(50, 'Tối đa 50 ký tự')
    .required('Email là bắt buộc'),
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
  acceptTerms: Yup.bool().required('Bạn phải chấp nhận điều khoản và điều kiện')
});

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentLayout } = useLayout();
  const {mutate: signup} = useSignUp();

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      // setLoading(true);
      try {
        console.log('values', values);
        signup({
          email: values.email,
          password: values.password
        })
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
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">Đăng ký</h3>
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

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              placeholder="email@email.com"
              type="email"
              autoComplete="off"
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                {
                  'is-valid': formik.touched.email && !formik.errors.email
                }
              )}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>


        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Mật khẩu</label>
          <label className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              autoComplete="off"
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
          <label className="form-label text-gray-900">Nhập lại mật khẩu</label>
          <label className="input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter Password"
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

        <label className="checkbox-group">
          <input
            className="checkbox checkbox-sm"
            type="checkbox"
            {...formik.getFieldProps('acceptTerms')}
          />
          <span className="checkbox-label">
            Tôi đồng ý với{' '}
            <Link to="#" className="text-2sm link">
              Điều khoản và điều kiện
            </Link>
          </span>
        </label>
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors.acceptTerms}
          </span>
        )}

        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Vui lòng đợi...' : 'Đăng ký'}
        </button>

        {formik.status && (
          <div className="text-danger text-xs mt-1" role="alert">
            {formik.status}
          </div>
        )}
      </form>
    </div>
  );
};

export { Signup };
