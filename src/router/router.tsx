import About from "@/pages/about";
import All from "@/pages/all";
import Find from "@/pages/find";
import Layout from "@/pages/layout";
import SuggestBook from "@/pages/suggestBook";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Find />,
      },
      {
        path: "/all",
        element: <All />,
      },
      {
        path: "/books/:bookId",
        element: <About />,
      },
      {
        path: "/suggestBook",
        element: <SuggestBook />,
      },
    ],
  },
]);
