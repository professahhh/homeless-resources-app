import { useLinkBuilder, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { View } from "react-native";

import MapScreen from "@screens/MapScreen";
import ProfileScreen from "@screens/ProfileScreen";
import MapSvg from "@assets/images/map.svg";
import ProfileSvg from "@assets/images/profile.svg";

const Tab = createBottomTabNavigator();

function TabBar({state, descriptors, navigation}: any) {
    const { buildHref } = useLinkBuilder();

    return (
        <View className="flex-1 flex-row justify-center items-center self-center w-11/12 absolute h-16 mb-10 rounded-full bottom-4 bg-red-400">
            {
                state.routes.map((route: any, index: any) => {
                    const { options } = descriptors[route.key];

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    return (
                        <PlatformPressable
                            key={route.key}
                            href={buildHref(route.name, route.params)}
                            onPress={onPress}
                            className="flex-1 justify-center items-center"
                        >
                            {options.tabBarIcon()}
                        </PlatformPressable>
                    );
                })
            }
        </View>
    );
}

export default function Tabs() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                tabBar={(props) => <TabBar {...props} />}
                backBehavior="none"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tab.Screen name="Map" component={MapScreen} options={{ tabBarIcon: () => <MapSvg width={32} height={32} /> }} />
                <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <ProfileSvg width={48} height={48} /> }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}