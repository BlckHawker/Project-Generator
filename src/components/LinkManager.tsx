import { SetStateAction, useState } from "react";
import { LinkInterface } from "../interfaces/LinkInterFace";
import Link from "./Link";

function LinkManager() {
    const [links, setLinks] = useState<LinkInterface[]>([])
    return (
        <div style={{gap: "10px", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center"}}>
            {links.map((_, index)=> <Link linkIndex={index} links={links} setLinks={setLinks}/>)}
            <button onClick={() => addLinkButton()}>Add Link</button>
        </div>
    );

    function addLinkButton()
    {
        const newLink: LinkInterface = {
            name: "",
            link: ""
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
    }
  }

  export default LinkManager;