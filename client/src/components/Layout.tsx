import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <div className="App">
      <Header />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};
