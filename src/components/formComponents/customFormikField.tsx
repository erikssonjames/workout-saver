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
    <div className="relative flex flex-col">
      <label className="absolute capitalize text-gray-100 font-medium" htmlFor={field.name}>{field.name}</label>
      <input className={`bg-purple-7 border-purple-6 border-2 rounded-md py-2 pl-3 mt-7 ${isError ? "bg-red-600 border-red-800" : ""}`} type={type} placeholder={placeholder} {...field} />
      {true && <div className="text-xs font-bold text-red-600 mt-1">{errors[field.name] as string}Error</div>}
    </div>
  )
}
