import React, { useState, useEffect } from "react";
import AppContainer from "./src/navigations/AppNavigation";
import axios from "axios";
import RecipesContext from "./src/DataContext/RecipesContext";
import { API_DOMAIN } from "./config";

export default function App() {
  const [recipes, setRecipes] = useState([]);

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
    <RecipesContext.Provider value={recipes}>
      <AppContainer />
    </RecipesContext.Provider>
  );
}
