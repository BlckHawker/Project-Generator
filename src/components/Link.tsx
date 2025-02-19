import { useState } from "react";
import { LinkInterface } from "../interfaces/LinkInterFace";
import { ProjectInterface } from "../interfaces/ProjectInterface";

interface Props {
    project: ProjectInterface
    linkIndex: number
    links: LinkInterface[]
    setLinks: React.Dispatch<React.SetStateAction<LinkInterface[]>>
}

function Link(props: Props) {
    const [linkIndex, setLinkIndex] = useState<number>(props.linkIndex)
    const [name, setName] = useState<string>(props.links[props.linkIndex].Name)
    const [url, setUrl] = useState<string>(props.links[props.linkIndex].Link)
    return (
    <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <p>Link {linkIndex}:</p>
        <input type="text" placeholder="Name" value={props.links[linkIndex].Name} onChange={nameOnChange}/>
        <input type="text" placeholder="URL" value={props.links[linkIndex].Link} onChange={urlOnChange}/>
        <button onClick={() => deleteLinkButton()}>Delete link</button>
    </div>
    );

    function deleteLinkButton()
    {
        //delete the project that has the specified index
        const newProjects = props.links.filter((_, index) => index != linkIndex);
        props.setLinks(newProjects)
    }

    function nameOnChange(event: React.ChangeEvent<HTMLInputElement>): void 
    {
        const linkName = event.target.value;
        props.project.Links[linkIndex].Name = linkName;
        setName(linkName)

    }

    function urlOnChange(event: React.ChangeEvent<HTMLInputElement>): void 
    {
        const url = event.target.value;
        props.project.Links[linkIndex].Link = url;
        setUrl(url)
    }

  }

  

  export default Link;