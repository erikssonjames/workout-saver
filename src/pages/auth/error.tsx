import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Error = () => {
  const serachParams = useSearchParams();
  const error = serachParams.get("error");

  return (
    <>
      <Head>
        <title>Error</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen bg-purple-8">
        <h1 className="text-4xl max-w-md font-semibold" >{error}</h1>
        <div className="h-1 w-80 my-5 rounded-lg bg-purple-3" />
        <p className="text-sm mb-2 text-gray-500 font-semibold">Try again later, or go back to the login page now.</p>
        <Link className="py-1 px-3 rounded-md mt-5 bg-purple-3 hover:shadow-[0_0_6px_2px_rgba(157,78,221,0.56)]" href="/auth/login">Login</Link>
      </div>

    </>
  )
};

export default Error;
