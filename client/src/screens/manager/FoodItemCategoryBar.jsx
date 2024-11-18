import { Button, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDrumstickBite,
  faLeaf,
  faBowlRice,
  faCakeCandles,
  faMugHot,
  faWineGlass,
  faPercentage,
} from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import { styled } from "@mui/system"; // Import styled from MUI

import { categoriesIcon } from "../../config/constant";
const StyledCategoryBar = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  backgroundColor: "#FFFFFF",
  marginTop: "2%",
  width: "100%",
  paddingLeft: "20px",
}));

// Styled component for the category button
const StyledButton = styled(Button)(({ theme, selected }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textTransform: "none",
  padding: "0px",
  color: selected ? "#FEFEFE" : "#212121",
  fontSize: "14px",
  height: "90px",
  marginBottom: "7px",
  backgroundColor: selected ? "#0075FF" : "#FFFFFF",
}));

// const categoriesIcon = [
//   { category_name: "Appetizers", icon: faDrumstickBite },
//   { category_name: "Main Course", icon: faBowlRice },
//   { category_name: "Dessert", icon: faCakeCandles },
//   { category_name: "Beverage", icon: faWineGlass },
//   { category_name: "Cafe Selection", icon: faMugHot },
// ];

const CategoryBar = ({ categories, selectedCategory, onSelectCategory }) => {
  // Function to get the corresponding icon for a category
  const getCategoryIcon = (categoryName) => {
    const categoryIcon = categoriesIcon.find(
      (iconObj) => iconObj.category_name === categoryName
    );
    return categoryIcon ? categoryIcon.icon : null;
  };

  return (
    // <Box
    //   sx={{
    //     display: "flex",
    //     flexDirection: "column",
    //     justifyContent: "space-around",
    //     backgroundColor: "#FFFFFF",
    //     marginTop: "2%",
    //     width: "100%",
    //     paddingLeft: "20px",
    //   }}
    // >
    //   {categories.map((category) => (
    //     <Button
    //       key={category.categoryId}
    //       variant={
    //         selectedCategory === category.categoryId ? "contained" : "outlined"
    //       }
    //       onClick={() => onSelectCategory(category.categoryId)}
    //       sx={{
    //         display: "flex",
    //         flexDirection: "column", // Stack icon and text vertically
    //         alignItems: "center", // Center content horizontally
    //         justifyContent: "center", // Center content vertically
    //         textTransform: "none",
    //         padding: "0px",
    //         color:
    //           selectedCategory === category.categoryId ? "#FEFEFE" : "#212121",
    //         fontSize: "14px",
    //         height: "90px",
    //         marginBottom: "7px",
    //         backgroundColor:
    //           selectedCategory === category.categoryId ? "#0075FF" : "#FFFFFF",
    //       }}
    //     >
    //       <FontAwesomeIcon
    //         icon={getCategoryIcon(category.category)}
    //         size="2x"
    //       />
    //       {category.category}
    //     </Button>
    //   ))}
    //   {categories.length && (
    //     <Button
    //       variant="outlined"
    //       onClick={() => onSelectCategory("discount")}
    //       sx={{
    //         textTransform: "none",
    //         color: "#212121",
    //         fontSize: "14px",
    //         height: "100px",
    //         flexDirection: "column",
    //         alignItems: "center",
    //         justifyContent: "center",
    //       }}
    //     >
    //       <FontAwesomeIcon icon={faPercentage} size="2x" />
    //       Discount
    //     </Button>
    //   )}
    // </Box>
    <StyledCategoryBar>
      {categories.map((category) => (
        <StyledButton
          key={category.categoryId}
          variant={
            selectedCategory === category.categoryId ? "contained" : "outlined"
          }
          onClick={() => onSelectCategory(category.categoryId)}
          selected={selectedCategory === category.categoryId} // Pass selected state
        >
          <FontAwesomeIcon
            icon={getCategoryIcon(category.category)}
            size="2x"
          />
          {category.category}
        </StyledButton>
      ))}
      {categories.length > 0 && (
        <StyledButton
          variant="outlined"
          onClick={() => onSelectCategory("discount")}
          sx={{
            height: "100px",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesomeIcon icon={faPercentage} size="2x" />
          Discount
        </StyledButton>
      )}
    </StyledCategoryBar>
  );
};

export default CategoryBar;
