import { View, Text, Image, TextInput } from "react-native";
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
} from "react-native-heroicons/outline";

export default function WelcomeScreen() {
	const [name, setName] = useState(null);
  const [userName, setUserName] = useState("");

	const ring1padding = useSharedValue(0);
	const ring2padding = useSharedValue(0);

	const navigation = useNavigation();

	useEffect(() => {
		ring1padding.value = 0;
		ring2padding.value = 0;
		setTimeout(
			() => (ring1padding.value = withSpring(ring1padding.value + hp(5))),
			100
		);
		setTimeout(
			() => (ring2padding.value = withSpring(ring2padding.value + hp(5.5))),
			300
		);
		getName();

		// setTimeout(()=> navigation.navigate('Home'), 2500)
	}, []);

	const getName = async () => {
		const name = await AsyncStorage.getItem("name");
		setName(name);
    if(name){
      setTimeout(()=> navigation.navigate('Home'), 2000)
    }
	};
  const handelSetName = async () =>{
    await AsyncStorage.setItem("name", userName);
    setTimeout(()=> navigation.navigate('Home'), 1500)
  }
	return (
		<View className="flex-1 justify-center items-center space-y-10 bg-amber-500">
			<StatusBar style="light" />

			{/* logo image with rings */}
			<Animated.View
				className="bg-white/20 rounded-full"
				style={{ padding: ring2padding }}
			>
				<Animated.View
					className="bg-white/20 rounded-full"
					style={{ padding: ring1padding }}
				>
					<Image
						source={require("../../assets/images/welcome.png")}
						style={{ width: hp(20), height: hp(20) }}
					/>
				</Animated.View>
			</Animated.View>

			{/* Name Input */}
			{name ? (
				<View className="flex items-center space-y-2">
					<Text
						style={{ fontSize: hp(2) }}
						className="font-medium text-white tracking-widest"
					>
						Welcome back {name}
					</Text>
				</View>
			) : (
				<Animated.View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px] ">
					<TextInput
						placeholder="Enter Your Name..."
						placeholderTextColor={"white"}
						style={{ fontSize: hp(1.7) }}
            value={userName}
            onChangeText={setUserName}
						className="flex-1 text-base mb-1 pl-3 tracking-wider"
					/>
					<View className="bg-white rounded-full p-1">
						<ArrowRightCircleIcon
							size={hp(5)}
							strokeWidth={1}
							color="gray"
              onPress={handelSetName}
						/>
					</View>
				</Animated.View>
			)}

			{/* title and punchline */}
			<View className="flex items-center space-y-2">
				<Text
					style={{ fontSize: hp(7) }}
					className="font-bold text-white tracking-widest"
				>
					Foody
				</Text>
				<Text
					style={{ fontSize: hp(2) }}
					className="font-medium text-white tracking-widest"
				>
					Food is always right
				</Text>
			</View>
		</View>
	);
}
