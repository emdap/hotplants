import AppRoutes from "AppRoutes";
import DarkModeToggle from "components/DarkModeToggle";
import HeaderMenu from "designSystem/HeaderMenu";

const App = () => {
  return (
    <>
      <div className="fixed -z-10 h-dvh w-[calc(100dvw+20px)]  pretty-background"></div>

      <HeaderMenu>
        <DarkModeToggle />
      </HeaderMenu>
      <AppRoutes />
    </>
  );
};

export default App;
