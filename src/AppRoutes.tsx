import App from "App";
import PlantSearch from "pages/PlantSearch";
import { Route, Routes } from "react-router";

const AppRoutes = () => (
  <Routes>
    <Route element={<App />}>
      <Route index element={<PlantSearch />} />
    </Route>
  </Routes>
);

export default AppRoutes;
