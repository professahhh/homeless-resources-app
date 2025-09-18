import { createStaticNavigation, NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "@screens/MapScreen";
import ProfileScreen from "@screens/ProfileScreen";

export type RootStackParamList = {
    Map: undefined;
    Profile: undefined;
}

const RootTabs = createBottomTabNavigator({
    screens: {
        Map: MapScreen,
        Profile: ProfileScreen,
    },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Map: {
      screen: MapScreen,
      options: { title: 'Map' },
    },
    Profile: {
      screen: ProfileScreen,
      options: { title: 'Profile' },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default Navigation;