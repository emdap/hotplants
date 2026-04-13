import { ReactNode } from "react";
import { IconType } from "react-icons/lib";

export type AboutSectionConfig = {
  Icon?: IconType;
  title: string;
  content: ReactNode;
};

export const ABOUT_SECTIONS: AboutSectionConfig[] = [
  {
    title: "What is this",
    content: "Great question!",
  },
  {
    title: "How does it work",
    content: "Great question!",
  },
];
