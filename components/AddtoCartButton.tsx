import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useCartStore } from "@/store/useCartStore";
import { YogaClass } from "@/types";
import Toast from "react-native-toast-message";

interface AddToCartButtonProps {
  item: YogaClass;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ item }) => {
  const { cart, addToCart } = useCartStore();

  const handleAddToCart = () => {
    const itemExists = cart.some(
      (cartItem: YogaClass) => cartItem.id === item.id
    );

    if (itemExists) {
      Toast.show({
        type: "info",
        text1: "Already in cart",
        text2: "This class is already in your cart",
        position: "bottom",
        visibilityTime: 2000,
        autoHide: true,
      });
    } else {
      addToCart(item);
      Toast.show({
        type: "success",
        text1: "Added to cart",
        text2: "Class has been added to your cart",
        position: "bottom",
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={handleAddToCart}
      className="bg-teal-500 px-6 py-3 rounded-full"
    >
      <Text className="text-white font-semibold text-center">Add to Cart</Text>
    </TouchableOpacity>
  );
};
