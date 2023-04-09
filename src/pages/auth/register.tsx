import SignLayout from "@/components/layouts/signLayout";
import Head from "next/head";
import Link from "next/link";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { CustomFormikField } from "@/components/formComponents/customFormikField";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const signUp = api.user.signUp.useMutation();
  const router = useRouter();

  const submit = async (values: FormValues) => {
    const id = toast.info("Creating account...", 
      {
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        position: "bottom-left",
      });

    try {
      await signUp.mutateAsync(values);
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      toast.update(id, {
        render: "Successfully registered",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000,
      });

      await router.push("/auth/new-user");
    } catch(e) {
      console.log(e);
      toast.update(id, {
        render: "Something went wrong",
        type: toast.TYPE.ERROR,
        autoClose: 3000,
      });
    }
  };

  return (
    <SignLayout>
      <Head>
        <title>Register</title>
      </Head>
      <div className="flex flex-col justify-center mx-4">
        <h1 className="text-2xl font-bold">Create a new account</h1>

        <Formik
          initialValues={{ email: "", password: "", confirmPassword: "" }}
          validationSchema={RegisterSchema}
          onSubmit={submit}
        >
          {() => (
            <Form className="flex flex-col mt-4">
              <Field
                name="email"
                label="Email"
                type="email"
                placeholder="Email"
                margin="mt-4"
                component={CustomFormikField}
              />
              
              <Field
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                margin="mt-4"
                component={CustomFormikField}
              />
              
              <Field
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                margin="mt-4"
                component={CustomFormikField}
              />

              <button
                type="submit"
                className="mt-8 px-4 py-2 text-white bg-purple-3 text-lg font-semibold hover:shadow-[0_0_6px_2px_rgba(157,78,221,0.56)] focus:outline-none focus:bg-purple-4"
              >
                Register
              </button>
            </Form>
          )}
        </Formik>


        <p className="text-center mt-10 text-gray-500">Already have an account? <Link href="/auth/login" className="text-white underline">Login</Link></p>
      </div>
    </SignLayout>
  )
}

export default Register;