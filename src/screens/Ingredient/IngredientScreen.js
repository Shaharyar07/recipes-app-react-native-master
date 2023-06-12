import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeArea,
} from "react-native";
import styles from "./styles";
import { getIngredientUrl, getCategoryName } from "../../data/MockDataAPI";
import RecipesContext from "../../DataContext/RecipesContext";

export default function IngredientScreen(props) {
  const { navigation, route } = props;
  const ingredientId = route.params?.ingredient.ingredientId;
  const ingredientUrl = getIngredientUrl(ingredientId);
  const ingredientName = route.params?.name;

  const recipesContext = useContext(RecipesContext);
  const [recipes, setRecipes] = useState(recipesContext);

  useEffect(() => {
    setRecipes(recipesContext);
  }, [recipesContext]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.name,
    });
  }, []);

  const getRecipesByIngredient = (ingredientId) => {
    const recipesArray = [];

    recipes.forEach((recipe) => {
      const foundIngredient = recipe.ingredients.find(
        (ingredient) => ingredient.ingredientId === ingredientId
      );

      if (foundIngredient) {
        recipesArray.push(recipe);
      }
    });
    return recipesArray;
  };

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const renderRecipes = ({ item }) => (
    <TouchableOpacity
      underlayColor="rgba(73,182,77,0.9)"
      onPress={() => onPressRecipe(item)}
    >
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.photo_url }} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{getCategoryName(item.categoryId)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView>
        <View
          style={{
            borderBottomWidth: 0.4,
            marginBottom: 10,
            borderBottomColor: "grey",
          }}
        >
          <Image
            style={styles.photoIngredient}
            source={{ uri: "" + ingredientUrl }}
          />
        </View>
        <Text style={styles.ingredientInfo}>
          Recipes with {ingredientName}:
        </Text>

        <View>
          <FlatList
            horizontal={true}
            showsVerticalScrollIndicator={false}
            data={getRecipesByIngredient(ingredientId)}
            renderItem={renderRecipes}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          />
        </View>
      </ScrollView>
    </>
  );
}
