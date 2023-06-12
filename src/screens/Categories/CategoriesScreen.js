import React, { useLayoutEffect, useContext } from "react";
import { FlatList, Text, View, Image, TouchableHighlight } from "react-native";
import styles from "./styles";
import { categories } from "../../data/dataArrays";

import MenuImage from "../../components/MenuImage/MenuImage";
import { TouchableOpacity } from "react-native-gesture-handler";
import RecipesContext from "../../DataContext/RecipesContext";

export default function CategoriesScreen(props) {
  const { navigation } = props;
  const recipes = useContext(RecipesContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
      },
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const getNum = (categoryId) => {
    let count = 0;
    recipes.map((data) => {
      if (data.categoryId == categoryId) {
        count++;
      }
    });
    return count;
  };

  const onPressCategory = (item) => {
    const title = item.name;
    const category = item;
    navigation.navigate("RecipesList", { category, title });
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      underlayColor="rgba(73,182,77,0.9)"
      onPress={() => onPressCategory(item)}
    >
      <View style={styles.categoriesItemContainer}>
        <Image
          style={styles.categoriesPhoto}
          source={{ uri: item.photo_url }}
        />
        <Text style={styles.categoriesName}>{item.name}</Text>
        <Text style={styles.categoriesInfo}>{getNum(item.id)} recipes</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  );
}
