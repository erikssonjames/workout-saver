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

interface FormValues {
  email: string;
  password: string;
}

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
        <h1>Welcome back!</h1>
        <p>Sign in to your account</p>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={submit}
        >
          {() => (
            <Form>
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
              <button type="submit">Sign In</button>
            </Form>
          )}
        </Formik>
      </div>
      <div>
        <div /> {/* Line */}
        <p>or</p>
        <div /> {/* Line */}
      </div>
      <div>
        {"github" in providers && (
          <button
            onClick={() => pressedProvider("github")}
          >
            Sign in with Github <RiGithubLine />
          </button>
        )}
        {"google" in providers && (
          <button
            onClick={() => pressedProvider("google")}
          >
            Sign in with Google <RiGithubLine />
          </button>
        )}
        {"facebook" in providers && (
          <button
            onClick={() => pressedProvider("facebook")}
          >
            Sign in with Facebook <RiGithubLine />
          </button>
        )}
      </div>
      <div>
        <p>
          Don&apos;t have an account? <Link href="/auth/register">Sign Up Now</Link>
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
