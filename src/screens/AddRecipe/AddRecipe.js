import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";
import { Alert } from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { ingredients, categories } from "../../data/dataArrays";
import { API_DOMAIN } from "../../../config";

const AddRecipe = ({ navigation }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const ingredientsList = ingredients;
  const categoryOptions = categories;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      keyboardDidShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      keyboardDidHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const keyboardDidShow = (event) => {
    setKeyboardVisible(true);
    setKeyboardOffset(event.endCoordinates.height);
  };

  const keyboardDidHide = () => {
    setKeyboardVisible(false);
    setKeyboardOffset(0);
  };

  const generateRandomId = () => {
    const randomId = Math.floor(Math.random() * 100000) + 1;
    return randomId;
  };

  const [recipe, setRecipe] = useState({
    recipeId: generateRandomId(),
    categoryId: "",
    title: "",
    photo_url: "",
    photosArray: [],
    time: "",
    ingredients: [],
    description: "",
  });

  const handleInputChange = (field, value) => {
    setRecipe({ ...recipe, [field]: value });
  };

  const handleTimeToMake = (value) => {
    const formattedNumber = value.replace(/[^0-9]/g, "");
    setRecipe({ ...recipe, time: formattedNumber });
  };

  const handleCategoryChange = (value) => {
    setRecipe({ ...recipe, categoryId: value });
  };

  const handleIngredientChange = (index, ingredientId) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = {
      ingredientId,
      quantity: updatedIngredients[index]
        ? updatedIngredients[index].quantity
        : "",
    };
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = {
      ingredientId: updatedIngredients[index]
        ? updatedIngredients[index].ingredientId
        : "",
      quantity,
    };
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const handlePrimaryPhotoSelect = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      const base64Data = await getBase64(result.uri);

      setRecipe({ ...recipe, photo_url: base64Data });
    } catch (error) {
      console.error("Error selecting primary photo:", error);
    }
  };

  const handleSecondaryPhotoSelect = async (index) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      const base64Data = await getBase64(result.uri);
      const updatedPhotos = [...recipe.photosArray];
      updatedPhotos[index] = base64Data;
      setRecipe({ ...recipe, photosArray: updatedPhotos });
    } catch (error) {
      console.error("Error selecting primary photo:", error);
    }
  };

  const getBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    axios
      .post(`${API_DOMAIN}/add-new-recipe`, recipe)
      .then(() => {
        setIsLoading(false);
        navigation.navigate("Home");
        Alert.alert("Success", "Recipe added successfully");
      })
      .catch(() => {
        setIsLoading(false);
        navigation.navigate("Home");
        Alert.alert(
          "Error",
          "Facing Some Error Adding Recipe, Please Try Again Later"
        );
      });
  };

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: keyboardOffset },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.label}>Recipe Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Recipe Title"
              value={recipe.title}
              onChangeText={(value) => handleInputChange("title", value)}
            />

            <Text style={styles.label}>Select Category</Text>
            <Picker
              selectedValue={recipe.categoryId}
              style={styles.picker}
              onValueChange={(value) => handleCategoryChange(value)}
            >
              <Picker.Item label="Select Category" value="" />
              {categoryOptions.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>

            <Text style={styles.label}>Primary Photo</Text>
            {recipe.photo_url ? (
              <>
                <Image
                  source={{ uri: recipe.photo_url }}
                  style={styles.thumbnail}
                />
                <Button
                  title="Select Primary Photo"
                  onPress={handlePrimaryPhotoSelect}
                />
              </>
            ) : (
              <Button
                title="Select Primary Photo"
                onPress={handlePrimaryPhotoSelect}
              />
            )}

            <Text style={styles.label}>Add Secondary Photos</Text>
            {recipe.photosArray.map((photo, index) => (
              <View key={index}>
                {photo ? (
                  <>
                    <Image source={{ uri: photo }} style={styles.thumbnail} />
                    <Button
                      title={`Select Secondary Photo ${index + 1}`}
                      onPress={() => handleSecondaryPhotoSelect(index)}
                    />
                  </>
                ) : (
                  <Button
                    title={`Select Secondary Photo ${index + 1}`}
                    onPress={() => handleSecondaryPhotoSelect(index)}
                  />
                )}
              </View>
            ))}

            <TouchableHighlight
              underlayColor="rgba(73,182,77,0.9)"
              onPress={() => {
                const updatedPhotos = [...recipe.photosArray, ""];
                handleInputChange("photosArray", updatedPhotos);
              }}
              style={styles.buttonContainer}
            >
              <View>
                <Text style={styles.text}>ADD PHOTO</Text>
              </View>
            </TouchableHighlight>

            <Text style={styles.label}>Time to Make In Minutes</Text>
            <TextInput
              style={styles.input}
              placeholder="Time"
              value={recipe.time}
              onChangeText={(value) => handleTimeToMake(value)}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Select Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientContainer}>
                <Picker
                  style={styles.ingredientPicker}
                  selectedValue={ingredient.ingredientId}
                  onValueChange={(value) =>
                    handleIngredientChange(index, value)
                  }
                >
                  <Picker.Item label="Select Ingredient" value="" />
                  {ingredientsList.map((ingredient) => (
                    <Picker.Item
                      key={ingredient.ingredientId}
                      label={ingredient.name}
                      value={ingredient.ingredientId}
                    />
                  ))}
                </Picker>

                <TextInput
                  style={styles.quantityInput}
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  onChangeText={(value) => handleQuantityChange(index, value)}
                />
              </View>
            ))}

            <TouchableHighlight
              underlayColor="rgba(73,182,77,0.9)"
              onPress={() => {
                const updatedIngredients = [
                  ...recipe.ingredients,
                  { ingredientId: "", quantity: "" },
                ];
                handleInputChange("ingredients", updatedIngredients);
              }}
              style={styles.buttonContainer}
            >
              <View>
                <Text style={styles.text}>ADD INGREDIENT</Text>
              </View>
            </TouchableHighlight>

            <View>
              <Text style={styles.label}>Add Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={recipe.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
                multiline
              />
            </View>
            <TouchableHighlight
              underlayColor="rgba(73,182,77,0.9)"
              onPress={handleSubmit}
              style={styles.buttonContainer}
            >
              <View>
                <Text style={styles.text}>SUBMIT</Text>
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    height: 50,
    width: 170,
    marginTop: 5,
    marginLeft: "25%",
    marginRight: 10,
    marginBottom: 20,
    borderRadius: 100,
    borderColor: "blue",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "blue",
  },

  submitButton: {
    color: "red",
  },

  label: {
    marginBottom: 8,
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },

  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  picker: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ingredientPicker: {
    flex: 3,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  quantityInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  thumbnail: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginBottom: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
});

export default AddRecipe;
