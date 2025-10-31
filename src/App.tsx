import AppRoutes from "AppRoutes";
import DarkModeToggle from "components/DarkModeToggle";

const App = () => {
  return (
    <div
      className="h-dvh bg-gradient-to-tr from-cyan-800/60 via-teal-800/60 to-purple-600/60 animate-background-shift"
      style={{ backgroundSize: "800%" }}
    >
      <DarkModeToggle />
      <AppRoutes />
    </div>
  );
};

export default App;
