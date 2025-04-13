import * as React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Color } from "../styles/GlobalStyles";
import Union from "../assets/union.svg";
import Group from "../assets/group1.svg";
import Vector from "../assets/vector1.svg";
import Group67 from "../assets/group-67.svg";
import User from "../assets/user-1.svg";

const ICON_SIZE = 24;
const activeColor = Color.primaryDark;
const inactiveColor = Color.text;

const NavigationBar: React.FC<BottomTabBarProps> = (props) => {

    const screenHome = 'Home';
    const screenProfile = 'Profile';
    const screenCart = 'Cart';
    const screenWishlist = 'Wishlist';

    const currentRouteName = props.state ? props.state.routes[props.state.index].name : screenHome;

    const getIconColor = (routeName: string) => {
        return currentRouteName === routeName ? activeColor : inactiveColor;
    };

    return (
        <View style={styles.navigation}>
          <View style={[styles.unionParent, styles.groupIconPosition]}>
            <Union style={styles.unionIcon} width={414} height={87} />

            <View style={styles.groupParent}>

              <Pressable
                style={[styles.groupIcon]}
                onPress={() => props.navigation.navigate(screenHome)}
                hitSlop={5}
              >
                <Group style={styles.iconInsidePressable} fill={getIconColor(screenHome)} />
              </Pressable>

              <Pressable
                style={[styles.user1, styles.user1Layout]}
                onPress={() => props.navigation.navigate(screenProfile)}
                hitSlop={5}
              >
                <User style={[styles.icon, styles.iconGroupLayout] as unknown as React.CSSProperties} fill={getIconColor(screenProfile)} />
              </Pressable>

              <Pressable
                style={[styles.vectorIconContainer, styles.user1Layout]}
                onPress={() => props.navigation.navigate(screenWishlist)}
                hitSlop={5}
              >
                <Vector style={styles.iconInsidePressable} fill={getIconColor(screenCart)} />
              </Pressable>

            </View>

            <Pressable
              style={[styles.groupChild]}
              onPress={() => props.navigation.navigate(screenCart)}
              hitSlop={5}
            >
              <Group67 style={styles.iconInsidePressable} fill={getIconColor(screenWishlist)} />
            </Pressable>

          </View>
        </View>
    );
};

const styles = StyleSheet.create({
    groupIconPosition: {
        left: "0%",
        position: "absolute",
        height: "108.75%",
        top: "-8.75%",
        bottom: "0%",
        right: "0%",
        width: "100%"
    },
    iconGroupLayout: {
        maxHeight: "100%",
        overflow: "hidden",
        maxWidth: "100%"
    },
    user1Layout: {
        width: "10.34%",
        position: "absolute"
    },
    unionIcon: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    groupIcon: {
        height: "97.27%",
        width: "10.71%",
        right: "89.29%",
        bottom: "2.73%",
        top: "0%",
        position: "absolute"
    },
    icon: {
        height: "100%",
        width: "100%"
    },
    iconInsidePressable: {
        width: "100%",
        height: "100%",
    },
    user1: {
        left: "45.02%",
        right: "44.64%",
        height: "100%",
        top: "0%",
        position: "absolute"
    },
    vectorIconContainer: {
        height: "81.82%",
        top: "9.09%",
        left: "89.66%",
        position: "absolute",
    },
    groupParent: {
        height: "25.29%",
        width: "51.4%",
        top: "49.43%",
        right: "39.61%",
        bottom: "25.29%",
        left: "8.99%",
        position: "absolute",
        zIndex: 2,
    },
    groupChild: {
        height: "64.37%",
        width: "13.53%",
        top: "5.75%",
        right: "8.45%",
        bottom: "29.89%",
        left: "78.02%",
        position: "absolute",
        zIndex: 2,
    },
    unionParent: {
        height: "108.75%",
        top: "-8.75%",
        bottom: "0%",
        right: "0%",
        left: "0%",
        width: "100%",
        position: "absolute",
    },
    navigation: {
        shadowColor: "rgba(0, 0, 0, 0.02)",
        shadowOffset: {
            width: 0,
            height: -12
        },
        position: 'absolute',
        bottom: 0,
        zIndex: 10,
        shadowRadius: 9,
        elevation: 9,
        shadowOpacity: 1,
        height: 80,
        width: "100%",
        backgroundColor: 'transparent',
        overflow: 'visible',
    }
});

export default NavigationBar;