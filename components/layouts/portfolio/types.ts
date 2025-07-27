import { StaticImageData } from "next/image";

export interface IProject {
  id: string;
  name: string;
  location: string;
  image: StaticImageData;
}
