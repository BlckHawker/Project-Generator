import { ImageInterface } from "./ImageInterface"
import { LinkInterface } from "./LinkInterFace"

interface ProjectInterface {
    title: string,
    startDate: string,
    endDate: string,
    languages: string[],
    libraries: string[],
    tools: string[],
    description: string,
    links: LinkInterface[],
    image: ImageInterface

}

export type { ProjectInterface }