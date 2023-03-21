import { type FC } from 'react';
import { type FieldProps } from 'formik';

interface CustomFormikFieldProps {
  type?: string;
  placeholder?: string;
  margin?: string;
}

export const CustomFormikField: FC<CustomFormikFieldProps & FieldProps> = ({
  field,
  form: { touched, errors },
  type = 'text',
  placeholder = '',
  margin = '',
}) => {
  const isError = touched[field.name] && errors[field.name];

  return (
    <div className={"relative flex flex-col " + margin}>
      <label className="absolute capitalize text-gray-100 font-medium" htmlFor={field.name}>{field.name}</label>
      <input 
        className={`border-2 rounded-md h-12 pl-3 mt-7 outline-none ${isError ? "bg-red-500 border-red-700 placeholder:text-gray-300 font-semibold focus:border-white" : "focus:border-purple-4 bg-purple-7 border-purple-6"} ${type === "password" ? "text-base pb-1" : "text-sm"}`} 
        type={type} placeholder={placeholder} {...field} />
      {isError && <div className="text-xs font-bold text-red-600 mt-1">{errors[field.name] as string}</div>}
    </div>
  )
}
