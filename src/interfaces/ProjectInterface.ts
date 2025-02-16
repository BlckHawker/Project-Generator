import { ImageInterface } from "./ImageInterface"
import { LinkInterface } from "./LinkInterFace"

interface ProjectInterface {
    Title: string,
    StartDate: string,
    EndDate: string,
    Languages: string[],
    Libraries: string[],
    Tools: string[],
    Description: string,
    Links: LinkInterface[],
    Image: ImageInterface

}

export type { ProjectInterface }