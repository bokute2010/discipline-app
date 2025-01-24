import { Link, useNavigate } from 'react-router-dom';

import { toAbsoluteUrl } from '@/utils';
import { useAuthContext } from '@/auth/useAuthContext';
const getUsername = () => localStorage.getItem('signup_username');
const getEmail = () => localStorage.getItem('signup_email');
const CheckEmail = () => {
  const { resendCodeConfirmRegister } = useAuthContext();
  const navigate = useNavigate();
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
  return (
    <div className="card max-w-[440px] w-full">
      <div className="card-body p-10">
        <div className="flex justify-center py-10">
          <img
            src={toAbsoluteUrl('/media/illustrations/30.svg')}
            className="dark:hidden max-h-[130px]"
            alt=""
          />
          <img
            src={toAbsoluteUrl('/media/illustrations/30-dark.svg')}
            className="light:hidden max-h-[130px]"
            alt=""
          />
        </div>

        <h3 className="text-lg font-medium text-gray-900 text-center mb-3">Kiểm tra email</h3>
        <div className="text-2sm text-center text-gray-700 mb-7.5">
          Vui lòng kiểm tra email của bạn tại &nbsp;
          <a href="#" className="text-2sm text-gray-900 font-medium hover:text-primary-active">
            {getEmail() || 'N/A'}
          </a>
          <br />
          để xác nhận tài khoản.
        </div>

        <div className="flex justify-center mb-5">
          <Link to={'/auth/confirm-signup'} className="btn btn-primary flex justify-center">
            Tiếp tục
          </Link>
        </div>

        <div className="flex justify-center mb-5">
          <Link to={'/'} className="text-xs font-medium link">
            Tôi sẽ xác nhận sau
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1">
          <span className="text-xs text-gray-700">Không nhận được email?</span>
          <button onClick={handleResend} type="button" className="text-xs font-medium link">
            Gửi lại mã xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export { CheckEmail };
