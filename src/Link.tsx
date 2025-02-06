function Link() {
    return (
    <div style={{gap: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <p>Link (insert number here):</p>
        <input type="text" placeholder="Name"/>
        <input type="text" placeholder="URL"/>
        <button>Delete link</button>
    </div>
    );
  }

  export default Link;