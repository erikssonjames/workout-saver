import { type NextApiRequest, type NextApiResponse } from "next";
import { useSession,  } from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";

const WelcomeComponent = () => {
  return (
    <div className="h-screen bg-[#0d1117]">
      <div className="h-full w-full flex justify-center items-center radial-background1">
        {/* <h1 className="text-8xl font-extrabold tracking-tight text-white-0-8">Your Workout Saver</h1> */}
        <div>

        </div>
      </div>
    </div>
  )
}

const UserComponent = () => {
  const session = useSession();

  return (
    <div className="h-screen bg-purple-8 flex justify-center items-center">
      <h1 className="text-white">{session.data?.user?.name ?? "No name found"}</h1>
    </div>
  )
}

const Home = ({ loggedIn }: { loggedIn: boolean }) => {
  console.log("index, Home, loggedIn = ", loggedIn);

  if(!loggedIn) {
    return <WelcomeComponent />
  }

  return <UserComponent />
};

export async function getServerSideProps(context: {
  req: NextApiRequest,
  res: NextApiResponse
}) {
  const session = await getServerAuthSession(context);

  if(session?.user && session.user?.newUser) {
    // Temp fix for redirecting to new-user page -- Might be bug
    const destination = (context.req.headers.referer != null ? "" : "auth/") + "new-user";

    return {
      redirect: {
        destination: destination,
        permanent: false,
      },
    }
  }

  return {
    props: {
      loggedIn: !!session,
    }
  }
}

export default Home;
