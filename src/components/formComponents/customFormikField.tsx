import { type FC } from 'react';
import { type FieldProps } from 'formik';

interface CustomFormikFieldProps {
  type?: string;
  placeholder?: string;
}

export const CustomFormikField: FC<CustomFormikFieldProps & FieldProps> = ({
  field,
  form: { touched, errors },
  type = 'text',
  placeholder = '',
}) => {
  const isError = touched[field.name] && errors[field.name];

  return (
    <div>
      <label htmlFor={field.name}>{field.name}</label>
      <input type={type} placeholder={placeholder} {...field} />
      {isError && <div>{errors[field.name] as string}</div>}
    </div>
  )
}
