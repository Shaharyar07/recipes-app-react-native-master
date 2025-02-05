import React, { useLayoutEffect, useRef, useState, useEffect, useContext } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
} from "react-native";
import styles from "./styles";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  getIngredientName,
  getCategoryName,
  getCategoryById,
} from "../../data/MockDataAPI";
import BackButton from "../../components/BackButton/BackButton";
import ViewIngredientsButton from "../../components/ViewIngredientsButton/ViewIngredientsButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import { Alert } from "react-native";
import { API_DOMAIN } from "../../../config";
import themeContext from "../Themes/themeContext";

const { width: viewportWidth } = Dimensions.get("window");

export default function RecipeScreen(props) {
  const theme = useContext(themeContext);
  const { navigation, route } = props;
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log("Themes:", theme);
    var tempTheme = theme;
    if (tempTheme.theme === "light") {
      setDarkMode(false);
    } else if (tempTheme.theme === "dark") {
      setDarkMode(true);
    }
  });

  const item = route.params?.item;
  const category = getCategoryById(item.categoryId);
  const title = getCategoryName(category.id);

  const [activeSlide, setActiveSlide] = useState(0);

  const slider1Ref = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: "true",
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => <View />,
    });
  }, []);

  const renderImage = ({ item }) => (
    <TouchableHighlight>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item }} />
      </View>
    </TouchableHighlight>
  );

  const onPressIngredient = (item) => {
    var name = getIngredientName(item);
    let ingredient = item;
    navigation.navigate("Ingredient", { ingredient, name });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API_DOMAIN}/delete-recipe-id/${id}`)
      .then(() => {
        navigation.navigate("Home");
        Alert.alert("Deleted", "Recipe deleted", [{ text: "OK" }]);
      })
      .catch(() => {
        navigation.navigate("Home");
        Alert.alert("Error", "Recipe not deleted", [{ text: "OK" }]);
      });
  };

  const handleEdit = (item) => {
    navigation.navigate("Update Recipe", { item });
  };

  return (
    <ScrollView style={[styles.container, darkMode ? styles.pageBlack : null]}>
      <View style={styles.carouselContainer}>
        <View style={styles.carousel}>
          <Carousel
            ref={slider1Ref}
            data={item.photosArray}
            renderItem={renderImage}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            firstItem={0}
            loop={false}
            autoplay={false}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={(index) => setActiveSlide(0)}
          />
          <Pagination
            dotsLength={item.photosArray.length}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            dotColor='rgba(255, 255, 255, 0.92)'
            dotStyle={styles.paginationDot}
            inactiveDotColor='white'
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={slider1Ref.current}
            tappableDots={!!slider1Ref.current}
          />
        </View>
      </View>
      <View style={styles.infoRecipeContainer}>
        <Text style={styles.infoRecipeName}>{item.title}</Text>
        <View style={styles.infoContainer}>
          <TouchableHighlight
            onPress={() =>
              navigation.navigate("RecipesList", { category, title })
            }
          >
            <Text style={styles.category}>
              {getCategoryName(item.categoryId).toUpperCase()}
            </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.infoContainer}>
          <Image
            style={styles.infoPhoto}
            source={require("../../../assets/icons/time.png")}
          />
          <Text style={styles.infoRecipe}>{item.time} minutes </Text>
        </View>

        <View style={styles.infoContainer}>
          <ViewIngredientsButton
            onPress={() => {
              let ingredients = item.ingredients;
              let title = "Ingredients for " + item.title;
              navigation.navigate("IngredientsDetails", { ingredients, title });
            }}
          />
          <TouchableOpacity onPress={() => handleDelete(item.recipeId)}>
            <View style={styles.btnContainer}>
              <Text style={styles.btnText}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <TouchableOpacity
            underlayColor='rgba(73,182,77,0.9)'
            onPress={() => handleEdit(item)}
          >
            <View style={styles.btnContainerEdit}>
              <Text style={styles.btnTextEdit}>Edit</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoDescriptionRecipe}>{item.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
