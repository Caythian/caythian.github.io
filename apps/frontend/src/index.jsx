import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Blog from "./Blog";
import About from "./About";
import Cv from "./Cv";
import Headbar from "./Components/Headbar";
import Footer from "./Components/Footer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/Cv",
    element: <Cv />,
  },
]);
root.render(
  <React.StrictMode>
    <Headbar />
    <RouterProvider router={router} />
    <Footer />
  </React.StrictMode>,
);
