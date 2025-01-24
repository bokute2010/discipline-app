import { Link, useNavigate } from 'react-router-dom';

import { toAbsoluteUrl } from '@/utils';
import { useLayout } from '@/providers';
import { useAuthContext } from '@/auth/useAuthContext';

const renderResetPasswordMessage = (username: string) => {
  const isEmail = username.includes('@');
  return (
    <div className="text-2sm text-center text-gray-700 mb-7.5">
      {!isEmail ? (
        <>
          Hãy kiểm tra mã gửi đến tài khoản{' '}
          <a href="#" className="text-2sm text-gray-800 font-medium hover:text-primary-active">
            {username}
          </a>
        </>
      ) : (
        <>
          Hãy kiểm tra email của bạn{' '}
          <a href="#" className="text-2sm text-gray-800 font-medium hover:text-primary-active">
            {username || 'N/A'}
          </a>
        </>
      )}
      <br />
      để đặt lại mật khẩu của bạn. Cảm ơn
    </div>
  );
};


const ResetPasswordCheckEmail = () => {
  const { currentLayout } = useLayout();
  const navigate = useNavigate();
  const { resendCodeResetPassword } = useAuthContext();

  const email = localStorage.getItem('account_reset_pw');
  const handleResend = async () => {
    if (!resendCodeResetPassword) {
      throw new Error('JWTProvider is required for this form.');
    }
    const username = localStorage.getItem('account_reset_pw');
    if (!username) {
      navigate('/auth/login', { replace: true });
      throw new Error('Username is required');
    }
    await resendCodeResetPassword(username);
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

        <h3 className="text-lg font-medium text-gray-900 text-center mb-3">Kiểm tra email của bạn</h3>

        {renderResetPasswordMessage(email || '')}

        <div className="flex justify-center mb-5">
          <Link to={'/auth/reset-password/change'} className="btn btn-primary flex justify-center">
            Tiếp tục
          </Link>
        </div>

        <div className="flex justify-center mb-5">
          <Link
            to={
              currentLayout?.name === 'auth-branded'
                ? '/auth/reset-password/changed'
                : '/auth/classic/reset-password/changed'
            }
            className="text-xs font-medium link"
          >
            Tôi sẽ làm sau
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1">
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-gray-600">Không nhận được email?</span>
            <button onClick={handleResend} type="button" className="text-xs font-medium link">
              Gửi lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ResetPasswordCheckEmail };
