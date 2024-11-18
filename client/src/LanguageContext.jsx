import { createContext, useState, useContext, useEffect } from "react";
import i18next from "i18next";
import axios from "axios";
import { API_ENDPOINTS } from "./config/url.config";
import Cookies from "js-cookie";

// Create a Context
const LanguageContext = createContext();

const useLanguage = () => {
  const { language, changeLanguage } = useContext(LanguageContext);
  return { language, changeLanguage };
};

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("English");
  const [cookiesData, setCookiesData] = useState();
  const [userDetails, setuserDetails] = useState();
  // Set initial language with i18next
  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);

    if (storedData && storedData.userId && storedData.token) {
      const getUserData = async () => {
        try {
          const response = await axios.get(
            `${API_ENDPOINTS.auth.user}/${parseInt(storedData.userId)}`,
            {
              headers: {
                Authorization: `Bearer ${storedData.token}`,
              },
            }
          );

          const selectedLanguage = response.data.Language[0].languageName;

          i18next.changeLanguage(selectedLanguage);
          setLanguage(selectedLanguage);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      getUserData();
    }
  }, [language]);
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);

    i18next.changeLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageProvider, useLanguage };
