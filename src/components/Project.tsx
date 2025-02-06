import { ProjectInterface } from "../interfaces/ProjectInterface";
import LinkManager from "./LinkManager";
import { useState } from "react";


interface Props {
    projectIndex: number
    projects: ProjectInterface[]
    setProjects: React.Dispatch<React.SetStateAction<ProjectInterface[]>>
}

function Project(props: Props) {
    const [projectIndex, setProjectIndex] = useState<number>(props.projectIndex)
    return (
      <div style={{gap: "10px", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", border:"2px solid #ddd"}}>
        {/* Title Text box */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Title:</p>
            <input type="text" />
        </div>
        {/* Start Date */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Start Date:</p>
            <input type="date" min="2019-01-01" max="2100-12-31" />
        </div>
        {/* End Date */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>End Date:</p>
            <input type="date" min="2019-01-01" max="2100-12-31" />
        </div>
        {/* Languages */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Languages:</p>
            <input type="text" placeholder="Separate multiple languages with a ','" style={{width: "225px"}}/>
        </div>
        {/* Libraries */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Libraries:</p>
            <input type="text" placeholder="Separate multiple libraries with a ','" style={{width: "225px"}}/>
        </div>
        {/* Tools */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Tools:</p>
            <input type="text" placeholder="Separate multiple tools with a ','" style={{width: "225px"}}/>
        </div>
        {/* Description */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Description:</p>
            <textarea></textarea>
        </div>
        {/* Image */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Image:</p>
            <input type="file" id="myFile" name="filename"/>
            <input type="text" placeholder="Alt text"/>

        </div>
        {/* Links */}
        <h2>Links</h2>
        <LinkManager/>
        <button onClick={() => deleteProjectButton()}>Delete Project</button>
      </div>

    );

    function deleteProjectButton()
    {
        //delete the project that has the specified index
        const newProjects = props.projects.filter((_, index) => index != projectIndex);
        props.setProjects(newProjects)
    }
  }

  export default Project;