import {StyleSheet} from "react-native";

export const Teams = {
    HIDER: "HIDER",
    SEEKER: "SEEKER",
}
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '95%',
    },
    input: {
        height:40,
        margin: 12,
        borderWidth:1,
        padding:10,
    },
    circleButtonContainer: {
        width:84,
        height:84,
        marginHorizontal:60,
        borderWidth:4,
        padding:3
    },
    circleButton: {
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:42,
        backgroundColor:"#fff"
    }
});
