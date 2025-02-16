import { useState } from "react";
import Project from "./Project";
import { ProjectInterface } from "../interfaces/ProjectInterface";

function ProjectManager() {
    const [projects, setProjects] = useState<ProjectInterface[]>([])
    const resultsFontSize = 16; //the font size of the text in a text area
    const resultWidth = 800;
    return (
        <div style={{gap: "10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1>Projects</h1>
            {projects.map((_, index)=> <Project projectIndex={index} projects={projects} setProjects={setProjects}/>)}
            <button onClick={() => addProjectButton()}>Add project</button>
            <button onClick={() => makeJSONApplication()}>Make JSON</button>
            <textarea id="results" disabled style={{marginBottom: "15px", width: "900", height: `${resultWidth}px`, fontSize:`${resultsFontSize}px`}}></textarea>
            <button onClick={() => copyText()} style={{marginBottom: "20px"}}>Copy Text</button>
        </div>
    );

    function makeJSONApplication()
    {
        //the text area
        const resultElement = getResultElement();

        const validProjects: ProjectInterface[] = []

        //checks to make sure which projects are actually valid.
        //empty arrays means they are. They are all kept in one array
        //in order to keep track of the invalid indices properly
        const projectValidities: string[][] = [];

        //the list of strings to show the user as the current set of projects is invalid
        const invalidStrings: string[] = [];

        for(const project of projects)
        {
            const result = validProject(project, validProjects);

            projectValidities.push(result)

            if(result.length === 0)
            {
                validProjects.push(project)
            }
        }

        //if all projects are valid make the json of the projects
        if(projectValidities.every(arr => arr.length === 0))
        {
            //change the text color to black
            resultElement.style.color = "black";

            //change text content to the json
            let json: string = JSON.stringify(validProjects, null, "\t")
            resultElement.textContent = json;

        }

        //otherwise, tell the user the error(s) for all the invalid projects
        else
        {
            let errorCount = 0; // the amount of errors found throughout the invalid projects

            
            for(let i = 0; i < projectValidities.length; i++)
            {
                const errors = projectValidities[i];
                if(errors.length === 0)
                {
                    continue;
                }

                invalidStrings.push(`The are problem(s) with Project ${i}:\n${errors.map(e => `\t- ${e}`).join('\n')}`)
                //adding one because we want to count the header project itself
                errorCount += errors.length + 1
            }

            //set the content to be the list of invalid strings
            resultElement.textContent = invalidStrings.join('\n');
            // set text area text to red and set the content to the errors
            resultElement.style.color = "red";
            
            //change the width and height of the text area based on the text content

            //to calculate the height of the text area,
            //get the number of errors total throughout all projects. Add the number of invalid projects
            //multiply that by resultsFontSize
            const height = Math.ceil(errorCount * (resultsFontSize + 3));
            resultElement.style.height = `${height}px`
            resultElement.style.width = `${resultWidth}px`
        }
    }

    /**
     * Tells whether a project is considered valid
     * @param {ProjectInterface} project - The project to be validated
     * @param {ProjectInterface[]} validProjects - The list of currently valid projects
     * @returns {string[]} - Returns an array of errors. If empty, then the project is valid
     */
    function validProject(project: ProjectInterface, validProjects: ProjectInterface[]): string[]
     {
        const errors: string[] = [];
        //title is ""
        if(project.Title === "")
            errors.push("Title can't be left blank")


        //there are multiple projects with the same title
        else 
        {
            for(let i = 0; i < validProjects.length; i++)
            {
                if(validProjects[i].Title.toUpperCase() === project.Title.toUpperCase())
                {
                    errors.push(`Title can't share a title with another project (project ${i})`);   
                }
            }
        }

        //date are invalid
        const validDatesWarning = validDates(project.StartDate, project.EndDate);
        
        if(validDatesWarning !== "")
        {
            errors.push(validDatesWarning)
        }

        //there are no languages
        if(project.Languages.length === 0)
        {
            errors.push("Need to have at least one language")
        }

        //there are no libraries
        if(project.Libraries.length === 0)
        {
            errors.push("Need to have at least one library")
        }

        //there are no tools
        if(project.Tools.length === 0)
        {
            errors.push("Need to have at least one tools")
        }

        //description can't be blank
        if(project.Description === "")
        {
            errors.push("Description can't be blank")
        }

        debugger
        //for each link
        for(let i = 0; i < project.Links.length; i++)
        {
            let link = project.Links[i];

            //make sure the name isn't blank
            if(link.Name === "")
            {
                errors.push(`Link ${i}: name can't be blank`)
            }

            //make sure the name isn't a duplicate
            for(let j = 0; j < project.Links.length; j++)
            {
                if(i == j)
                {
                    continue;
                }

                if(link.Name === project.Links[j].Name)
                {
                    errors.push(`Link ${i}: name can't a duplicate of another link (${j})`)
                    break;
                }
            }

            //make sure the url isn't blank
            if(link.Link === "")
            {
                errors.push(`Link ${i}: url can't be blank`)
            }

            //make sure the url isn't a duplicate
            for(let j = 0; j < project.Links.length; j++)
            {
                if(i == j)
                {
                    continue;
                }

                if(link.Link === project.Links[j].Link)
                {
                    errors.push(`Link ${i}: url can't a duplicate of another link (${j})`)
                    break;
                }
            }
        }
        return errors;

    }

    /**
     * Validates if the start date and end date are possible
     * @param startDate the start date of the project
     * @param endDate the end date of the project
     * @returns {string} An empty string if dates are valid. Otherwise, the string will explain the error
     */
    function validDates(startDate: string, endDate: string): string
    {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const regex = new RegExp(`(${months.join("|")}) (\\d{4})`);
        const startDateMatches = startDate.match(regex)
        const endDateMatches = endDate.match(regex)

        //verify that start date follows the format "{MonthName} {Year}"
        const startDateNoMatch = startDateMatches === null;
        const endDateNoMatch = endDateMatches === null;

        if(startDateNoMatch)
        {
            return `Start Date (${startDate}) does not follow the format "{Month name} {Year}"`
        }

        //if both the start date and end date are not both "Present"
        if(!endDateNoMatch)
        {
            //if the dates are the same year, make sure that start month is not after the end month
            //or
            //if the dates are not the same year, make sure the start year is not after the end year
            if((startDateMatches[2] === endDateMatches[2] && months.indexOf(startDateMatches[1]) > months.indexOf(endDateMatches[1])) ||
                parseInt(startDateMatches[2]) > parseInt(endDateMatches[2]))
            {
                return `Start Date (${startDate}) cannot be after end date (${endDate})`
            }
        }
        return ""
    }

    function addProjectButton()
    {
        const newProject: ProjectInterface = {
            Title: "",
            StartDate: "Present",
            EndDate: "Present",
            Languages: [],
            Libraries: [],
            Tools: [],
            Description: "",
            Links: [],
            Image:  {
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

    function copyText()
    {
        const copyText = getResultElement()
          // Select the text field
            copyText.select();
            copyText.setSelectionRange(0, 99999); // For mobile devices

            // Copy the text inside the text field
            navigator.clipboard.writeText(copyText.value);

            // Alert the copied text
            alert("Copied text to clipboard");
    }

    function getResultElement() : HTMLTextAreaElement
    {
        return document.querySelector('#results') as HTMLTextAreaElement;
    }
  }

  export default ProjectManager;