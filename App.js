import React, { useState, useEffect } from "react";
import AppContainer from "./src/navigations/AppNavigation";
import axios from "axios";
import RecipesContext from "./src/DataContext/RecipesContext";
import { API_DOMAIN } from "./config";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "./src/screens/Themes/themeContext";
import theme from "./src/screens/Themes/theme";
export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [colorMode, setColorMode] = useState(false);

  useEffect(() => {
    let eventListener = EventRegister.addEventListener(
      "changeTheme",
      (data) => {
        setColorMode(data);
        console.log(data);
      }
    );
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${API_DOMAIN}/get-all-recipes`)
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [recipes]);

  return (
    <themeContext.Provider
      value={colorMode === true ? theme.dark : theme.light}
    >
      <RecipesContext.Provider value={recipes}>
        <AppContainer />
      </RecipesContext.Provider>
    </themeContext.Provider>
  );
}
