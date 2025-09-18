import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, GestureResponderEvent, Image, NativeScrollEvent, NativeSyntheticEvent, PanResponder, PanResponderGestureState, PanResponderInstance, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import closeIcon from "@assets/images/closed.png";
import { MapLocation } from "@/types/map.types";

type BottomModalProps = {
    setVisible: (visible: boolean) => void;
    visible: boolean;
    locationDetails?: MapLocation;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ModalLevel = "FULL" | "HALF" | "ONE-QUARTER" | "THREE-QUARTERS" | "CLOSED";
const ONE_QUARTER_OPEN_VALUE = SCREEN_HEIGHT * 0.75;
const THREE_QUARTERS_OPEN_VALUE = SCREEN_HEIGHT * 0.25;
const HALF_OPEN_VALUE = SCREEN_HEIGHT * 0.5;
const FULLY_OPEN_VALUE = SCREEN_HEIGHT * 0.1;
const CLOSED_VALUE = SCREEN_HEIGHT;

const MODAL_LEVELS = {
    "FULL": FULLY_OPEN_VALUE,
    "HALF": HALF_OPEN_VALUE,
    "ONE-QUARTER": ONE_QUARTER_OPEN_VALUE,
    "THREE-QUARTERS": THREE_QUARTERS_OPEN_VALUE,
    "CLOSED": CLOSED_VALUE,
};

export default function BottomModal({ visible, setVisible, locationDetails }: BottomModalProps) {
    const panAnim = useRef(new Animated.Value(visible ? HALF_OPEN_VALUE : CLOSED_VALUE)).current;
    const [panAnimValue, setPanAnimValue] = useState<number>(visible ? HALF_OPEN_VALUE : CLOSED_VALUE);
    const [panResponder , setPanResponder] = useState<PanResponderInstance>();
    const [scrollEnabled, setScrollEnabled] = useState<boolean>(false);
    const initialTouchPosition = useRef<number>(0);
    const currentModalLevel = useRef<ModalLevel>(visible ? "HALF" : "CLOSED");
    const velocity = useRef<number>(0);
    const safeAreaInsets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);
    const scrolledToTop = useRef<boolean>(true);
    const scrolledToBottom = useRef<boolean>(false);

    useEffect(() => {
        setPanResponder(
            PanResponder.create({
                onStartShouldSetPanResponder: (event) => {
                    if (event.nativeEvent.locationY < 48) {
                        setScrollEnabled(false);
                        return true;
                    }
                    setScrollEnabled(true);
                    return false;
                },
                onMoveShouldSetPanResponder: (_, state) => {
                    if (currentModalLevel.current !== "FULL") {
                        setScrollEnabled(false);
                        return true;
                    }

                    if (scrolledToTop.current && state.dy > 0) {
                        setScrollEnabled(false);
                        return true;
                    }

                    setScrollEnabled(true);
                    return false;
                },
                onPanResponderGrant: (event) => {
                    initialTouchPosition.current = event.nativeEvent.pageY;
                },
                onPanResponderMove: (_, state) => {
                    if (panAnimValue >= safeAreaInsets.top || state.dy > 0) {
                        panAnim.setValue(panAnimValue + state.dy);
                        setPanAnimValue(panAnimValue + state.dy);
                    }
                    if (state.vy > 0.01 || state.vy < -0.01) {
                        velocity.current = state.vy;
                    }
                },
                onPanResponderRelease: (event: GestureResponderEvent, state: PanResponderGestureState) => {
                    let resultingValue: ModalLevel = currentModalLevel.current;

                    const endTouchPosition = event.nativeEvent.pageY;
                    const dy = endTouchPosition - initialTouchPosition.current;
                    if (currentModalLevel.current == "FULL") {
                        if (velocity.current >= 0.65 || dy > SCREEN_HEIGHT / 8) {
                            resultingValue = "HALF";
                        }
                    } else if (currentModalLevel.current == "HALF") {
                        if (velocity.current <= -0.65 || (dy < 0 && dy < SCREEN_HEIGHT / 8)) {
                            resultingValue = "FULL";
                        } else if (velocity.current >= 0.65 || dy > SCREEN_HEIGHT / 8) {
                            resultingValue = "CLOSED";
                        }
                    }

                    if (resultingValue !== "CLOSED") {
                        changeModalLevel(resultingValue);
                    } else {
                        handleClose();
                    }
                }
            })
        );
    }, [panAnimValue]);

    const handleClose = () => {
        setVisible(false);
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (event.nativeEvent.contentOffset.y <= 5) {
            scrolledToTop.current = true;
        } else if (event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height >= event.nativeEvent.contentSize.height) {
            scrolledToBottom.current = true;
        } else {
            scrolledToTop.current = false;
            scrolledToBottom.current = false
        }
    }

    const changeModalLevel = (level: ModalLevel) => {
        console.log('scroll ref', scrollViewRef.current);
        Animated.timing(
            panAnim,
            {
                toValue: MODAL_LEVELS[level],
                duration: 200,
                useNativeDriver: true,
            },
        ).start();
        
        setPanAnimValue(MODAL_LEVELS[level]);
        currentModalLevel.current = level;

        if (level === "FULL") {
            setScrollEnabled(true);
        }
    };

    useEffect(() => {
        if (visible) {
            if (scrollViewRef.current) {
                console.log('scrollview exists');
                scrollViewRef.current.scrollTo({ y: 0, animated: true });
            }

            changeModalLevel("HALF");
        } else {
            changeModalLevel("CLOSED");
        }
    }, [visible])

    return (
        <Animated.View
            style={{
                bottom: 0,
                height: "100%",
                position: "absolute",
                transform: [{ translateY: panAnim }],
                width: "100%",
            }}
            {...panResponder?.panHandlers}
        >
            <View style={styles.container}>
                <Pressable onPress={handleClose} style={styles.closeIconContainer}>
                    <Image source={closeIcon} className="w-8 h-8" />
                </Pressable>
                <View style={styles.drawerIndicatorContainer}>
                    <View style={styles.drawerIndicator} />
                </View>
                <View style={styles.headerContainer}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">{locationDetails?.id}</Text>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <ScrollView ref={scrollViewRef} scrollEnabled={scrollEnabled} onScroll={handleScroll}>
                        <Text style={styles.contentText}>TESTd;laaspoidfjpsaofnapsifusafdsahfjslfdas;fljd;lakjfdsfsfafdfsfdsafasfdsafdsfsaaskjfpsdofnaspfoksnapfsonfpsaojfknsapkjfndsapflkndsa;lfknsTESTd;laaspoidfjpsaofnapsifusafdsahfjslfdas;fljd;lakjfdsfsfafdfsfdsafasfdsafdsfsaaskjfpsdofnaspfoksnapfsonfpsaojfknsapkjfndsapflkndsa;lfknsadgfjkngpasgjnpasgfjnasdpfknadsfpkansf;asknfpasokfnadgfjkngpasgjnpasgfjnasdpfknadsfpkansf;asknfpasokfn</Text>
                    </ScrollView>
                </View>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    closeIconContainer: {
        position: "absolute",
        right: 10,
        top: 10,
    },
    container: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 1,
        height: "100%",
        position: "absolute",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.2,
        width: "100%",
    },
    contentContainer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-start",
        paddingBottom: "35%",
        padding: 4,

        borderWidth: 1,
    },
    contentText: {
        fontSize: 60,
    },
    drawerIndicator: {
        backgroundColor: "lightgray",
        borderRadius: 9999,
        height: 4,
        width: "15%",
    },
    drawerIndicatorContainer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        maxHeight: 16,
        width: "100%",
    },
    headerContainer: {
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        maxHeight: 48,
        maxWidth: SCREEN_WIDTH - 52,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
    },
    headerTextContainer: {
        alignItems: "flex-start",
        flex: 1,
        justifyContent: "center",
        paddingLeft: 20,
    }
});