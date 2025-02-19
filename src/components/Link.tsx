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
    return (
    <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <p>Link {linkIndex}:</p>
        <input type="text" placeholder="Name" value={props.links[linkIndex].Name} onChange={nameOnChange}/>
        <input type="text" placeholder="URL" value={props.links[linkIndex].Link} onChange={urlOnChange}/>
        <button onClick={() => deleteProjectButton()}>Delete link</button>
    </div>
    );

    function deleteProjectButton()
    {
        //delete the project that has the specified index
        const newProjects = props.links.filter((_, index) => index != linkIndex);
        props.setLinks(newProjects)
    }

    function nameOnChange(event: React.ChangeEvent<HTMLInputElement>): void 
    {
        props.project.Links[linkIndex].Name = event.target.value;
    }

    function urlOnChange(event: React.ChangeEvent<HTMLInputElement>): void 
    {
        props.project.Links[linkIndex].Link = event.target.value;
    }

  }

  

  export default Link;