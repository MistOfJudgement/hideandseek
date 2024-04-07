import {View, Text} from "react-native";
import {styles} from "./constants";
import MapView, {Marker} from "react-native-maps";
import {useEffect, useState} from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
export default function GameScreen({navigation}) {
    const [loc, setLoc] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(()=>{
        (async ()=>{
            const fgPerm = await  Location.requestForegroundPermissionsAsync();
            let fgSub = null;
            if(!fgPerm.granted) {
                return;
            }
            const bgPerm = await Location.getBackgroundPermissionsAsync();
            if(fgPerm.granted) {
                fgSub = Location.watchPositionAsync({
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 10
                    },
                    setLoc
                );
            }
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
                showsCompass={true}
                showsUserLocation={true}
                rotateEnabled={true}
            >
                <Marker key={1} pinColor="RED" coordinate={{latitude:loc?.coords.latitude ?? 0 ,longitude:loc?.coords.longitude ?? 0}}/>

            </MapView>
            <View style={styles.container}>
                <Text>{text}</Text>
            </View>
        </View>

    )
}
