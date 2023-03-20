import type { InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";
import SignLayout from "@/components/layouts/signLayout";
import Link from "next/link";
import Head from "next/head";
import { Formik, Form, Field } from 'formik';
import { CustomFormikField } from "@/components/formComponents/customFormikField";
import { RiGithubLine } from 'react-icons/ri';
import { BsGoogle, BsFacebook } from 'react-icons/bs';
import * as Yup from 'yup';

interface FormValues {
  email: string;
  password: string;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Must be atleast 8 characters long').required('Required')
});

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const submit = (values: FormValues) => {
    console.log(values);
  }

  const pressedProvider = async (id: string) => {
    await signIn(id);
  }

  return (
    <SignLayout>
      <Head>
        <title>Login</title>
      </Head>
      <div>
        <h1 className="text-4xl" >Welcome back!</h1>
        <p className="text-xs text-gray-400 font-semibold">Sign in to your account</p>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={submit}
          validationSchema={SignInSchema}
        >
          {() => (
            <Form className="flex flex-col">
              <Field
                placeholder="zyzz@mirin.com"
                name="email"
                type="email"
                component={CustomFormikField}
              />
              <Field  
                placeholder="••••••••"
                name="password"
                type="password"
                component={CustomFormikField}
              />
              <button className="mt-3 bg-purple-3 py-2" type="submit">Sign In</button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="my-7 flex items-center">
        <div className="h-0.5 bg-purple-2 flex-1" />
        <p className="mx-2" >or</p>
        <div className="h-0.5 bg-purple-2 flex-1" />
      </div>
      <div className="flex flex-col" >
        {"github" in providers && (
          <button
            className="mb-4 flex items-center justify-center bg-gray-600 py-2 font-semibold"
            onClick={() => pressedProvider("github")}
          >
            Sign in with Github <RiGithubLine className="ml-2" />
          </button>
        )}
        {"google" in providers && (
          <button
            className="mb-4 flex items-center justify-center bg-orange-400 py-2 font-semibold"
            onClick={() => pressedProvider("google")}
          >
            Sign in with Google <BsGoogle className="ml-2" />
          </button>
        )}
        {"facebook" in providers && (
          <button
            className="mb-4 flex items-center justify-center bg-blue-600 py-2 font-semibold"
            onClick={() => pressedProvider("facebook")}
          >
            Sign in with Facebook <BsFacebook className="ml-2" />
          </button>
        )}
      </div>
      <div className="mt-3 flex justify-center">
        <p className="text-gray-500">
          Don&apos;t have an account? <Link className="text-white underline" href="/auth/register">Sign Up Now</Link>
        </p>
      </div>
    </SignLayout>
  )
}

export async function getServerSideProps(context: {
  req: NextApiRequest,
  res: NextApiResponse
}) {
  const session = await getServerAuthSession(context);

  if(session) {
    return { redirect: { destination: '/' } };
  }

  const providers = await getProviders();

  return {
    props: {
      providers: providers ?? [],
    }
  }
}
