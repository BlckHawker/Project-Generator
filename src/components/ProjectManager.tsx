import Project from "./Project";

function ProjectManager() {
    return (
        <div style={{gap: "10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1>Projects</h1>
            <Project/>
            <button>Submit</button>
        </div>
    );
  }

  export default ProjectManager;