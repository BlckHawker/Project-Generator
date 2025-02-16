import { ImageInterface } from "../interfaces/ImageInterface";
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
        <p>Project {projectIndex}</p>
        {/* Title Text box */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Title:</p>
            <input type="text" onChange={titleOnChange}/>
        </div>
        {/* Start Date */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Start Date:</p>
            <input type="date" min="2019-01-01" max="2100-12-31" onChange={startDateOnChange} />
        </div>
        {/* End Date */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>End Date:</p>
            <input type="date" min="2019-01-01" max="2100-12-31" onChange={endDateOnChange}/>
        </div>
        {/* Languages */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Languages:</p>
            <input type="text" placeholder="Separate multiple languages with a ','" style={{width: "225px"}} onChange={languagesOnChange}/>
        </div>
        {/* Libraries */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Libraries:</p>
            <input type="text" placeholder="Separate multiple libraries with a ','" style={{width: "225px"}} onChange={librariesOnChange}/>
        </div>
        {/* Tools */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Tools:</p>
            <input type="text" placeholder="Separate multiple tools with a ','" style={{width: "225px"}} onChange={toolsOnChange}/>
        </div>
        {/* Description */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}} onChange={descriptionOnChange}>
            <p>Description:</p>
            <textarea></textarea>
        </div>
        {/* Image */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Image:</p>
            <input type="file" id="myFile" name="filename" onChange={fileSrcOnChange}/>
            <input type="text" placeholder="Alt text" onChange={fileAltOnChange}/>
        </div>
        {/* Links */}
        <h2>Links</h2>
        <LinkManager project={props.projects[props.projectIndex]}/>
        <button onClick={() => deleteProjectButton()}>Delete Project</button>
      </div>

    );

    function titleOnChange(event: React.ChangeEvent<HTMLInputElement>) :void
    {
        getProject().Title = event.target.value;
    }

    function startDateOnChange(event: React.ChangeEvent<HTMLInputElement>):void
    {
        getProject().StartDate = getDate(event.target.value);
    }

    function endDateOnChange(event: React.ChangeEvent<HTMLInputElement>):void
    {
        getProject().EndDate = getDate(event.target.value)
    }

    function descriptionOnChange(event: React.ChangeEvent<HTMLInputElement>):void
    {
        //get rid of the white spaces
        let description = event.target.value.trim()
        getProject().Description = description
    }

    function fileSrcOnChange(event: React.ChangeEvent<HTMLInputElement>): void
    {
        if(event.target !== null && event.target.files !== null)
        {
            const project: ProjectInterface = getProject();
            const image: ImageInterface = project.Image;
            image.src = `img/${event.target.files[0].name}`
        }
    }

    function fileAltOnChange(event: React.ChangeEvent<HTMLInputElement>): void
    {
        getProject().Image.alt = event.target.value.trim();
    }

    function getDate(date: string): string
    {
        const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const dateRegex = /(\d{4})-(\d{2})-(\d{2})/
        const matches = date.match(dateRegex) ?? ["2025","01","01"]

        const finalDate = `${months[parseInt(matches[2])]} ${matches[1]}`

        // if finalDate is "January 01", then the input is blank
        return finalDate === "January 01" ?  "Present" : finalDate;
    }

    function languagesOnChange(event: React.ChangeEvent<HTMLInputElement>): void
    {
        getProject().Languages = getNewLanguageLibrariesTools(event);
    }

    function librariesOnChange(event: React.ChangeEvent<HTMLInputElement>): void
    {
        getProject().Libraries = getNewLanguageLibrariesTools(event);
    }

    function toolsOnChange(event: React.ChangeEvent<HTMLInputElement>): void
    {
        getProject().Tools = getNewLanguageLibrariesTools(event);
    }

    function getNewLanguageLibrariesTools(event: React.ChangeEvent<HTMLInputElement>): string[]
    {
        let newArr: string[] = []
        //trim the string of any white spaces
        const string: string = event.target.value.trim();

        //split the project based on the ',' character
        let arr = string.split(',')

        arr = arr
        //trim each element so there are no white spaces and the start end 
        .map(l => l.trim())
        //remove any empty string elements 
        .filter(l => l !== "")
        
        //for each element make it so the first character is capitalized and the rest are lower cased
        for(const element of arr)
        {
            //remove any duplicate elements 
            if(newArr.find(l => l.toUpperCase() === element.toUpperCase()) === undefined)
            {
                let newElement: string = "";
                if(element.length == 1)
                {
                    newElement = element.toUpperCase();
                }
        
                else if(element.length > 1)
                {
                    newElement = element.toUpperCase()[0] + element.substring(1).toLowerCase()
                }
    
                if(newElement !== "")
                {
                    newArr.push(newElement)
                }
            }

        }

        //alphabetically sort the elements 
        return newArr.sort((a, b) => a.localeCompare(b))
    }

    function deleteProjectButton(): void
    {
        //delete the project that has the specified index
        const newProjects = props.projects.filter((_, index) => index != projectIndex);
        props.setProjects(newProjects)
    }

    function getProject(): ProjectInterface
    {
        return props.projects[props.projectIndex]; 
    }
  }

  export default Project;