import { MouseEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { KeenIcon } from '@/components';
import { useAuthContext } from '@/auth';
import { useLayout } from '@/providers';
import { useCreateUser } from '@/api/mutations/user.mutation';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useSignIn } from '@/api/mutations/auth.mutation';
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .min(5, 'Tối thiểu 5 ký tự')
    .max(50, 'Tối đa 50 ký tự')
    .required('Email hoặc tên đăng nhập là bắt buộc'),
  password: Yup.string()
    .min(8, 'Tối thiểu 8 ký tự')
    .max(50, 'Tối đa 50 ký tự')
    .required('Mật khẩu là bắt buộc')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Mật khẩu phải chứa ít nhất 8 ký tự, một ký tự viết hoa, một ký tự số và một ký tự đặc biệt'
    ),
  remember: Yup.boolean()
});

const Login = () => {

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { mutate: signIn } = useSignIn(); 
  const { currentLayout } = useLayout();
  let initialValues = {
    email: localStorage.getItem('email') || '',
    password: '',
    remember: !!localStorage.getItem('email')
  };
  if (import.meta.env.VITE_APP_MODE === 'DEV') {
    initialValues = {
      email: 'weedlee.developer@gmail.com',
      password: '@Test123',
      remember: !!localStorage.getItem('email')
    };
  }

  const handleTogglePassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword((prev) => !prev);
  };


  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      signIn({
        email: values.email,
        password: values.password
      })
    }
  });

  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <Header currentLayout={currentLayout} />
        <InputField
          label="Email hoặc tên đăng nhập"
          name="email"
          placeholder="Nhập email hoặc tên đăng nhập"
          formik={formik}
        />
        <PasswordField
          showPassword={showPassword}
          togglePassword={handleTogglePassword}
          formik={formik}
          currentLayout={currentLayout}
        />
        <RememberMeCheckbox formik={formik} />
        <SubmitButton loading={loading} formik={formik} />

        {formik.status && (
          <div className="text-danger text-xs mt-1" role="alert">
            {formik.status}
          </div>
        )}
      </form>
    </div>
  );
};

// Sub-components

const Header = ({ currentLayout }: { currentLayout: any }) => (
  <div className="text-center mb-2.5">
    <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">Đăng nhập</h3>
    <div className="flex items-center justify-center font-medium">
      <span className="text-2sm text-gray-600 me-1.5">Chưa có tài khoản?</span>
      <Link
        to={currentLayout?.name === 'auth-branded' ? '/auth/signup' : '/auth/classic/signup'}
        className="text-2sm link"
      >
        Đăng ký ngay
      </Link>
    </div>
  </div>
);

const InputField = ({ label, name, placeholder, formik }: any) => (
  <div className="flex flex-col gap-1">
    <label className="form-label text-gray-900">{label}</label>
    <label className="input">
      <input
        placeholder={placeholder}
        autoComplete="off"
        {...formik.getFieldProps(name)}
        className={clsx('form-control', {
          'is-invalid': formik.touched[name] && formik.errors[name]
        })}
      />
    </label>
    {formik.touched[name] && formik.errors[name] && (
      <span role="alert" className="text-danger text-xs mt-1">
        {formik.errors[name]}
      </span>
    )}
  </div>
);

const PasswordField = ({ showPassword, togglePassword, formik, currentLayout }: any) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between gap-1">
      <label className="form-label text-gray-900">Mật khẩu</label>
      <Link
        to={
          currentLayout?.name === 'auth-branded'
            ? '/auth/reset-password'
            : '/auth/classic/reset-password'
        }
        className="text-2sm link shrink-0"
      >
        Quên mật khẩu?
      </Link>
    </div>
    <label className="input">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Nhập mật khẩu"
        autoComplete="off"
        {...formik.getFieldProps('password')}
        className={clsx('form-control', {
          'is-invalid': formik.touched.password && formik.errors.password
        })}
      />
      <button className="btn btn-icon" onClick={togglePassword}>
        <KeenIcon icon={showPassword ? 'eye-slash' : 'eye'} className="text-gray-500" />
      </button>
    </label>
    {formik.touched.password && formik.errors.password && (
      <span role="alert" className="text-danger text-xs mt-1">
        {formik.errors.password}
      </span>
    )}
  </div>
);

const RememberMeCheckbox = ({ formik }: any) => (
  <label className="checkbox-group">
    <input
      className="checkbox checkbox-sm"
      type="checkbox"
      checked={formik.values.remember}
      {...formik.getFieldProps('remember')}
    />
    <span className="checkbox-label">Lưu thông tin đăng nhập</span>
  </label>
);

const SubmitButton = ({ loading, formik }: any) => (
  <button
    type="submit"
    className="btn btn-primary flex justify-center grow"
    disabled={loading || formik.isSubmitting}
  >
    {loading ? 'Vui lòng đợi...' : 'Đăng nhập'}
  </button>
);

export { Login };
