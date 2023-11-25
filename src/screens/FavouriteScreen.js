import {
	View,
	Text,
	Image,
	TextInput,
	ScrollView,
	TouchableOpacity,
	Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	BellIcon,
	MagnifyingGlassIcon,
	ArrowRightCircleIcon,
	ChevronLeftIcon,
} from "react-native-heroicons/outline";
import Recipes from "../components/recipes";

export default function FavouriteScreen() {
	const [name, setName] = useState("");
	const [meals, setMeals] = useState([]);
	const [categories, setCategories] = useState("all");

	const navigation = useNavigation();

	useEffect(() => {
		getName();
        getMeals();
	}, []);

	const getName = async () => {
		const name = await AsyncStorage.getItem("name");
		if (name) {
			setName(name);
		}
	};

	const getMeals = async () => {
		const favoriteRecipes = JSON.parse(await AsyncStorage.getItem("meals")) || [];
        console.log(favoriteRecipes);
        if(favoriteRecipes.length){
            setMeals(favoriteRecipes)
        }
	};
	return (
		<View className="flex-1 bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 50 }}
				className="space-y-6 pt-14"
			>
				{/* avatar and bell icon */}
				<View className="mx-4 flex-row justify-between items-center mb-2">
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						className="p-2 rounded-full  bg-gray-400"
					>
						<ChevronLeftIcon
							size={hp(3.5)}
							strokeWidth={4.5}
							color="#fbbf24"
						/>
					</TouchableOpacity>
					<Image
						source={require("../../assets/images/avatar.png")}
						style={{ height: hp(5), width: hp(5.5) }}
					/>
				</View>

				{/* greetings and punchline */}
				<View className="mx-4 space-y-2 mb-2">
					<Text
						style={{ fontSize: hp(1.7) }}
						className="text-neutral-600  text-right"
					>
						Hello, {name}!
					</Text>
					<View>
						<Text
							style={{ fontSize: hp(3.8) }}
							className="font-semibold text-neutral-600  text-right"
						>
							Make your own food,
						</Text>
					</View>
					<Text
						style={{ fontSize: hp(3.8) }}
						className="font-semibold text-neutral-600 text-right"
					>
						stay at <Text className="text-amber-500">home</Text>
					</Text>
				</View>

				{/* favourite recipes */}
				<View>
					{meals.length ? (
						<Recipes
							meals={meals}
							categories={categories}
							text="Favourite Recipes"
						/>
					) : (
						<View className="flex items-center space-y-2 mt-20">
							<Text
								style={{ fontSize: hp(3) }}
								className="font-bold text-neutral-500 tracking-widest mb-5"
							>
								You don't have any  favorite recipes...
							</Text>
                            <Button title="Back to home" color={"#fbbf24"} onPress={() => navigation.goBack()}/>
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}
