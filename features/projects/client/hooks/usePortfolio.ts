import { IProject } from "@/app/actions/fetchProjects";
import { useState } from "react";

export const usePortfolio = () => {
  const [projectsdata] = useState<IProject[]>();
  return { projectsdata };
};
