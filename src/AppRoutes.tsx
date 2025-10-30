import MapProvider from "components/interactiveMap/MapProvider";
import PlantSearch from "pages/PlantSearch";
import { Route, Routes } from "react-router";

const AppRoutes = () => (
  <Routes>
    <Route index element={<PlantSearch />} />
    <Route path="demo" element={<MapProvider />} />
  </Routes>
);

export default AppRoutes;
