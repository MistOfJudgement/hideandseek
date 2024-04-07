import {View, Text} from "react-native";
import {styles} from "./constants";
import MapView, {Marker} from "react-native-maps";
import {useEffect, useState} from "react";
import * as Location from "expo-location"


export default function GameScreen({navigation}) {
    const [loc, setLoc] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(()=>{
        (async ()=>{
            let {status} = await Location.requestForegroundPermissionsAsync();
            if(status!=="granted") {
                setErrorMsg("Permission to access locatoin was denied");
                return;
            }
            let location = await Location.getCurrentPositionAsync();
            setLoc(location);
        })();
    }, []);
    let text = "Waiting";
    if(errorMsg) {
        text = errorMsg;
    } else {
        text = JSON.stringify(loc);
    }
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                latitude:38.8303462,
                longitude:-77.308008,
                latitudeDelta:0.01,
                longitudeDelta:0.01
            }}
            >
                {

                    loc ? (<Marker key={1} pinColor="RED" coordinate={{latitude:loc.latitude,longitude:loc.longitude}}/>) : null

                }
            </MapView>
            <View style={styles.container}>
                <Text>{text}</Text>
            </View>
        </View>

    )
}