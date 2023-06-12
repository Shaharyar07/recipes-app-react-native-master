import React, { useEffect, useLayoutEffect, useContext } from "react";
import { FlatList, Text, View, Image, TouchableOpacity } from "react-native";
import styles from "./styles";
import { getIngredientName, getAllIngredients } from "../../data/MockDataAPI";

export default function IngredientsDetailsScreen(props) {
  const { navigation, route } = props;

  const item = route.params?.ingredients;
  const ingredientsArray = getAllIngredients(item);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.title,
      headerTitleStyle: {
        fontSize: 16,
      },
    });
  }, [navigation, route.params]);

  const onPressIngredient = (ingredient) => {
    let name = getIngredientName(ingredient.ingredientId);

    navigation.navigate("Ingredient", { ingredient, name });
  };

  const renderIngredient = ({ item }) => (
    <TouchableOpacity
      underlayColor="rgba(73,182,77,0.9)"
      onPress={() => onPressIngredient(item.ingredient)}
    >
      <View style={styles.container}>
        <Image
          style={styles.photo}
          source={{ uri: item.ingredient.photo_url }}
        />
        <Text style={styles.title}>{item.ingredient.name}</Text>
        <Text style={{ color: "grey" }}>{item.quantity}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={3}
        data={ingredientsArray}
        renderItem={renderIngredient}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
