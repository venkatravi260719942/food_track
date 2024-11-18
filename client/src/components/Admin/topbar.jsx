import "../../styles/topbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { faSearchengin } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
// import { searchData } from "./data.json";

function Topbar({ option, setOption }) {
  return (
    <div className="topbar">
      <div className="search">
        <input type="text" />
        <button aria-label="Search">
          <FontAwesomeIcon
            className="fa-fw"
            size="2xl"
            icon={faSearchengin}
            style={{ color: "#000000" }}
          />
        </button>
      </div>
      <div className="topbar_right">
        <Link to={"general_setting"}>
          <div className="border">
            <button
              style={{ height: "36px", width: "36px" }}
              id="general_setting"
              className={`top_btn ${option == "Setting" ? "active" : ""}`}
              onClick={() => {
                setOption("Settings");
              }}
              aria-label="Settings"
            >
              <FontAwesomeIcon className="fa-fw" icon={faGear} />
            </button>
          </div>
        </Link>
        <Link to={"notification"}>
          <div className="border">
            <button
              style={{ height: "36px", width: "36px" }}
              id="notification"
              className={`top_btn ${option == "Notification" ? "active" : ""}`}
              onClick={() => {
                setOption("Notification");
              }}
              aria-label="Notification"
            >
              <FontAwesomeIcon className="fa-fw" icon={faBell} />
            </button>
          </div>
        </Link>
        <Link to={"Profile"}>
          <div className="border">
            <button
              style={{ height: "36px", width: "36px" }}
              id="notification"
              className={`top_btn ${option == "Profile" ? "active" : ""}`}
              onClick={() => {
                setOption("Profile");
              }}
              aria-label="Profile"
            >
              <FontAwesomeIcon className="fa-fw" icon={faUser} />
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Topbar;
