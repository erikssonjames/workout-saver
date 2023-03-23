import Head from "next/head";
import { Listbox, Transition } from "@headlessui/react";
import { useState, Fragment } from 'react';
import { FaChevronDown, FaChevronUp , FaCheck } from 'react-icons/fa';
import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";

const gymTypes = [
  { id: 1, type: "First timer!" },
  { id: 2, type: "Once a week, or less." },
  { id: 3, type: "Three times a week" },
  { id: 4, type: "Twice a week" },
  { id: 5, type: "Between four and six times a week." },
  { id: 6, type: "I practically live at the gym!" },
];

interface GymTypeObject {
  id: number;
  type: string;
}

interface FormValues {
  name: string;
  gymType: GymTypeObject;
}

const gymTypeSchema: Yup.ObjectSchema<GymTypeObject> = Yup.object().shape({
  id: Yup.number().required("Required"),
  type: Yup.string().required("Required"),
});

const NewUserSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  gymType: gymTypeSchema,
});

const ListBoxComponent = (
  { value = { id: 1, type: "123" }, defaultValue  = { id: 1, type: "123" }, name }: 
  { value: GymTypeObject | undefined, defaultValue: GymTypeObject | undefined, name: string }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Listbox value={value} defaultValue={defaultValue} onChange={(value) => {
      helpers.setValue(value);
    }}>
      {({ open, value }) => (
        <div className="relative mt-2">
          <Listbox.Button className="text-black relative w-full cursor-pointer rounded-lg bg-white border-purple-1 border-2 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{value.type}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              {open ? (
                <FaChevronUp className="h-5 w-5 text-purple-1" />
              ) : (
                <FaChevronDown className="h-5 w-5 text-purple-1" />
              )}
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              static
              className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            >
              {gymTypes.map((type) => (
                <Listbox.Option
                  key={type.id}
                  className={({ active }) =>
                    `${
                      active ? "text-white bg-purple-1" : "text-gray-900"
                    }
                          cursor-pointer select-none relative py-2 pl-10 pr-4`
                  }
                  value={type}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? "font-medium" : "font-normal"
                        } block truncate`}
                      >
                        {type.type}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active ? "text-white" : "text-purple-1"
                          }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <FaCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};

const NewUser = () => {
  return (
    <>
      <Head>
        <title>New User</title>
      </Head>
      <div className="min-h-screen bg-purple-9 flex justify-center">
        <div className="flex flex-col mt-16">
          <div>
            <h1 className="font-semibold text-4xl">Welcome to Workout Saver!</h1>
            <p className="mt-2 font-semibold text-purple-1">To get started you need to set up your user account.</p>
          </div>
          <Formik
            initialValues={{ name: "", gymType: gymTypes[0] }}
            onSubmit={(values) => console.log(values)}
            validationSchema={NewUserSchema}
          >
            {({ values }) => (
              <Form className="flex flex-col mt-16">
                <label htmlFor="name" className="text-xl">What&apos;s your name?</label>
                <Field
                  className="text-black mt-2 bg-white rounded-lg border-purple-1 border-2 pl-3 py-2"
                  placeholder="Zyzz"
                  name="name"
                  type="text"
                />
                <div className="mt-10 flex flex-col">
                  <h1 className="text-xl">How often do you visit the gym?</h1>
                  <ListBoxComponent name="gymType" defaultValue={gymTypes[0]} value={values.gymType} />
                </div>
                <button className="mt-10 bg-purple-1 text-white rounded-lg py-2 font-semibold" type="submit">Submit</button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}

export default NewUser;