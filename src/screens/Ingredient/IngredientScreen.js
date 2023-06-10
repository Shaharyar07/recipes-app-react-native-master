import React, { useLayoutEffect } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
  Image,
  TouchableHighlight,
  Touchable,
} from "react-native";
import styles from "./styles";
import {
  getIngredientUrl,
  getRecipesByIngredient,
  getCategoryName,
} from "../../data/MockDataAPI";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function IngredientScreen(props) {
  const { navigation, route } = props;

  const ingredientId = route.params?.ingredient;
  const ingredientUrl = getIngredientUrl(ingredientId);
  const ingredientName = route.params?.name;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.name,
    });
  }, []);

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
      <Text style={styles.ingredientInfo}>Recipes with {ingredientName}:</Text>
      <View>
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={getRecipesByIngredient(ingredientId)}
          renderItem={renderRecipes}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        />
      </View>
    </>
  );
}
