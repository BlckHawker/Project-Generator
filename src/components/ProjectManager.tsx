import { useState } from "react";
import Project from "./Project";
import { ProjectInterface } from "../interfaces/ProjectInerface";

function ProjectManager() {
    const [projects, setProjects] = useState<ProjectInterface[]>([])
    return (
        <div style={{gap: "10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1>Projects</h1>
            {/* <Project/> */}
            {projects.map(_ => <Project/>)}
            <button onClick={() => AddProjectButton()}>Add project</button>
            <button>Make JSON</button>
            <textarea disabled></textarea>
        </div>
    );

    function AddProjectButton()
    {
        const newProject: ProjectInterface = {
            title: "",
            startDate: "",
            endDate: "",
            languages: [],
            libraries: [],
            tools: [],
            description: "",
            links: [],
            image:  {
                src: "",
                alt: ""
            }
        };

        const newProjects: ProjectInterface[] = [];
        //get all of the current projects
        for(const project of projects)
        {
            newProjects.push(project)
        }

        //and add the new project one
        newProjects.push(newProject)

        setProjects(newProjects)
    }
  }

  export default ProjectManager;