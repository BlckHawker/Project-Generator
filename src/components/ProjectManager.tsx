import { useState } from "react";
import Project from "./Project";
import { ProjectInterface } from "../interfaces/ProjectInterface";

function ProjectManager() {
    const [projects, setProjects] = useState<ProjectInterface[]>([])
    const resultWidth = 800;
    return (
        <div style={{gap: "10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <input type="file" id="imported-json" accept=".json"/>
            <button onClick={importJSONOnClick}>Import Projects</button>
            <h1>Projects</h1>
            {projects.map((_, index)=> <Project projectIndex={index} projects={projects} setProjects={setProjects}/>)}
            <button onClick={() => addProjectButton()}>Add project</button>
            <button onClick={() => makeJSONApplication()}>Make JSON</button>
            <textarea id="results" disabled style={{marginBottom: "15px", width: "900", height: `${resultWidth}px`}}></textarea>
            <button onClick={() => copyText()} style={{marginBottom: "20px"}}>Copy Text</button>
        </div>
    );

    function changeTextAreaContent(textContent: string, warning: boolean): void
    {
        const resultElement = getResultElement();

        //change the color of the text depending on if it's a warning
        resultElement.style.color = warning ? "red" : "black";

        resultElement.textContent = textContent;
    }

    function makeJSONApplication()
    {
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
            const wrapper = {
                "Projects": validProjects
            }
            
            //change text content to the json
            let json: string = JSON.stringify(wrapper, null, "\t")
            changeTextAreaContent(json, false);
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

            changeTextAreaContent(invalidStrings.join('\n'), true)
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
        const validDatesWarning = validDates(project["Start Date"], project["End Date"]);
        
        if(validDatesWarning !== "")
        {
            errors.push(validDatesWarning)
        }

        //there are no languages, libraries, nor tools combined
        if(project.Languages.length + project.Libraries.length + project.Tools.length === 0)
        {
            errors.push("Need to have at least one language, library, or tool")
        }
        
        //description can't be blank
        if(project.Description.trim() === "")
        {
            errors.push("Description can't be blank")
        }

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
            for(let j = i + 1; j < project.Links.length; j++)
            {
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

    function importJSONOnClick(): void
    {
        const element: HTMLInputElement = document.querySelector('#imported-json') as HTMLInputElement;
        if(element !== null && element.files !== null && element.files.length > 0)
        {
            const file = element.files[0];
            const reader = new FileReader();
            // Define the onload event for when the file is successfully read
            reader.onload = (e) => {
                const fileContent = e.target?.result;
                if (fileContent) {
                    try {
                        // Parse the content as JSON
                        const json = JSON.parse(fileContent as string);

                        //todo verify the json is full of valid ProjectInterfaces

                        let errors: string[] = []

                        //verify the json only has one key called "Projects"
                        const keys = Object.keys(json);

                        if(keys.length !== 1)
                        {
                            const warning = keys.length === 0 ? "No keys were found" : `Found the following keys: ${keys.map(k => `"${k}"`).join(", ")}`
                            errors.push(`There should be only key called "Projects". ${warning}`)
                        }

                        if(keys.length > 0 && keys[0] !== "Projects")
                        {
                            errors.push("There should be only key called \"Projects\"")
                        }

                        //verify the key "Projects" is an array
                        if(!Array.isArray(json.Projects))
                        {
                            errors.push("The key \"Projects\" must be an array")
                        }

                        if(errors.length !== 0)
                        {
                            changeTextAreaContent(errors.join('\n'), true)
                            return;
                        }

                        //todo verify each element within the array is a valid project
                        for(let i = 0; i < json.Projects.length; i++)
                        {
                            const project = json.Projects[i];

                            //todo all of the following must be true in order for a project to be valid

                            //todo title
                            if(project.Title === undefined)
                            {
                                errors.push(`Project ${i} is missing a "Title" key`)
                            }

                            //todo title is a string
                            else if(!isString(project.Title))
                            {
                                errors.push(`Project ${i}'s Title must be a string`)
                            }

                            //todo title can't be blank
                            else if(project.Title === "")
                            {
                                errors.push(`Project ${i}'s "Title" can't be blank`)
                            }

                            else
                            {
                                //todo title can't be duplicate of another project
                                for(let j = i + 1; j < json.Projects.length; j++)
                                {
                                    const otherProject = json.Projects[j];
    
                                    if(project.Title === otherProject.Title)
                                    {
                                        errors.push(`Project ${i}'s "Title" can't be the same of another project's (${j})`)
                                    }
                                }
                            }

                            //todo start date
                            if(project["Start Date"] === undefined)
                            {
                                errors.push(`Project ${i} is missing a "Start Date" key`)
                            }

                            //todo start date must be a string
                            else if(!isString(project["Start Date"]))
                            {
                                errors.push(`Project ${i}'s Start Date must be a string`)
                            }

                            //todo end date (string)
                            else if(project["End Date"] === undefined)
                            {
                                errors.push(`Project ${i} is missing a "End Date" key`)
                            }

                            else
                            {
                                //todo dates are valid
                                const datesValid = validDates(project["Start Date"], project["End Date"]);
                                if(datesValid !== "")
                                {
                                    errors.push(`Project ${i}'s ${datesValid}`)
                                }
                            }

                            //validate languages, libraries, and tools
                            const validLanguagesLibrariesTools = (name: string) => {
                                let obj = project[name]

                                //make sure the variable is defined
                                if(obj === undefined)
                                {
                                    return `Project ${i} is missing a "${name}" key`
                                }

                                //verify the obj is an array of strings
                                if(!Array.isArray(obj) || !obj.every((ele: any) => isString(ele)))
                                {
                                    return `Project ${i}'s ${name} must be an array of strings`
                                }

                                //verify the array doesn't have duplicates
                                if(new Set(obj).size !== obj.length)
                                {
                                    return `Project ${i}'s ${name} can't have duplicates`;
                                }

                                return ""
                            }

                            const words = ["Languages", "Libraries", "Tools"]
                            const languageLibraryToolErrors = words.map((word) => validLanguagesLibrariesTools(word)).filter(err => err !== "")

                            if(languageLibraryToolErrors.length > 0)
                            {
                                errors = errors.concat(languageLibraryToolErrors)
                            }

                            //todo description
                            if(project.Description === undefined)
                            {
                                errors.push(`Project ${i} is missing a "Description" key`)
                            }

                            //todo description is a string
                            if(!isString(project.Description))
                            {
                                errors.push(`Project ${i}'s Description must be a string`)
                            }

                            //todo description should not be blank
                            if(project.Description.trim() === "")
                            {
                                errors.push(`Project ${i}'s Description can't be blank`)
                            }

                            //todo Links
                            if(project.Links === undefined)
                            {
                                errors.push(`Project ${i} is missing a "Links" key`)
                            }

                            //todo verify Links is an array
                            else if(!Array.isArray(project.Links))
                            {
                                errors.push(`Project ${i}'s Links is not an array`)
                            }

                            //todo for each link

                            else
                            {
                                for(let j = 0; j < project.Links.length; j++)
                                {
                                    const link = project.Links[j];
    
                                    //todo verify link has just two keys (Name) and (Link)
                                    const keys = Object.keys(link);
    
                                    const ordinal = (index: number) => {
                                        switch(index) {
                                            case 1:
                                                return "1st"
                                            case 2:
                                                return "2nd"
                                            case 3:
                                                return "3rd"
    
                                            default:
                                                return `${index}th`
                                        }
    
                                    }
    
                                    if(keys.length !== 2 || !keys.includes("Name") || !keys.includes("Link"))
                                    {
                                        errors.push(`Project ${i}'s ${ordinal(j)} link doesn't have only the keys "Name" and "Link"`)
                                    }
    
                                    //todo name should not be blank
    
                                    const nameBlank = link.Name.trim() === "";
                                    if(nameBlank)
                                    {
                                        errors.push(`Project ${i}'s ${ordinal(j)} name can be blank`)
                                    }
                                    
                                    //todo url should not be blank
                                    if(link.Link.trim() === "")
                                    {
                                        errors.push(`Project ${i}'s ${ordinal(j)} link can be blank`)
                                    }
    
                                    else if(!nameBlank)
                                    {
                                        for(let k = j + 1; k < project.Links.length; k++)
                                        {
                                            const otherLink = project.Links[k];
        
                                            //todo there shouldn't be a link with the same name
                                            if(otherLink.Name !== undefined && isString(otherLink.Name) && otherLink.Name.trim() === link.Name.trim())
                                            {
                                                errors.push(`Project ${i}'s ${ordinal(j)} link can't have the same name of another link (${ordinal(k)})`)
                                            }
        
                                            //todo there shouldn't be a link with the same url 
                                            if(otherLink.Link !== undefined && isString(otherLink.Link) && otherLink.Link.trim() === link.Link.trim())
                                            {
                                                errors.push(`Project ${i}'s ${ordinal(j)} link can't have the same url of another link (${ordinal(k)})`)
                                            }
                                        }
                                    }
                                }
                            }
     
                            const imageUndefined = project.Image === undefined;
                            const keys = imageUndefined ? "" : Object.keys(project.Image) 

                            //todo Image (Image)
                            if(imageUndefined)
                            {
                                errors.push(`Project ${i} is missing a "Image" key`)
                            }

                            //todo verify link has just two keys (src) and (alt)
                            else if(keys.length !== 2 || !keys.includes("src") || !keys.includes("alt"))
                            {
                                errors.push(`Project ${i}'s  Image doesn't have only the keys "src" and "alt"`)
                            }

                        }

                        if(errors.length > 0)
                        {
                            changeTextAreaContent(`Invalid JSON:\n${errors.join('\n')}`, true)
                        }

                        else
                        {
                            // todo make this a state so it saves
                            changeTextAreaContent(`Imported "${file.name}" successfully`, false)

                            //replace gui with the imported projects

                            const newProjects: ProjectInterface[] = json.Projects.map((p: any) => ({
                                Title: p.Title,
                                "Start Date": p["Start Date"],
                                "End Date": p["End Date"],
                                Languages: p.Languages,
                                Libraries: p.Libraries,
                                Tools: p.Tools,
                                Description: p.Description,
                                Links: p.Links,
                                Image: p.Image
                            }))

                            console.log(newProjects)

                            setProjects(newProjects)

                        }

                    } catch (error) {
                        changeTextAreaContent(`Failed to parse JSON: ${error}`, true)
                    }
                }
            };
            
            // Read the file as text
            reader.readAsText(file);
        }
        else
        {
            changeTextAreaContent("No JSON selected", true)
        }

        //set the content of the input element as empty
        element.value = '';
    }

    function isString(obj: any): boolean
    {
        return typeof obj === 'string' || obj instanceof String
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
            //verify start date matches the format
            return `Start Date ("${startDate}") does not follow the format "{Month name} {Year}"`
        }

        //verify that end date either matches the month year format or is "Present"
        if(!endDateMatches && endDate !== "Present")
        {
            return `End Date ("${endDate}") is not "Present" nor follow the format "{Month name} {Year}"`
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
                return `Start Date ("${startDate}") cannot be after its End Date ("${endDate}")`
            }
        }
        return ""
    }

    function addProjectButton()
    {
        const newProject: ProjectInterface = {
            Title: "",
            "Start Date": "Present",
            "End Date": "Present",
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