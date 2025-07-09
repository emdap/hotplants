import createClient from "openapi-fetch";
import DarkModeToggle from "./components/DarkModeToggle";
import type { paths } from "./schemas/gbif";

const App = () => {
  const client = createClient<paths>({ baseUrl: "https://api.gbif.org/v1/" });
  client.GET("/occurrence/search", {
    params: {
      query: {
        geometry: [
          "POLYGON((-124.48 32.53,-124.48 42.01,-114.13 42.01,-114.13 32.53,-124.48 32.53))",
        ],
        establishmentMeans: ["native"],
        limit: 10,
      },
    },
  });

  return (
    <>
      <DarkModeToggle />
      <div className=" text-black">hey</div>
    </>
  );
};

export default App;
