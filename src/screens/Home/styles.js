import { StyleSheet } from "react-native";
import { RecipeCard } from "../../AppStyles";

const styles = StyleSheet.create({
  container: RecipeCard.container,
  photo: RecipeCard.photo,
  title: RecipeCard.title,
  category: RecipeCard.category,
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: "grey",
  },
  picker: {
    flex: 1,
    height: 40,
    color: "grey",
  },
  pageBlack: {
    backgroundColor: "black",
    color: "#FAF9F6",
  },
});

export default styles;
