import DarkModeToggle from "components/DarkModeToggle";
import HeaderMenu from "designSystem/HeaderMenu";
import { Outlet } from "react-router";

const App = () => {
  return (
    <>
      <div className="fixed -z-10 h-dvh w-[calc(100dvw+20px)] pretty-background"></div>

      <HeaderMenu>
        <DarkModeToggle />
      </HeaderMenu>
      <Outlet />
    </>
  );
};

export default App;
