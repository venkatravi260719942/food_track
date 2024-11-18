import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo_bg.svg";
import "../../styles/admin/overview.css";
import "../../styles/admin/animatedPage.css";
import { Button, CardActionArea } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBasket,
  faReceipt,
  faTruckField,
  faPeopleRoof,
} from "@fortawesome/free-solid-svg-icons";

function Overview() {
  const [animation, setAnimation] = useState(false);
  const [isScrollable, setIsScrollable] = useState(true);
  const navigate = useNavigate();
  const downContentRef = useRef(null);
  useEffect(() => {
    setAnimation(true);
    setTimeout(() => {
      setAnimation(false);
    }, 6000);
  }, []);

  const handleLearnMoreClick = () => {
    setIsScrollable(true);
    if (downContentRef.current) {
      downContentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {animation ? (
        <body className={animation ? "animatedScreen" : ""}>
          <div>
            <div className="container2">
              <div className="bubbles">
                <span style={{ "--i": 11 }}></span>
                <span style={{ "--i": 12 }}></span>
                <span style={{ "--i": 24 }}></span>
                <span style={{ "--i": 10 }}></span>
                <span style={{ "--i": 14 }}></span>
                <span style={{ "--i": 23 }}></span>
                <span style={{ "--i": 18 }}></span>
                <span style={{ "--i": 16 }}></span>
                <span style={{ "--i": 19 }}></span>
                <span style={{ "--i": 20 }}></span>
                <span style={{ "--i": 22 }}></span>
                <span style={{ "--i": 25 }}></span>
                <span style={{ "--i": 18 }}></span>
                <span style={{ "--i": 21 }}></span>
                <span style={{ "--i": 15 }}></span>
                <span style={{ "--i": 13 }}></span>
                <span style={{ "--i": 26 }}></span>
                <span style={{ "--i": 17 }}></span>
                <span style={{ "--i": 13 }}></span>
                <span style={{ "--i": 28 }}></span>
                <span style={{ "--i": 11 }}></span>
                <span style={{ "--i": 12 }}></span>
                <span style={{ "--i": 24 }}></span>
                <span style={{ "--i": 10 }}></span>
                <span style={{ "--i": 14 }}></span>
                <span style={{ "--i": 23 }}></span>
                <span style={{ "--i": 18 }}></span>
                <span style={{ "--i": 16 }}></span>
                <span style={{ "--i": 19 }}></span>
                <span style={{ "--i": 20 }}></span>
                <span style={{ "--i": 22 }}></span>
                <span style={{ "--i": 25 }}></span>
                <span style={{ "--i": 18 }}></span>
                <span style={{ "--i": 21 }}></span>
                <span style={{ "--i": 15 }}></span>
                <span style={{ "--i": 13 }}></span>
                <span style={{ "--i": 26 }}></span>
                <span style={{ "--i": 17 }}></span>
                <span style={{ "--i": 13 }}></span>
                <span style={{ "--i": 28 }}></span>
              </div>
            </div>
            <div className="container0">
              <span className="text1">Welcome to</span>
              <span className="text2">Food tracz</span>
            </div>
          </div>
        </body>
      ) : (
        <div className={isScrollable ? "" : "no-scroll"}>
          <div style={{ margin: "5px" }}>
            <div className="logo">
              <img alt="company_logo" src={logo} />
            </div>
            <div className="content">
              <div className="left_content">
                <div style={{ opacity: 1 }}>
                  <h1>Cutting-Edge Inventory Management Solutions!</h1>
                  <br></br>
                  <h3>
                    Our software is designed giving real-time visibility into
                    stock levels, order status, and supply chain activities.
                    With Foodtracz, you can optimize your inventory, reduce
                    holding costs, and more.
                  </h3>
                  <br></br>
                  <h3>Build Strong relationships with your suppliers</h3>
                  <br></br>
                  <h3>Revaluate your vendor's prices and value often</h3>
                  <br></br>
                  <h3>Ensure you have sufficient supplies before promotions</h3>
                  <br></br>
                  <h3>Boost restaurant performance with software</h3>
                  <br></br>
                  <h3>Keep track of food safety</h3>
                  <br></br>
                  <Button
                    className="getstarted_button"
                    type="submit"
                    variant="contained"
                    style={{
                      backgroundColor: "#0A8CCD",
                      color: "#FFFFFF",
                      textTransform: "none",
                    }}
                    data-testid="getstarted_button"
                    id="getstarted_button"
                    onClick={() => {
                      navigate("/organisationRegistration");
                    }}
                  >
                    Get started
                  </Button>
                  <Button
                    className="Learnmore_button"
                    type="submit"
                    variant="contained"
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "#151313",
                      textTransform: "none",
                      marginLeft: "10px",
                    }}
                    data-testid="Learnmore_button"
                    id="Learnmore_button"
                    onClick={handleLearnMoreClick}
                  >
                    Learn more
                  </Button>
                </div>
              </div>
              <div className="right_content">
                {/* <img alt="intro_img" src={intro} /> */}
              </div>
            </div>
          </div>
          <div
            ref={downContentRef}
            className={`down_content ${isScrollable ? "visible" : ""}`}
          >
            <div className="centered-text-container">
              <p className="features">FEATURES</p>
            </div>
            <div className="centered-text-container">
              <h1 style={{ margin: "0px" }}>
                Unlock Excellence For Optimal Management
              </h1>
            </div>
            <div className="centered-text-container">
              <h3
                style={{
                  paddingLeft: "15vw",
                  paddingRight: "15vw",
                  fontWeight: 400,
                }}
              >
                Enhance your Inventory Management with our feature-rich
                platform. Achieve real-time visibility, simplify supplier
                management and make data-driven decisions with our analytics
                tools. Optimize your inventory, reduce costs, and elevate your
                business operations
              </h3>
            </div>
            <div className="card_content">
              <Card
                sx={{
                  maxWidth: 300,
                  margin: "10px",
                  border: "3px solid #BADD5A",
                  borderRadius: "10px",
                }}
              >
                <CardActionArea>
                  <div className="overview_image">
                    <FontAwesomeIcon
                      icon={faShoppingBasket}
                      size="3x"
                      style={{
                        border: "3px solid #BADD5A",
                        marginTop: "20px",
                        padding: "15px",
                        borderRadius: "10px",
                        height: "45px",
                        backgroundColor: "#EAF5CA",
                        color: "#BADD5A",
                      }}
                    />
                  </div>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Product - management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      "Experience the seamless orchestration of product
                      lifecycles with our comprehensive management solutions,
                      designed to streamline workflows, enhance collaboration,
                      and drive unparalleled success in every phase."
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card
                sx={{
                  maxWidth: 300,
                  margin: "10px",
                  border: "3px solid #FF8F80",
                  borderRadius: "10px",
                }}
              >
                <CardActionArea>
                  <div className="overview_image">
                    <FontAwesomeIcon
                      icon={faPeopleRoof}
                      size="3x"
                      style={{
                        border: "3px solid #FF8F80",
                        marginTop: "20px",
                        padding: "15px",
                        borderRadius: "10px",
                        height: "45px",
                        backgroundColor: "#FFDEDA",
                        color: "#FF8F80",
                      }}
                    />
                  </div>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      User - management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      "Effortlessly manage your user base with our intuitive
                      platform, offering robust tools for user authentication,
                      access control, and personalized engagement, empowering
                      you to deliver exceptional user experiences every step of
                      the way."
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card
                sx={{
                  maxWidth: 300,
                  margin: "10px",
                  border: "3px solid #bd9fee",
                  borderRadius: "10px",
                }}
              >
                <CardActionArea>
                  <div className="overview_image">
                    <FontAwesomeIcon
                      icon={faTruckField}
                      size="3x"
                      style={{
                        border: "3px solid #bd9fee",
                        marginTop: "20px",
                        padding: "15px",
                        borderRadius: "10px",
                        height: "45px",
                        backgroundColor: "#ECE3FA",
                        color: "#bd9fee",
                      }}
                    />
                  </div>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Supplier - management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      "Optimize your supplier relationships and streamline
                      procurement processes with our advanced supplier
                      management platform, providing comprehensive tools for
                      sourcing, vendor performance tracking, and strategic
                      collaboration, ensuring seamless supply chain operations
                      and enhanced business agility."
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card
                sx={{
                  maxWidth: 300,
                  margin: "10px",
                  border: "3px solid #9FE7FC",
                  borderRadius: "10px",
                }}
              >
                <CardActionArea>
                  <div className="overview_image">
                    <FontAwesomeIcon
                      icon={faReceipt}
                      size="3x"
                      style={{
                        marginTop: "20px",
                        padding: "15px",
                        borderRadius: "10px",
                        height: "45px",
                        width: "45px",
                        border: "3px solid #9FE7FC",
                        backgroundColor: "#F7FDFE",
                        color: "#9FE7FC",
                      }}
                    />
                  </div>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Finance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      "Gain control and insight into your financial landscape
                      with our comprehensive financial management solutions,
                      offering real-time visibility, intelligent forecasting,
                      and strategic planning tools to drive financial health and
                      success for your business."
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Overview;
