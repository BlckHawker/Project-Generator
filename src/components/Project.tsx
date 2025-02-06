import LinkManager from "./LinkManager";

function Project() {
    return (
      <div style={{gap: "10px", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center"}}>
        <h2>Meta Data</h2>
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
        {/* Links */}
        <h2>Links</h2>
        <LinkManager/>
        {/* Image */}
        <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <p>Image:</p>
            <input type="file" id="myFile" name="filename"/>
            <input type="text" placeholder="Alt text"/>

        </div>
      </div>

    );
  }

  export default Project;