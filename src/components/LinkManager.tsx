import { useState } from "react";
import { LinkInterface } from "../interfaces/LinkInterFace";
import Link from "./Link";
import { ProjectInterface } from "../interfaces/ProjectInterface";

interface Props {
    project: ProjectInterface
}

function LinkManager(props: Props) {
    const [links, setLinks] = useState<LinkInterface[]>(props.project.Links)

    return (
        <div style={{gap: "10px", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center"}}>
            {links.map((_, index)=> <Link linkIndex={index} links={links} setLinks={setLinks} project={props.project}/>)}
            <button onClick={() => addLinkButton()}>Add Link</button>
        </div>
    );

    function addLinkButton()
    {
        const newLink: LinkInterface = {
            Name: "",
            Link: ""
        }
        const newLinks: LinkInterface[] = [];
        //get all of the current links
        for(const link of links)
        {
            newLinks.push(link)
        }

        //and add the link
        newLinks.push(newLink)
        
        setLinks(newLinks)
        props.project.Links = newLinks;
    }
  }

  export default LinkManager;