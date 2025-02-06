import Link from "../Link";

function LinkManager() {
    return (
        <div style={{gap: "10px", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center"}}>
            <Link/>
            <Link/>
            <button>Add Link</button>
        </div>
    );
  }

  export default LinkManager;