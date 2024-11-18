import "../../styles/topbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/FTLogo.svg";

// import { searchData } from "./data.json";

function ManagerTopbar({ option, setOption }) {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="search">
        {option == "orderProcessing" && (
          <div
            className="side_logo"
            onClick={() => {
              setOption("home");
              navigate("/manager");
            }}
          >
            <img alt="company_logo" src={logo} />
          </div>
        )}

        <div className="FI_Searchbar">
          <input type="text" placeholder="type to search..."></input>
          <FontAwesomeIcon
            className="fa-fw FI_magnifyingGlass"
            size="2xl"
            icon={faMagnifyingGlass}
            style={{ color: "#858585" }}
          />
        </div>
      </div>
      <div className="topbar_right">
        <Link to={"notification"}>
          <div className="border">
            <button
              className={`top_btn ${option === "Notification" ? "active" : ""}`}
              onClick={() => {
                setOption("Notification");
              }}
              aria-label="Notification"
            >
              <FontAwesomeIcon className="fa-fw-2" icon={faBell} />
            </button>
          </div>
        </Link>
        <Link to={"profile"}>
          <div className="border">
            <button
              className={`top_btn ${option === "Profile" ? "active" : ""}`}
              onClick={() => {
                setOption("Profile");
              }}
              aria-label="Profile"
            >
              <FontAwesomeIcon
                style={{ width: "20px", height: "20px", margin: "8px" }}
                className="fa-fw-2"
                icon={faUser}
              />
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ManagerTopbar;
