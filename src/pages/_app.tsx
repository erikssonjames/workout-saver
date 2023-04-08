import { type AppType } from "next/app";
import { type Session } from "next-auth";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from "next-auth/react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { api } from "@/utils/api";

import "@/styles/globals.css";

const plus_jakarta_sans = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <style jsx global>
        {`:root {
            --jakarta-font: ${plus_jakarta_sans.style.fontFamily};
          }`}
      </style>
      <Component {...pageProps} />
      <ToastContainer />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
