import { useState } from "react";
import { dummyData } from "./constants";
import { IProject } from "./types";

export const usePortfolio = () => {
  const [projectsdata] = useState<IProject[]>(dummyData);
  return { projectsdata };
};
