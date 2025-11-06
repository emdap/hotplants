import PlantFilters from "components/plantSearchFilters/PlantFilters";
import PlantSearch from "pages/PlantSearch";
import { Route, Routes } from "react-router";

const AppRoutes = () => (
  <Routes>
    <Route index element={<PlantSearch />} />
    <Route path="demo" element={<PlantFilters />} />
  </Routes>
);

export default AppRoutes;
