import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Layout } from "./features/Common";

const TasksComponent = lazy(() => import("./features/Tasks/TasksComponent"));
const Posts = lazy(() => import("./features/Posts/Posts"));
const Home = lazy(() => import("./features/Home/Home"));

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/posts",
          element: <Posts />,
        },
        {
          path: "/tasks",
          element: <TasksComponent />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
