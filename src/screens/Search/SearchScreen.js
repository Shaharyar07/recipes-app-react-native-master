import React, { useEffect, useLayoutEffect, useState, useContext } from "react";
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableHighlight,
  Pressable,
  TouchableOpacity,
} from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import {
  getCategoryName,
  getRecipesByIngredientName,
} from "../../data/MockDataAPI";
import { TextInput } from "react-native-gesture-handler";
import RecipesContext from "../../DataContext/RecipesContext";
import { categories, ingredients } from "./../../data/dataArrays";

export default function SearchScreen(props) {
  const { navigation } = props;
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);

  const recipes = useContext(RecipesContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerTitle: () => (
        <View style={styles.searchContainer}>
          <Image
            style={styles.searchIcon}
            source={require("../../../assets/icons/search.png")}
          />
          <TextInput
            style={styles.searchInput}
            onChangeText={handleSearch}
            value={value}
          />
          <Pressable onPress={() => handleSearch("")}>
            <Image
              style={styles.searchIcon}
              source={require("../../../assets/icons/close.png")}
            />
          </Pressable>
        </View>
      ),
      headerRight: () => <View />,
    });
  }, [value]);

  useEffect(() => {}, [value]);

  const getRecipesByIngredientName = (ingredientName) => {
    const nameUpper = ingredientName.toUpperCase();
    const recipesArray = [];
    ingredients.map((data) => {
      if (data.name.toUpperCase().includes(nameUpper)) {
        // data.name.yoUpperCase() == nameUpper
        const recipes = getRecipesByIngredient(data.ingredientId);
        const unique = [...new Set(recipes)];
        unique.map((item) => {
          recipesArray.push(item);
        });
      }
    });
    const uniqueArray = [...new Set(recipesArray)];
    return uniqueArray;
  };

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

  const getRecipesByRecipeName = (recipeName) => {
    const nameUpper = recipeName.toUpperCase();
    const recipesArray = [];
    recipes.map((data) => {
      if (data.title.toUpperCase().includes(nameUpper)) {
        recipesArray.push(data);
      }
    });
    return recipesArray;
  };

  const getRecipes = (categoryId) => {
    const recipesArray = [];
    recipes.map((data) => {
      if (data.categoryId == categoryId) {
        recipesArray.push(data);
      }
    });
    return recipesArray;
  };

  const getRecipesByCategoryName = (categoryName) => {
    const nameUpper = categoryName.toUpperCase();
    const recipesArray = [];
    categories.map((data) => {
      if (data.name.toUpperCase().includes(nameUpper)) {
        const recipes = getRecipes(data.id); // return a vector of recipes
        recipes.map((item) => {
          recipesArray.push(item);
        });
      }
    });
    return recipesArray;
  };

  const handleSearch = (text) => {
    setValue(text);
    var recipeArray1 = getRecipesByRecipeName(text);
    var recipeArray2 = getRecipesByCategoryName(text);
    var recipeArray3 = getRecipesByIngredientName(text);
    var aux = recipeArray1.concat(recipeArray2);
    var recipeArray = [...new Set(aux)];

    if (text == "") {
      setData([]);
    } else {
      setData(recipeArray);
    }
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
    <View>
      <FlatList
        vertical
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={data}
        renderItem={renderRecipes}
        keyExtractor={(item) => `${item.recipeId}`}
      />
    </View>
  );
}
