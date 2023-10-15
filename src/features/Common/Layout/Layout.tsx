import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loader from "../Loader/Loader";
import Header from "../Header/Header";
import { LayoutMain } from "./Layout.styled";

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <LayoutMain>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </LayoutMain>
    </>
  );
};

export default Layout;
