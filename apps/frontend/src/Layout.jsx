import React from "react";
import { Outlet } from "react-router-dom";
import Headbar from "./components/Headbar";
import Footer from "./components/Footer";

function Layout() {
  return (
    <>
      <main>
        <Headbar />
        <Outlet />
        <Footer />
      </main>
    </>
  );
}

export default Layout;
