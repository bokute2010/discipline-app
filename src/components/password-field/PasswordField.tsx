import { IInputProps, InputField } from '../input-field';
import { KeenIcon } from '../keenicons';

interface PasswordFieldProps {
  shouldShowPassword: boolean;
  onToggleShouldShowPassword: () => void;
}

/**
 * A password field with a toggle button to show/hide password.
 *
 * @prop {boolean} shouldShowPassword - Whether the password should be shown.
 * @prop {() => void} onToggleShouldShowPassword - Called when the toggle button is clicked.
 */
const PasswordField = ({
  shouldShowPassword,
  onToggleShouldShowPassword,
  ...props
}: PasswordFieldProps & IInputProps) => (
  <InputField
    type={shouldShowPassword ? 'text' : 'password'}
    {...props}
    actionComponent={
      <button className="btn btn-icon" onClick={onToggleShouldShowPassword}>
        <KeenIcon icon={shouldShowPassword ? 'eye-slash' : 'eye'} className="text-gray-500" />
      </button>
    }
  />
);

export { PasswordField };
