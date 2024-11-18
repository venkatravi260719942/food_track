// Import required modules and functions
import axios from "axios";
import "../../styles/generalSetting.css";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelopeCircleCheck,
  faPaperPlane,
  faHourglassStart,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/url.config";
import {
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
} from "@mui/material";

import Cookies from "js-cookie";
import i18next from "i18next";
import { Trans, useTranslation } from "react-i18next";
import { useLanguage } from "../../LanguageContext";
import { styled } from "@mui/system";
// Storing required values in the session storage
const StyledFormControlGeneralSetting = styled(FormControl)(({ theme }) => ({
  margin: 0,
  minWidth: 250,
}));
const StyledSelectGeneralSetting = styled(Select)(({ theme }) => ({
  borderRadius: "8px",
  // Add additional styles if needed
}));
function GeneralSettings({ setOption }) {
  // State variables for the component
  const [email, setEmail] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [mailValid, setMailValid] = useState(true);
  const [trigger, setTrigger] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  const [cookiesData, setCookiesData] = useState();
  const [userDetails, setuserDetails] = useState();

  // Fetch list of pending invitations
  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const fetchData = async () => {
      const response = await axios.get(
        `${API_ENDPOINTS.generalSettings.pendingInvites}/${storedData.organisationId}`,
        {
          headers: {
            Authorization: `Bearer ${storedData.token}`,
          },
        }
      );
      setInvitedUsers(response.data);
    };

    fetchData();
  }, [trigger]);

  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const fetchData = async () => {
      const response = await axios.get(API_ENDPOINTS.organisation.language, {
        headers: {
          Authorization: `Bearer ${storedData.token}`,
        },
      });
      setLanguages(response.data);
      const getUserData = await axios.get(
        `${API_ENDPOINTS.auth.user}/${storedData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${storedData.token}`,
          },
        }
      );
      setuserDetails(getUserData.data);
      const selectedLanguage = getUserData.data.Language[0];
      setSelectedLanguageId(selectedLanguage.languageId);
      changeLanguage(selectedLanguage.languageName);
      i18next.changeLanguage(selectedLanguage.languageName);
    };
    fetchData();
  }, []);

  // Email validation function using regex
  const validateEmail = (email) => {
    const re = /^([a-zA-Z0-9.-]+)@([a-zA-Z.-]+)\.([a-zA-Z.-]+)$/;
    return re.test(email);
  };

  // Function to check if user already exist
  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(
        `${
          API_ENDPOINTS.generalSettings.userExist
        }?email=${email}&organisationId=${parseInt(
          cookiesData.organisationId
        )}`,
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  // Handle keydown events on an input field, if Enter is pressed, call the handleSend function.
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  // Handle sending invitation email
  const handleSend = async () => {
    // Validate email format
    if (!email || !validateEmail(email)) {
      setMailValid(!mailValid);
      return;
    }

    // Check if user already exists
    if (await checkEmailExists(email)) {
      toast.error("User already exists!", {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // Showing loading toast
    const id = toast.loading("Sending an email");
    const payload = {
      email,
    };

    // Sending an invitation email and add user to database
    try {
      // Sending an invitation email
      const response = await axios.post(
        API_ENDPOINTS.generalSettings.sendInviteMail,
        payload,
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );

      if (response.status === 200) {
        setEmail("");
        toast.update(id, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
        });
        const userBranchPayload = {
          organisationId: parseInt(cookiesData.organisationId),
          email,
          isInvited: true,
          isAccepted: false,
        };
        // Add user to database
        try {
          await axios.post(
            API_ENDPOINTS.generalSettings.postUsers,
            userBranchPayload,
            {
              headers: {
                Authorization: `Bearer ${cookiesData.token}`,
              },
            }
          );
          setTrigger(!trigger); // Trigger re-fetch of invited users
        } catch (error) {
          throw new Error(error);
        }
      } else {
        // Update toast to error
        toast.update(id, {
          render: "Failed to send email",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      // Handle errors and show appropriate toast message
      let message = "Failed to send email";
      let type = "error";

      if (error.response) {
        if (error.response.status === 400) {
          message = error.response.data.message;
          type = "warning";
        } else {
          message = error.response.data.message || message;
        }
      }
      // Update toast to error
      toast.update(id, {
        render: message,
        type,
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
      });
    }
  };

  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const handleChange = (event) => {
    setSelectedLanguageId(event.target.value);
  };

  const ChangeDefaultlanguage = async (value) => {
    const response = await axios.put(
      `${API_ENDPOINTS.auth.user}/${cookiesData.userId}`,
      { languageId: value },
      {
        headers: {
          Authorization: `Bearer ${cookiesData.token}`,
        },
      }
    );
    if (response.status == 200) {
      setLanguageOpen(false);
      window.location.reload();
    }
  };
  const [languageOpen, setLanguageOpen] = useState(false);
  const handleClickOpen = () => {
    setLanguageOpen(true);
  };

  const handleClose = () => {
    setLanguageOpen(false);
  };
  return (
    <div>
      <div className="titlebox">
        <div className="title">
          <Link to="/admin" style={{ backgroundColor: "transparent" }}>
            <button onClick={() => setOption("Home")}>
              <span>
                <FontAwesomeIcon
                  className="fa-fw"
                  icon={faArrowLeft}
                  size="xs"
                  style={{ color: "#000000" }}
                />
              </span>
            </button>
          </Link>
          <span>{t("generalSettings.text.generalSettings")}</span>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ margin: "50px 0px 0px 70px" }}
      />
      <div className="user_manage">
        <span>{t("generalSettings.text.users")}</span>
        <Link
          to="/admin/manage_users"
          style={{ backgroundColor: "transparent" }}
        >
          <button id="manage_btn">{t("generalSettings.buttons.manage")}</button>
        </Link>
      </div>
      <div className="invite_main">
        <div className="invite_user">
          <div className="invite_title">
            <h3>{t("generalSettings.text.inviteNewUsers")}</h3>
            <span>
              <FontAwesomeIcon
                className="fa-fw"
                icon={faEnvelopeCircleCheck}
                size="xl"
                style={{ color: "#248CE7" }}
              />
            </span>
          </div>
          <div className="invite_section">
            <span>{t("generalSettings.text.emailAddress")}</span>
            <div
              className="invite_box"
              style={{
                border: `1px solid ${
                  mailValid ? (isFocused ? "#0A8CCD" : "#858585") : "red"
                }`, // Use red border if email is invalid
              }}
            >
              <input
                id="email-box"
                data-testid="email-box"
                type="text"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMailValid(true);
                }}
                value={email}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
              />
              <button
                id="email-send-btn"
                data-testid="email-send-btn"
                onClick={handleSend}
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  size="lg"
                  color={
                    mailValid ? (isFocused ? "#248CE7" : "#B7B4B4") : "#ff3333"
                  }
                />
              </button>
            </div>
            {!mailValid && (
              <div id="errmsg" data-testid="errmsg" className="errmsg">
                <span>{t("generalSettings.errors.validEmail")}</span>
              </div>
            )}
          </div>
        </div>
        <div className="vertical"></div>
        <div className="pending_user">
          <div className="pending_title">
            <h3>{t("generalSettings.text.pendingInvitations")}</h3>
            <span>
              <FontAwesomeIcon
                className="fa-fw"
                icon={faHourglassStart}
                size="xl"
                style={{ color: "#CF950B" }}
              />
            </span>
          </div>
          <div id="pending_userbox" className="pending_userbox">
            {invitedUsers.map((obj) => {
              return <p key={obj.key}>{obj.email}</p>;
            })}
          </div>
        </div>
      </div>
      <div className="lang_box">
        <div className="lang_title">
          <span>{t("generalSettings.text.language")}</span>
        </div>
      </div>
      <div className="language">
        <div className="lang_section">
          <div className="lang_title">
            <h4>{t("generalSettings.text.availableLanguages")}</h4>
          </div>
          {/* <div className="status_btn">
            <button></button>
          </div> */}
        </div>
        <div className="add_lang">
          <StyledFormControlGeneralSetting size="small">
            <StyledSelectGeneralSetting
              value={selectedLanguageId}
              onChange={(lang) => {
                handleChange(lang);
              }}
            >
              {languages.map((lang) => {
                return (
                  <MenuItem key={lang.languageId} value={lang.languageId}>
                    {lang.languageName}
                  </MenuItem>
                );
              })}
            </StyledSelectGeneralSetting>
          </StyledFormControlGeneralSetting>
          <button onClick={handleClickOpen}>
            {t("generalSettings.buttons.setDefault")}
          </button>
          <Dialog
            open={languageOpen}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              {t("generalSettings.text.changeLangDialog")}
            </DialogTitle>

            <DialogActions>
              <Button variant="outlined" autoFocus onClick={handleClose}>
                {t("generalSettings.buttons.noBtn")}
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => {
                  ChangeDefaultlanguage(selectedLanguageId);
                }}
                autoFocus
              >
                {t("generalSettings.buttons.yesBtn")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

// Export the required functions
export default GeneralSettings;
