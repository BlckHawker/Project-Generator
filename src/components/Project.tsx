import { ImageInterface } from "../interfaces/ImageInterface";
import { ProjectInterface } from "../interfaces/ProjectInterface";
import LinkManager from "./LinkManager";
import { useState } from "react";


interface Props {
    projectIndex: number
    projects: ProjectInterface[]
    setProjects: React.Dispatch<React.SetStateAction<ProjectInterface[]>>
}


const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
// todo figure how import image name 
function Project(props: Props) {
    const [projectIndex] = useState<number>(props.projectIndex)
    const [project] = useState<ProjectInterface>(props.projects[props.projectIndex])
    const [description, setDescription] = useState<string>(project.Description)
    return (
      <div style={{gap: "10px", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", border:"2px solid #ddd"}}>
        <p>Project {projectIndex}</p>
        {/* Title Text box */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Title:</p>
            <input type="text" value={project.Title} onChange={titleOnChange}/>
        </div>
        {/* Start Date */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Start Date:</p>
            <input type="date" min="2019-01-01" max="2100-12-31" value={getFormDate(project["Start Date"])} onChange={startDateOnChange} />
        </div>
        {/* End Date */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>End Date:</p>
            <input type="date" min="2019-01-01" max="2100-12-31" value={getFormDate(project["End Date"])} onChange={endDateOnChange}/>
        </div>
        {/* Languages */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Languages:</p>
            <input type="text" placeholder="Separate multiple languages with a ','" style={{width: "225px"}} value={project.Languages.join(', ')} onChange={languagesOnChange}/>
        </div>
        {/* Libraries */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Libraries:</p>
            <input type="text" placeholder="Separate multiple libraries with a ','" style={{width: "225px"}} value={project.Libraries.join(', ')} onChange={librariesOnChange}/>
        </div>
        {/* Tools */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Tools:</p>
            <input type="text" placeholder="Separate multiple tools with a ','" style={{width: "225px"}} value={project.Tools.join(', ')} onChange={toolsOnChange}/>
        </div>
        {/* Description */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Description:</p>
            <textarea value={project.Description} onChange={descriptionOnChange}></textarea>
        </div>
        {/* Image */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Image:</p>
            <input type="file" id="myFile" name="filename" accept="image/gif, image/png, image/jpeg" onChange={fileSrcOnChange}/>
            <input type="text" placeholder="Alt text" value={project.Image.alt} onChange={fileAltOnChange}/>
        </div>
        {/* Links */}
        <h2>Links</h2>
        <LinkManager project={props.projects[props.projectIndex]}/>
        <button onClick={() => deleteProjectButton()}>Delete Project</button>
      </div>

    );

    function titleOnChange(event: React.ChangeEvent<HTMLInputElement>) :void
    {
        const newTitle =  event.target.value;
        getProject().Title = newTitle;
    }

    function startDateOnChange(event: React.ChangeEvent<HTMLInputElement>):void
    {
        const date = getDate(event.target.value);
        getProject()["Start Date"] = date;
    }

    function endDateOnChange(event: React.ChangeEvent<HTMLInputElement>):void
    {
        getProject()["End Date"] = getDate(event.target.value)
    }

    function descriptionOnChange(event: React.ChangeEvent<HTMLTextAreaElement>):void
    {
        //get rid of the white spaces
        let description = event.target.value
        getProject().Description = description
        setDescription(description)

    }

    function fileSrcOnChange(event: React.ChangeEvent<HTMLInputElement>): void
    {
        const project: ProjectInterface = getProject();
        const image: ImageInterface = project.Image;
        if(event.target !== null && event.target.files !== null && event.target.files.length > 0)
        {
            image.src = `img/${event.target.files[0].name}`
        }

        else
        {
            image.src = "";
        }
    }

    function fileAltOnChange(event: React.ChangeEvent<HTMLInputElement>): void
    {
        getProject().Image.alt = event.target.value.trim();
    }

    function getDate(date: string): string
    {
        const dateRegex = /(\d{4})-(\d{2})-(\d{2})/
        const matches = date.match(dateRegex) ?? ["2025","01","01"]

        const finalDate = `${months[parseInt(matches[2])]} ${matches[1]}`

        // if finalDate is "January 01", then the input is blank
        return finalDate === "January 01" ?  "Present" : finalDate;
    }

    function getFormDate(date: string): string
    {
        const dateArr = date.split(' ');
        const monthIndex = months.indexOf(dateArr[0]).toString()
        const year = dateArr[1]
        const string = `${year}-${monthIndex.padStart(2, "0")}-01`
        return string;
    }

    function languagesOnChange(event: React.ChangeEvent<HTMLInputElement>): void
    {
        const languages = getNewLanguageLibrariesTools(event);
        getProject().Languages = languages
    }

    function librariesOnChange(event: React.ChangeEvent<HTMLInputElement>): void
    {
        const libraries = getNewLanguageLibrariesTools(event);
        getProject().Libraries = libraries
    }

    function toolsOnChange(event: React.ChangeEvent<HTMLInputElement>): void
    {
        const tools = getNewLanguageLibrariesTools(event);
        getProject().Tools = tools
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
        
        for(const element of arr)
        {
            //remove any duplicate elements 
            if(newArr.find(l => l.toUpperCase() === element.toUpperCase()) === undefined)
            {

                newArr.push(element)
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