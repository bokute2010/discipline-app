import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';


import { toAbsoluteUrl } from '@/utils';
import { KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import { useAuthContext } from '@/auth';

const initialValues = {
    code: '',

};

const signupSchema = Yup.object().shape({

  code: Yup.string()
    .min(6, 'Minimum 5 symbols')
    .max(6, 'Maximum 50 symbols')
    .required('Verify code is required'),

});

const ConfirmSignup = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext()
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { currentLayout } = useLayout();

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      // setLoading(true);
      try {
        if (!register) {
          throw new Error('JWTProvider is required for this form.');
        }

        console.log('values', values);
        // await register(values.email, values.password, undefined, undefined, values.confirmpassword);
        // navigate(from, { replace: true });
      } catch (error) {
        console.error(error);
        setStatus('The sign up details are incorrect');
        setSubmitting(false);
        setLoading(false);
      }
    }
  });




  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">Confirm Sign up</h3>
          <div className="flex items-center justify-center font-medium">
            <span className="text-2sm text-gray-600 me-1.5">Already have an Account ?</span>
            <Link
              to={currentLayout?.name === 'auth-branded' ? '/auth/login' : '/auth/classic/login'}
              className="text-2sm link"
            >
              Sign In
            </Link>
          </div>
        </div>


        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Verify Code</label>
          <label className="input">
            <input
              placeholder="davidbalaban"
              type="text"
              autoComplete="off"
              {...formik.getFieldProps('code')}
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



        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Please wait...' : 'Sign UP'}
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

export { ConfirmSignup };
