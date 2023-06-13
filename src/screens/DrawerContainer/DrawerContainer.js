import React, { useState } from "react";
import { View, Switch, StyleSheet, Image, Text } from "react-native";
import PropTypes from "prop-types";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import MenuButton from "../../components/MenuButton/MenuButton";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../Themes/themeContext";
import theme from "../Themes/theme";

export default function DrawerContainer(props) {
  const [colorMode, setColorMode] = useState(false);
  const { navigation } = props;
  return (
    <themeContext.Provider
      value={colorMode === true ? theme.dark : theme.light}
    >
      <View style={[styles.content, colorMode ? styles.dark : styles.light]}>
        <View style={styles.container}>
          <MenuButton
            title='HOME'
            source={require("../../../assets/icons/home.png")}
            onPress={() => {
              navigation.navigate("Home");
              navigation.closeDrawer();
            }}
          />
          <MenuButton
            title='CATEGORIES'
            source={require("../../../assets/icons/category.png")}
            onPress={() => {
              navigation.navigate("Categories");
              navigation.closeDrawer();
            }}
          />
          <MenuButton
            title='SEARCH'
            source={require("../../../assets/icons/search.png")}
            onPress={() => {
              navigation.navigate("Search");
              navigation.closeDrawer();
            }}
          />

          <MenuButton
            title='Add Recipe'
            source={require("../../../assets/icons/addRecipe.png")}
            onPress={() => {
              navigation.navigate("Add Recipe");
              navigation.closeDrawer();
            }}
          />

          <View style={styles.containerDarkSwitch}>
            {/* <Image
              style={styles.photo}
              source={require("../../../assets/icons/darklight.png")}
            /> */}
            <Switch
              value={colorMode}
              style={styles.darkModeSwitch}
              onValueChange={(value) => {
                setColorMode(value);
                EventRegister.emit("changeTheme", value);
              }}
              trackColor={"#FFFFFF"}
              thumbColor={"#088F8F"}
              ios_backgroundColor='#3e3e3e'
            />
          </View>
        </View>
      </View>
    </themeContext.Provider>
  );
}
const styles = StyleSheet.create({
  darkMenu: {
    color: "white",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  darkModeSwitch: {
    marginTop: 5,
    marginLeft: 10,
  },
  photo: {
    marginLeft: 5,
    marginTop: 5,
    width: 30,
    height: 30,
    backgroundColor: "white",
  },
  dark: {
    backgroundColor: "black",
    color: "grey",
  },
  light: {
    backgroundColor: "white",
    color: "grey",
  },
  containerDarkSwitch: {
    flexDirection: "row",
  },
});
DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};
