import { Outlet } from "react-router-dom";
import NavbarComp from "./navbar/navbar";
import { Suspense } from "react";

export default function Layout() {
  return (
    <>
      <NavbarComp /> {/*  performance optimization technique called code-splitting.  lets you display a fallback until its children have finished loading.*/}
      <Suspense fallback={<div className="page-container"><h1>Loading...</h1></div>}>
        <Outlet />
      </Suspense>
    </>
  );
}