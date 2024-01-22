import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Photography from './Photography';
import About from './About';
import Cv from './Cv';
// import More from './More';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
reportWebVitals();
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/photography",
    element: <Photography/>,
  },
  // {
  //   path: "/more",
  //   element: <More/>,
  // },
  {
    path: "/about",
    element: <About/>,
  },
  {
    path: "/Cv",
    element: <Cv/>,
  }
]);
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();