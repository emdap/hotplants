import { ReactNode } from "react";
import { IconType } from "react-icons/lib";

export type AboutSectionConfig = {
  Icon?: IconType;
  title: string;
  content: ReactNode;
};

export const ABOUT_SECTIONS: AboutSectionConfig[] = [
  {
    title: "Still working on this page",
    content: ":)",
  },
  {
    title: "What is this",
    content: (
      <>
        A{" "}
        <a className="text-link" href="https://www.gbif.org">
          GBIF
        </a>{" "}
        data explorer, with additional plant information scraped from{" "}
        <a className="text-link" href="https://permapeople.org/">
          Permapeople
        </a>
        .
      </>
    ),
  },
  {
    title: "How does it work",
    content: "Great question!",
  },
];
