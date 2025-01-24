import { Link, Outlet } from 'react-router-dom';
import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/utils';
import useBodyClasses from '@/hooks/useBodyClasses';
import { AuthBrandedLayoutProvider } from './AuthBrandedLayoutProvider';
import { images } from '@/theme/image';

const Layout = () => {
  // Applying body classes to manage the background color in dark mode
  useBodyClasses('dark:bg-coal-500');

  return (
    <Fragment>
      <style>
        {`
          .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/img_auth_bg.svg')}');
          }
          .dark .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/img_auth_bg.svg')}');
          }
          @media (max-width: 1024px) {
            .branded-bg {
              background-image: none;
            }
          }
        `}
      </style>

      <div className="grid lg:grid-cols-2 grow">
        <div className="flex justify-center items-center p-8 lg:p-10 order-2 lg:order-1">
          <Outlet />
        </div>

        <div className="lg:rounded-xl lg:border lg:border-gray-200 lg:m-5 order-1 lg:order-2 bg-top xxl:bg-center xl:bg-cover bg-no-repeat branded-bg">
          <div className="flex flex-col p-8 lg:p-16 gap-4 h-full">
            {/* <Link to="/">
              <img
                src={toAbsoluteUrl('/media/app/default-logo.svg')}
                className="h-[28px] max-w-none"
                alt=""
              />
            </Link>

            <div className="flex flex-col gap-3 justify-between h-full">
              <h3 className="text-2xl font-semibold text-gray-900">
                Giải pháp AI tiên phong cho lĩnh vực
                <br /> kiểm toán chuyên nghiệp
              </h3>

              <img src={images.feedback} alt="" />
            </div> */}

            
          </div>
        </div>
      </div>
    </Fragment>
  );
};

// AuthBrandedLayout component that wraps the Layout component with AuthBrandedLayoutProvider
const AuthBrandedLayout = () => (
  <AuthBrandedLayoutProvider>
    <Layout />
  </AuthBrandedLayoutProvider>
);

export { AuthBrandedLayout };
