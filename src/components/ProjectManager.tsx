import { useState } from "react";
import Project from "./Project";
import { ProjectInterface } from "../interfaces/ProjectInterface";

function ProjectManager() {
    const [projects, setProjects] = useState<ProjectInterface[]>([])
    return (
        <div style={{gap: "10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1>Projects</h1>
            {projects.map((_, index)=> <Project projectIndex={index} projects={projects} setProjects={setProjects}/>)}
            <button onClick={() => addProjectButton()}>Add project</button>
            <button onClick={() => makeJSONApplication()}>Make JSON</button>
            <textarea disabled></textarea>
        </div>
    );

    function makeJSONApplication()
    {
        //debug stuff: get first project for now
        const firstProject = projects[0]
        if(firstProject !== undefined)
        {
            console.log(`Title: ${firstProject.title}`)
            console.log(`Start Date: ${firstProject.startDate}`)
            console.log(`End Date: ${firstProject.endDate}`)
            console.log(`Languages: ${firstProject.languages}`)
            console.log(`Libraries: ${firstProject.libraries}`)
            console.log(`Tools: ${firstProject.tools}`)
            console.log(`Description: ${firstProject.description}`)
            console.log(`Links: ${firstProject.links}`)
            console.log(`Image src: ${firstProject.image.src}`)
            console.log(`Image alt: ${firstProject.image.alt}`)
        }
    }

    function addProjectButton()
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