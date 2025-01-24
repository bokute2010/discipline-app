import { InputField, KeenIcon } from '@/components';
import { useUserProfile } from '@/hooks';

import { CrudAvatarUpload } from '@/partials/crud';

const PersonalInfo = () => {
  const {
    currentUser,
    isEditingName,
    setIsEditingName,
    updateUserProfile,
    firstName,
    lastName,
    fullName,
    setFirstName,
    setLastName,
    setFullName
  } = useUserProfile();

  const saveUpdateName = () => {
    setFullName(`${firstName} ${lastName}`);
    setIsEditingName(false);

    if (!firstName || !lastName) return;
    if (firstName === currentUser.first_name && lastName === currentUser.last_name) return;

    updateUserProfile({ first_name: firstName, last_name: lastName });
  };

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">Thông tin cá nhân</h3>
      </div>
      <div className="card-table scrollable-x-auto pb-3">
        <table className="table align-middle text-sm text-gray-500">
          <tbody>
            <tr>
              <td className="py-2 min-w-28 text-gray-600 font-normal">Avatar</td>
              
              <td className="py-2 text-center">
                <div className="flex justify-center items-center">
                  <CrudAvatarUpload />
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">Tên</td>

              {isEditingName ? (
                <>
                  <td className="py-2 text-gray-800 font-normaltext-sm flex flex-col md:flex-row gap-4 px-0!">
                    <InputField
                      name="first_name"
                      placeholder="First Name"
                      defaultValue={firstName}
                      onChange={(e) => setFirstName(e.currentTarget.value)}
                    />
                    <InputField
                      name="last_name"
                      defaultValue={lastName}
                      onChange={(e) => setLastName(e.currentTarget.value)}
                    />
                  </td>
                  <td className="py-2 text-center">
                    <button
                      className="btn btn-sm btn-icon btn-clear btn-primary"
                      onClick={saveUpdateName}
                    >
                      <KeenIcon icon="check" />
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 text-gray-800 font-normaltext-sm">{fullName}</td>
                  <td className="py-2 text-center">
                    <button
                      className="btn btn-sm btn-icon btn-clear btn-primary"
                      onClick={() => setIsEditingName(true)}
                    >
                      <KeenIcon icon="notepad-edit" />
                    </button>
                  </td>
                </>
              )}
            </tr>
            {/* <tr>
              <td className="py-3 text-gray-600 font-normal">Availability</td>
              <td className="py-3 text-gray-800 font-normal">
                <span className="badge badge-sm badge-outline badge-success">Available now</span>
              </td>
              <td className="py-3 text-center">
                <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a>
              </td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">Birthday</td>
              <td className="py-3 text-gray-700 text-sm font-normal">28 May 1996</td>
              <td className="py-3 text-center">
                <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a>
              </td>
            </tr> */}
            {/* <tr>
              <td className="py-3 text-gray-600 font-normal">Gender</td>
              <td className="py-3 text-gray-700 text-sm font-normal">{currentUser.gender}</td>
              <td className="py-3 text-center">
                <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a>
              </td>
            </tr>
            <tr>
              <td className="py-3">Address</td>
              <td className="py-3 text-gray-700 text-2sm font-normal">
                {currentUser.city}, {currentUser.country}
              </td>
              <td className="py-3 text-center">
                <a href="#" className="btn btn-link btn-sm">
                  Add
                </a>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { PersonalInfo };
