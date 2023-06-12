import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  TouchableHighlight,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import { getCategoryName } from "../../data/MockDataAPI";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { API_DOMAIN } from "../../../config";

export default function HomeScreen(props) {
  const { navigation } = props;
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("asc");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
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

  const fetchRecipes = () => {
    setIsLoading(true);
    axios
      .get(`${API_DOMAIN}/get-all-recipes`)
      .then((response) => {
        setRecipes(response.data);
        setIsLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  const onPressRecipe = (item) => {
    navigation.navigate("Recipe", { item });
  };

  const onSortOptionChange = (option) => {
    setSortOption(option);
  };

  const sortRecipes = () => {
    const sorted = [...recipes];
    if (sortOption === "asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "desc") {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === "timeasc") {
      sorted.sort((a, b) => a.time - b.time);
    } else if (sortOption === "timedesc") {
      sorted.sort((a, b) => b.time - a.time);
    }
    return sorted;
  };

  const renderRecipes = ({ item }) => (
    <TouchableOpacity onPress={() => onPressRecipe(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.photo_url }} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{getCategoryName(item.categoryId)}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecipes();
  };

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
      ) : (
        <>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Sort:</Text>
            <Picker
              selectedValue={sortOption}
              style={styles.picker}
              onValueChange={onSortOptionChange}
            >
              <Picker.Item label="A → Z" value="asc" />
              <Picker.Item label="Z → A" value="desc" />
              <Picker.Item label="Cooking time Ascending" value="timeasc" />
              <Picker.Item label="Cooking time Descending" value="timedesc" />
            </Picker>
          </View>

          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={sortRecipes()}
            renderItem={renderRecipes}
            keyExtractor={(item) => `${item.recipeId}`}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        </>
      )}
    </>
  );
}
