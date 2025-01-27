import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/Home/HomeScreen";
import CategoriesScreen from "../screens/Categories/CategoriesScreen";
import RecipeScreen from "../screens/Recipe/RecipeScreen";
import RecipesListScreen from "../screens/RecipesList/RecipesListScreen";
import DrawerContainer from "../screens/DrawerContainer/DrawerContainer";
import IngredientScreen from "../screens/Ingredient/IngredientScreen";
import SearchScreen from "../screens/Search/SearchScreen";
import IngredientsDetailsScreen from "../screens/IngredientsDetails/IngredientsDetailsScreen";
import AddRecipe from "../screens/AddRecipe/AddRecipe";
import UpdateRecipe from "../screens/UpdateRecipe/UpdateRecipe";
import themeContext from "../screens/Themes/themeContext";

const Stack = createStackNavigator();

function MainNavigator() {
  const theme = useContext(themeContext);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    var tempTheme = theme;
    if (tempTheme.theme === "light") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  });

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "green" },
        headerTintColor: "white",

        headerTitleStyle: darkMode ? { color: "white" } : null,
        cardStyle: { backgroundColor: darkMode ? "black" : "white" },
      }}
    >
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Categories' component={CategoriesScreen} />
      <Stack.Screen name='Recipe' component={RecipeScreen} />
      <Stack.Screen name='RecipesList' component={RecipesListScreen} />
      <Stack.Screen name='Ingredient' component={IngredientScreen} />
      <Stack.Screen name='Search' component={SearchScreen} />
      <Stack.Screen name='Add Recipe' component={AddRecipe} />
      <Stack.Screen name='Update Recipe' component={UpdateRecipe} />
      <Stack.Screen
        name='IngredientsDetails'
        component={IngredientsDetailsScreen}
      />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

function DrawerStack() {
  return (
    <Drawer.Navigator
      drawerPosition='left'
      initialRouteName='Main'
      drawerStyle={{
        width: 250,
      }}
      screenOptions={{
        headerShown: false,

        headerTintColor: "white",

        headerTitleStyle: { fontWeight: "bold" },
      }}
      drawerContent={({ navigation }) => (
        <DrawerContainer navigation={navigation} />
      )}
    >
      <Drawer.Screen name='Main' component={MainNavigator} />
    </Drawer.Navigator>
  );
}

export default function AppContainer() {
  return (
    <NavigationContainer>
      <DrawerStack />
    </NavigationContainer>
  );
}

console.disableYellowBox = true;
