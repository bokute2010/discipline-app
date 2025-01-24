import { KeenIcon } from '@/components';
import { MenuItem, MenuLink, MenuSub, MenuTitle, MenuSeparator, MenuIcon } from '@/components/menu';
import { ChangeEvent, Fragment } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { useSettings } from '@/providers/SettingsProvider';
import { useAuthContext } from '@/auth';

const DropdownUser = () => {
  const { settings, storeSettings } = useSettings();
  const { logout, currentUser } = useAuthContext();

  const handleThemeMode = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('checked:' + event.target.checked);
    const newMode = event.target.checked ? 'dark' : 'light';

    storeSettings({
      mode: newMode
    });
  };

  const buildHeader = () => {
    return (
      <div className="flex items-center justify-between px-5 py-1.5 gap-1.5">
        <Link to={'/account/home/user-profile'} className="flex items-center gap-2 cursor-pointer">
          <img
            className="size-9 rounded-full border-2 border-success"
            src={currentUser?.avatar_url || toAbsoluteUrl('/media/avatars/blank.png')}
            alt=""
          />
          <div className="flex flex-col gap-1.5 pe-5">
            <p className="text-sm text-gray-800 hover:text-primary font-semibold leading-none">
              {currentUser?.username || currentUser?.full_name}
            </p>
          </div>
        </Link>
      </div>
    );
  };

  const buildMenu = () => {
    return (
      <Fragment>
        <MenuSeparator />
        <div className="flex flex-col">
          <MenuItem>
            <MenuLink path="/account/home/user-profile">
              <MenuIcon>
                <KeenIcon icon="profile-circle" />
              </MenuIcon>
              <MenuTitle>Trang cá nhân</MenuTitle>
            </MenuLink>
          </MenuItem>

          <MenuSeparator />
        </div>
      </Fragment>
    );
  };
  ``;

  const buildFooter = () => {
    return (
      <div className="flex flex-col">
        <div className="menu-item mb-0.5">
          <div className="menu-link">
            <span className="menu-icon">
              <KeenIcon icon="moon" />
            </span>
            <span className="menu-title">Chế độ nền tối</span>
            <label className="switch switch-sm">
              <input
                name="theme"
                type="checkbox"
                checked={settings.mode === 'dark'}
                onChange={handleThemeMode}
                value="1"
              />
            </label>
          </div>
        </div>

        <div className="menu-item px-4 py-1.5">
          <a onClick={logout} className="btn btn-sm btn-light justify-center">
            Đăng xuất
          </a>
        </div>
      </div>
    );
  };

  return (
    <MenuSub
      className="menu-default light:border-gray-300 w-[200px] md:w-[250px]"
      rootClassName="p-0"
    >
      {buildHeader()}
      {buildMenu()}
      {buildFooter()}
    </MenuSub>
  );
};

export { DropdownUser };
