import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Photography from "./Photography";
import About from "./About";
import Cv from "./Cv";
// import More from './More';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/photography",
    element: <Photography />,
  },
  // {
  //   path: "/more",
  //   element: <More/>,
  // },
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
    <RouterProvider router={router} />
  </React.StrictMode>,
);

