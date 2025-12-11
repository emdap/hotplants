import App from "App";
import Login from "pages/auth/Login";
import Logout from "pages/auth/Logout";
import Signup from "pages/auth/Signup";
import PlantSearch from "pages/PlantSearch";
import { Route, Routes } from "react-router";

const AppRoutes = () => (
  <Routes>
    <Route element={<App />}>
      <Route index element={<PlantSearch />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logout" element={<Logout />} />
    </Route>
  </Routes>
);

export default AppRoutes;
