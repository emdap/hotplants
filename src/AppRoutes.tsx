import LocationMap from "components/LocationMap";
import PlantSearch from "pages/PlantSearch";
import { Route, Routes } from "react-router";

const AppRoutes = () => (
  <Routes>
    <Route index element={<PlantSearch />} />
    <Route path="demo" element={<LocationMap />} />
  </Routes>
);

export default AppRoutes;
