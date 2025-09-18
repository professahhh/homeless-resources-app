import { MapView, Camera, UserLocation, Location, PointAnnotation } from "@rnmapbox/maps";
import { useRef, useState } from "react";
import { GestureResponderEvent, Image, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { Portal } from "@gorhom/portal";

import BottomModal from "@components/BottomModal";
import SearchBar from "@components/SearchBar";
import { MapLocation } from "@/types/map.types";
import shelterIcon from "@assets/images/shelter.png";

export default function MapScreen() {
    const camera = useRef<Camera>(null);
    const [currentLocation, setCurrentLocation] = useState<Location>();
    const [pressInPosition, setPressInPosition] = useState<{ x: number; y: number }>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedLocation, setSelectedLocation] = useState<MapLocation>();

    const handleSearch = (searchString: string) => {
        console.log("searching for ", searchString);
    }

    const handleLocationUpdate = (location: Location) => {
        console.log("location update: ", location);
        setCurrentLocation(location);
    }

    const handlePressIn = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        setPressInPosition({ x: locationX, y: locationY });
    }

    const handlePress = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        if (pressInPosition && (Math.abs(locationX - pressInPosition.x) < 10 && Math.abs(locationY - pressInPosition.y) < 10)) {
            Keyboard.dismiss();
        }
    }

    const handleLocationPress = (loc: MapLocation) => {
        console.log("pressed location: ", loc);
        setSelectedLocation(loc);
        setShowModal(true);
    }

    const locations: MapLocation[] = [
        { id: 'id1a;slfjnapfjnapsfjnaspfajsfpsfdsupserlongid;lskdfnpasefn', coords: { latitude: 32.936831, longitude: -97.269544 }, timestamp: 1756534404001.0342 },
        { id: 'id2', coords: { latitude: 32.936831, longitude: -97.259544 }, timestamp: 1756534404001.0342 },
        { id: 'id3', coords: { latitude: 32.609327577627326, longitude: -97.12837816806515 }, timestamp: 1756619958845.7898 },
        { id: 'id4', coords: { latitude: 32.9423, longitude: -96.813 }, timestamp: 175661997746 },
    ];


    return (
        <TouchableWithoutFeedback onPressIn={handlePressIn} onPress={handlePress} accessible={false} className="w-full h-full">
            <View>
                <SearchBar onSearch={handleSearch} extraClassName="self-center w-11/12 absolute mt-10 top-10 z-10" />
                <View className="w-full h-full elevation-none">
                    <MapView
                        compassPosition={{ top: 80, right: 10}}
                        attributionEnabled={false}
                        compassEnabled={true}
                        compassFadeWhenNorth={true}
                        logoEnabled={false}
                        scaleBarEnabled={false}
                        style={{ flex: 1 }}
                    >
                        <Camera ref={camera} followUserLocation={true} />
                        <UserLocation
                            minDisplacement={100}
                            showsUserHeadingIndicator={true}
                            onUpdate={handleLocationUpdate}
                        />
                        {locations.map((loc, index) => (
                            <PointAnnotation
                                key={loc.id}
                                id={loc.id}
                                coordinate={[loc.coords.longitude, loc.coords.latitude]}
                                onSelected={() => handleLocationPress(loc)}
                            >
                                <View className="flex-1 justify-center items-center w-10 h-10 rounded-full bg-white" collapsable={false}>
                                    <Image source={shelterIcon} className="w-8 h-8" />
                                </View>
                            </PointAnnotation>
                        ))}
                    </MapView>
                </View>

                <Portal>
                    <BottomModal visible={showModal} setVisible={setShowModal} locationDetails={selectedLocation} />
                </Portal>
            </View>
        </TouchableWithoutFeedback>
    );
}