import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";
export function Layout({ children, validate }) {
  return (
    <>
      <Navbar validate={validate} />

      <div id="mainBody" className=" dark:bg-slate-900 text-white h-screen p-5 md:p-10">

        <div className="p-4 sm:ml-64 mt-8">{children}</div>
      </div>
      <Toaster />
    </>
  );
}
