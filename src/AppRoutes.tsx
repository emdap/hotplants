import PlantSearch from "pages/PlantSearch";
import { Route, Routes } from "react-router";

const AppRoutes = () => (
  <Routes>
    <Route index element={<PlantSearch />} />
  </Routes>
);

export default AppRoutes;
