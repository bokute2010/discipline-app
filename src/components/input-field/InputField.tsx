import { HTMLProps, ReactNode } from 'react';
import clsx from 'clsx';

type IInputProps = {
  touched?: boolean;
  errors?: string;
  labelComponent?: ReactNode | string;
  actionComponent?: ReactNode;
} & HTMLProps<HTMLInputElement>;

/**
 * A styled input field component with support for form validation.
 *
 * @prop {string} type - The type of the input field. Defaults to `'text'`.
 * @prop {ReactNode|string} labelComponent - The label component to render
 *   above the input field.
 * @prop {string} name - The name of the input field.
 * @prop {string} defaultValue - The default value of the input field.
 * @prop {string} placeholder - The placeholder text for the input field.
 * @prop {string} className - Additional CSS class names to apply to the
 *   input element.
 * @prop {function} onChange - The change handler for the input field.
 * @prop {boolean} touched - Whether the input has been touched.
 * @prop {string} errors - The error message to display if the input is invalid.
 * @prop {ReactNode} actionComponent - The component to render on the right-hand
 *   side of the input field.
 * @prop {...HTMLProps<HTMLInputElement>} - Additional props to pass to the
 *   underlying `input` element.
 */
const InputField = ({
  type = 'text',
  labelComponent,
  name,
  defaultValue,
  placeholder,
  className,
  onChange,
  touched,
  errors,
  actionComponent,
  ...props
}: IInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {labelComponent}
      <label className="input">
        <input
          type={type}
          className={clsx('form-control', { 'is-invalid': touched && errors }, className)}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          {...props}
        />
        {actionComponent}
      </label>
      {touched && errors != undefined && (
        <span role="alert" className="text-danger text-xs mt-1">
          {errors}
        </span>
      )}
    </div>
  );
};

export { InputField, type IInputProps };
