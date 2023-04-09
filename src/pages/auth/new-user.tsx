import Head from "next/head";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FaChevronDown, FaChevronUp , FaCheck } from 'react-icons/fa';
import { Formik, Form, Field, useField } from "formik";
import * as Yup from "yup";
import { 
  gymFrequencys, 
  gymTypes, 
  gymGoals,
} from "@/constants/gymInfo";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getServerAuthSession } from "@/server/auth";
import { type NextApiRequest, type NextApiResponse } from "next/types";

interface FormValues {
  name: string;
  weight: number;
  age: number;
  height: number;
  gymType: string;
  gymFrequency: string;
  goals: string[];
}

const NewUserSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  weight: Yup.number().min(10, "Too light!").max(636, "New world record, too heavy!"),
  age: Yup.number().min(0, "Too young!").max(150, "Too old!"),
  height: Yup.number().min(0, "Too short!").max(300, "Too tall!"),
  gymType: Yup.string().required("Required"),
  gymFrequency: Yup.string().required("Required"),
  goals: Yup.array().of(Yup.string()),
});

const InputListBoxComponent = (
  { options, value, defaultValue, name }: 
  { 
    options: string[],
    value: string, 
    defaultValue: string, 
    name: string 
  }) => {
  const helpers = useField(name)[2];

  return (
    <Listbox value={value} defaultValue={defaultValue} onChange={(value) => {
      helpers.setValue(value);
    }}>
      {({ open, value }) => (
        <div className="relative mt-2">
          <Listbox.Button className="text-black relative w-full cursor-pointer rounded-lg bg-white border-purple-1 border-2 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{value}</span>
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
              className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-72 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            >
              {options.map((type) => (
                <Listbox.Option
                  key={type}
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
                        {type}
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

const ChoiceListBoxComponent = (
  { options }: { options: string[] }):
  [string, JSX.Element] => {
    const [selected, setSelected] = useState<string>(options[0] ?? '');

    const component = (
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <div className="relative w-14 ml-1 flex">
            <Listbox.Button className="flex-1 flex items-center justify-center">
              <span className="text-gray-800">{selected}</span>
              <FaChevronDown className="h-3 w-3 mt-1 mx-1 text-gray-800" />
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
                className="absolute top-full z-10 mt-1 bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {options.map((option) => (
                  <Listbox.Option
                    key={option}
                    className={({ active }) =>
                      `${
                        active ? "text-white bg-purple-1" : "text-gray-900"
                      }
                            cursor-pointer select-none relative py-2 pl-10 pr-4`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`${
                            selected ? "font-medium" : "font-normal"
                          } block truncate`}
                        >
                          {option}
                        </span>
                        {selected ? (
                          <span
                            className={`${
                              active ? "text-white" : "text-purple-1"
                            }
                                  absolute inset-y-0 left-0 flex items-center pl-3`}
                          >
                            <FaCheck className="h-3 w-3" aria-hidden="true" />
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

    return [selected, component];
};

const CheckboxComponent = ({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: string;
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <label className="cursor-pointer flex items-center mt-2 bg-white py-2 px-5 rounded-xl border-purple-2 border-2">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
        className="mr-2 rounded-sm text-purple-2 focus:ring-purple-2 border-purple-4"
      />
      <span className="text-black text-sm">{label}</span>
    </label>
  );
};

const NewUser = () => {
  const newUser = api.user.newUser.useMutation();
  const router = useRouter();

  const initialValues: FormValues = {
    name: "",
    weight: 0,
    age: 0,
    height: 0,
    gymType: gymTypes[0] ?? "",
    gymFrequency: gymFrequencys[0] ?? "",
    goals: [],
  };

  const [weightQuanity, WeightChoiceComponent] = ChoiceListBoxComponent({
    options: ["kg", "lbs"],
  });

  const [heightQuanity, HeightChoiceComponent] = ChoiceListBoxComponent({
    options: ["cm", "in"],
  });

  const submit = async (values: FormValues) => {
    const toastId = toast.loading("Creating User...", {
      autoClose: false,
      position: "bottom-left",
      closeOnClick: false,
      pauseOnHover: false,
      hideProgressBar: true,
      draggable: false,     
    });

    try {
      await newUser.mutateAsync({
        name: values.name,
        weight: values.weight,
        age: values.age,
        height: values.height,
        workoutType: values.gymType,
        gymFrequency: values.gymFrequency,
        goals: values.goals,
        heigthQuantifier: heightQuanity,
        weightQuantifier: weightQuanity,
      });

      toast.update(toastId, {
        render: "User Updated!",
        type: 'success',
        autoClose: 2000,
        position: "bottom-left",
        closeOnClick: true,
        pauseOnHover: true,
        isLoading: false,
      });

      await router.push("/");
    } catch (e) {
      console.error(e);

      toast.update(toastId, {
        render: "Error Updating User!",
        type: toast.TYPE.ERROR,
        autoClose: 2000,
        position: "bottom-left",
        closeOnClick: true,
        isLoading: false,
      });
    }
  };

  return (
    <>
      <Head>
        <title>New User</title>
      </Head>
      <div className="min-h-screen min-w-[400px] bg-purple-9 flex justify-center">
        <div className="flex flex-col my-16 mx-8">
          <div>
            <h1 className="font-semibold text-4xl">Welcome to Workout Saver!</h1>
            <p className="mt-2 font-semibold text-purple-1">To get started you need to set up your user account.</p>
          </div>
          <Formik
            initialValues={initialValues}
            onSubmit={submit}
            validationSchema={NewUserSchema}
          >
            {({ values }) => (
              <Form className="flex flex-col relative">
                <div className="flex flex-col mt-10">
                  <label htmlFor="name" className="text-xl">What&apos;s your name?</label>
                  <Field
                    className="text-black text-sm mt-2 bg-white rounded-lg border-purple-1 border-2 pl-3 py-2"
                    placeholder="Zyzz"
                    name="name"
                    type="text"
                  />
                </div>
                <div className="flex mt-10 justify-between">
                  <div className="flex flex-col items-center">
                    <label htmlFor="age" className="text-xl">Age</label>
                    <Field
                      className="min-w-[100px] text-center text-black text-sm mt-2 bg-white rounded-lg border-purple-1 border-2"
                      placeholder="0"
                      name="age"
                      min="0"
                      max="100"
                      type="number"
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label htmlFor="weight" className="text-xl">Weight</label>
                    <div className="mt-2 relative">
                      <Field 
                        className="text-center text-black bg-white rounded-lg border-purple-1 border-2 text-sm py-2 pr-16"
                        placeholder="0"
                        name="weight"
                        min="0"
                        max="636"
                        type="number"
                      />
                      <div className="absolute right-0 top-0 bottom-0 border-l-2 border-gray-300/90 my-1 flex flex-col justify-center">
                        {WeightChoiceComponent}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <label htmlFor="height" className="text-xl">Height</label>
                    <div className="mt-2 relative">
                      <Field 
                        className="text-center text-black bg-white rounded-lg border-purple-1 border-2 text-sm py-2 pr-16"
                        placeholder="0"
                        name="height"
                        min="0"
                        max="300"
                        type="number"
                      />
                      <div className="absolute right-0 top-0 bottom-0 border-l-2 border-gray-300/90 my-1 flex flex-col justify-center">
                        {HeightChoiceComponent}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex flex-col">
                  <h1 className="text-xl">How often do you visit the gym?</h1>
                  <InputListBoxComponent options={gymFrequencys} name="gymFrequency" defaultValue={gymFrequencys[0] ?? "Error"} value={values.gymFrequency} />
                </div>
                <div className="mt-10 flex flex-col">
                  <h1 className="text-xl">What type of workouts do you perform?</h1>
                  <InputListBoxComponent options={gymTypes} name="gymType" defaultValue={gymTypes[0] ?? "Error"} value={values.gymType} />
                </div>
                <div className="mt-10 flex flex-col">
                  <h1 className="text-xl">What are your overall goals?</h1>
                  {gymGoals.map((goal) => (
                    <CheckboxComponent key={goal} label={goal} name="goals" value={goal} />
                  ))}
                </div>
                <button className="mt-20 bg-purple-2 text-white rounded-lg py-2 font-semibold" type="submit">Save</button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context: {
  req: NextApiRequest,
  res: NextApiResponse
}) {
  const session = await getServerAuthSession(context);

  console.log("new-user, getServerSideProps, session: ", session);

  if (!session?.user || !session.user.newUser) {
    console.log("Redirecting to /")
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default NewUser;