import { useState } from "react";
import { LinkInterface } from "../interfaces/LinkInterFace";

interface Props {
    linkIndex: number
    links: LinkInterface[]
    setLinks: React.Dispatch<React.SetStateAction<LinkInterface[]>>
}

function Link(props: Props) {
    const [linkIndex, setLinkIndex] = useState<number>(props.linkIndex)
    return (
    <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <p>Link {linkIndex}:</p>
        <input type="text" placeholder="Name"/>
        <input type="text" placeholder="URL"/>
        <button onClick={() => deleteProjectButton()}>Delete link</button>
    </div>
    );

    function deleteProjectButton()
    {
        //delete the project that has the specified index
        const newProjects = props.links.filter((_, index) => index != linkIndex);
        props.setLinks(newProjects)
    }
  }

  

  export default Link;