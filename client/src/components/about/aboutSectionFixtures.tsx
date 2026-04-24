import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";
import { IconType } from "react-icons/lib";

export type AboutSectionConfig = {
  Icon?: IconType;
  title: string;
  content: ReactNode;
};

export const ABOUT_SECTIONS: AboutSectionConfig[] = [
  {
    title: "Hotplants in a nutshell",
    content: (
      <>
        <p>This is primarily a tool to find native plants in any area.</p>{" "}
        <p>
          Hotplants gets data from{" "}
          <a href="https://www.gbif.org">
            Global Biodiversity Information Facility (GBIF)
          </a>
          , which is an amazing resource for finding plant and animal data. GBIF
          provides an{" "}
          <a href="https://techdocs.gbif.org/en/openapi/v1/occurrence#/Searching%20occurrences/searchOccurrence">
            occurrence API
          </a>{" "}
          that can be queried with a location to find all records in that area.
          Hotplants takes occurrence data from GBIF and groups it by species,
          and then scrapes additional data from{" "}
          <a href="https://permapeople.org/">Permapeople.org</a> to paint a
          fuller picture of the plant.
        </p>
        <p>
          Data is stored in MongoDB and exposed through GraphQL, where it can be
          further filtered by the attributes scraped from Permapeople.
        </p>
        <p>
          In addition to browsing plants and animals, you can save plants you
          like by creating an account and adding them to your garden.
        </p>
        <div>
          Github repository links:
          <ul className="list-disc list-inside text-primary">
            <li>
              <a href="https://github.com/emdap/hotplants">
                Frontend and auth server
              </a>
            </li>
            <li>
              <a href="https://github.com/emdap/hotplants-server">
                Backend server
              </a>
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    title: "Iterating through data",
    content: (
      <>
        <p>
          Hotplants gets 300 occurrence results from GBIF at a time, and tracks
          how many results have been analyzed for the current search parameters.
          The parameters that go into creating a new search are the location,
          and plant name. Examples of these searches can be seen on the{" "}
          <Link to="/search-history">Search History</Link> page. There is
          definitely overlap between searches, but Hotplants will skip over
          occurrence data that has already been added, and will only scrape data
          for new occurrences.
        </p>

        <p>
          Using filters does not create a new search, and instead filters the
          current results. Reaching the end of the results will expose a button
          that allows the scraping of more data (assuming there is some). If
          neither a location nor plant name are provided, all entries from the
          database are returned, and the option to scrape more data is not
          available.
        </p>

        <p>
          When searching for plants, the occurrence API can take a location
          directly, while a plant name (common name or scientific name) is first
          sent to the{" "}
          <a href="https://techdocs.gbif.org/en/openapi/v1/species#/Searching%20names/searchNames">
            species API
          </a>{" "}
          to get a list of the first 20 taxon keys matching the plant name
          query. The taxon keys can then be used when searching occurrences.
          This approach is imperfect when searching based on a plant's common
          name, as the "vernacular name" field is frequently empty.
        </p>

        <p>
          A new search is created any time a unique location or plant name (or a
          combination of both) is specified. Adding filters only filters the
          currently matched results, and does not create a new GBIF search.
        </p>
      </>
    ),
  },
];
