import {
	View,
	Text,
	ScrollView,
	Image,
	TextInput,
	TouchableOpacity,
	Alert,
	Button
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
	BellIcon,
	MagnifyingGlassIcon,
	HeartIcon,
} from "react-native-heroicons/outline";
import Categories from "../components/categories";
import axios from "axios";
import Recipes from "../components/recipes";
export default function HomeScreen() {
	const [name, setName] = useState("");
	const [activeCategory, setActiveCategory] = useState("Beef");
	const [categories, setCategories] = useState([]);
	const [meals, setMeals] = useState([]);
	const [searchInput, setSearchInput] = useState("");
	const [text, setText] = useState("Recipes");
	const [noSearchedMeals, setNoSearchMeals] = useState(false);

	const navigation = useNavigation();

	useEffect(() => {
		getName();
		getCategories();
		getRecipes();
	}, []);

	const getName = async () => {
		const name = await AsyncStorage.getItem("name");
		if (name) {
			setName(name);
		}
	};

	const handleChangeCategory = (category) => {
		getRecipes(category);
		setActiveCategory(category);
		setMeals([]);
	};

	const getCategories = async () => {
		try {
			const response = await axios.get(
				"https://themealdb.com/api/json/v1/1/categories.php"
			);
			// console.log('got categories: ',response.data);
			if (response && response.data) {
				setCategories(response.data.categories);
			}
		} catch (err) {
			console.log("error: ", err.message);
		}
	};
	const getRecipes = async (category = "Beef") => {
		try {
			const response = await axios.get(
				`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`
			);
			// console.log('got recipes: ',response.data);
			if (response && response.data) {
				setMeals(response.data.meals);
				setText("Recipes");
			}
		} catch (err) {
			console.log("error: ", err.message);
		}
	};

	// debounce function
	function debounce(func, delay) {
		let timeoutId;

		return function (...args) {
			clearTimeout(timeoutId);

			timeoutId = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		};
	}

	const handleSearch = async () => {
		try {
			const response = await axios.get(
				`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`
			);
			// console.log('got recipes: ',response.data);
			if (response && response.data && response.data.meals) {
				setMeals(response.data.meals);
				setText("You searched for " + searchInput);
			} else if (response.data.meals === null) {
				setNoSearchMeals(true)
				setTimeout(()=> setNoSearchMeals(false), 3000)
			}
		} catch (err) {
			console.log("error: ", err.message);
		}
	};

	return (
		<View className="flex-1 bg-white">
			<StatusBar style="dark" />
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 50 }}
				className="space-y-6 pt-14"
			>
				{/* avatar and bell icon */}
				<View className="mx-4 flex-row justify-between items-center mb-2">
					<Image
						source={require("../../assets/images/avatar.png")}
						style={{ height: hp(5), width: hp(5.5) }}
					/>
					<View className="flex-row">
						<TouchableOpacity>
							<BellIcon size={hp(4)} color="gray" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => navigation.navigate("Favourite")}
						>
							<HeartIcon
								style={{ marginLeft: 20 }}
								size={hp(4)}
								color="red"
							/>
						</TouchableOpacity>
					</View>
				</View>

				{/* greetings and punchline */}
				<View className="mx-4 space-y-2 mb-2">
					<Text style={{ fontSize: hp(1.7) }} className="text-neutral-600">
						Hello, {name}!
					</Text>
					<View>
						<Text
							style={{ fontSize: hp(3.8) }}
							className="font-semibold text-neutral-600"
						>
							Make your own food,
						</Text>
					</View>
					<Text
						style={{ fontSize: hp(3.8) }}
						className="font-semibold text-neutral-600"
					>
						stay at <Text className="text-amber-400">home</Text>
					</Text>
				</View>

				{/* search bar */}
				<View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
					<TextInput
						placeholder="Search any recipe"
						placeholderTextColor={"gray"}
						value={searchInput}
						onChangeText={setSearchInput}
						onSubmitEditing={handleSearch}
						style={{ fontSize: hp(1.7) }}
						className="flex-1 text-base mb-1 pl-3 tracking-wider"
					/>
					<View className="bg-white rounded-full p-3">
						<TouchableOpacity onPress={handleSearch}>
							<MagnifyingGlassIcon
								size={hp(2.5)}
								strokeWidth={3}
								color="gray"
							/>
						</TouchableOpacity>
					</View>
				</View>

				{/* categories */}
				<View>
					{categories.length > 0 && (
						<Categories
							categories={categories}
							activeCategory={activeCategory}
							handleChangeCategory={handleChangeCategory}
						/>
					)}
				</View>

				{/* recipes */}
				<View>
					{!noSearchedMeals ? (
						<Recipes meals={meals} categories={categories} text={text} />
					) : (
						<View className="flex items-center space-y-2 mt-20">
							<Text
								style={{ fontSize: hp(3) }}
								className="font-bold text-neutral-500 tracking-widest mb-5"
							>
								No meals found for {searchInput}
							</Text>
							{/* <Button
								title="Refresh"
								color={"#fbbf24"}
								onPress={() => window.location.reload()}
							/> */}
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}
