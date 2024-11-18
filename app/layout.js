import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import LeftSideNavBar from "@/components/LeftSideNavBar";
import { GlobalProvider } from "@/context/GlobalContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "VinFutures",
  description: "One-stop Wine NFTs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProvider>
            <div className="flex h-screen bg-white">
              <LeftSideNavBar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                {children}
              </div>
            </div>
        </GlobalProvider>
      </body>
    </html>
  );
}
