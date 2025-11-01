import AppRoutes from "AppRoutes";
import DarkModeToggle from "components/DarkModeToggle";

const App = () => {
  return (
    <div
      className={`h-dvh bg-gradient-to-tr animate-background-shift
        from-cyan-500/80 via-teal-500/80 to-purple-500/80 
        dark:from-cyan-800/60 dark:via-teal-800/60 dark:to-purple-600/60 
        `}
      style={{ backgroundSize: "800%" }}
    >
      <DarkModeToggle />
      <AppRoutes />
    </div>
  );
};

export default App;
