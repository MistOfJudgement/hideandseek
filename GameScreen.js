import {View, Text, Linking, Pressable} from "react-native";
import {styles} from "./constants";
import MapView, {Marker} from "react-native-maps";
import {useEffect, useState} from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function CircleButton({onPress}) {
    return (
        <View style={styles.circleButtonContainer}>
            <Pressable style={styles.circleButton} onPress={onPress}>
                <MaterialIcons name="add" size={38} color="#ffffff"/>
            </Pressable>
        </View>
    )
}


const BACKGROUND_TASK_NAME = "BACKGROUND_LOCATION_TASK";
let foregroundSubscription = null;
const TIME_INTERVAL = 0;
const DISTANCE_INTERVAL=1;
TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({data, error}) => {
    if(error) {
        console.log(error);
        return;
    }
    if(data) {
        const {locations} = data;
        const location = locations[0];
        if(location) {
            console.log("Location in background", location.coords);
            markers.push(location)
        }
    }

})
let markers = []
export default function GameScreen({navigation}) {
    const [loc, setLoc] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(()=> {
        console.log("asdifuh")
        const requestLocationPerms = async () => {
            console.log("ihuegrihuiufriuh")
            const fg = await Location.requestForegroundPermissionsAsync();
            if(fg.granted) await Location.requestBackgroundPermissionsAsync();
        }
        const startForegroundUpdate = async () => {
            console.log("startfgupdate")
            const fg = await Location.getForegroundPermissionsAsync();
            if(!fg.granted) {
                console.log(fg)
                console.log("fgLocation tracking was denied");
                await Linking.openSettings();
                return;
            }
            const firstLoc = await Location.getLastKnownPositionAsync();
            markers.push(firstLoc.coords);
            foregroundSubscription?.remove();
            foregroundSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    // timeInterval: TIME_INTERVAL,
                    distanceInterval:DISTANCE_INTERVAL,
                },
                location => {
                    setLoc(location)
                    console.log("Set fgLocation" + location)
                    markers.push(location.coords)
                    console.log(markers)
                }
            );
        }

        const startBackgroundUpdate = async () => {
            console.log("startbgupdate")
            const {granted} = await Location.getBackgroundPermissionsAsync();
            if(!granted) {
                console.log("bgLocation tracking was denied");
                await Linking.openSettings();

                return;
            }

            const isTaskDefined = TaskManager.isTaskDefined(BACKGROUND_TASK_NAME);
            if(!isTaskDefined){
                console.log("Task is not defined");
                return;
            }

            const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_TASK_NAME);
            if(hasStarted) {
                console.log("Background tracking has already started");
                return;
            }
            await Location.startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
                accuracy: Location.Accuracy.High,
                showsBackgroundLocationIndicator: true,
                // timeInterval:TIME_INTERVAL,
                distanceInterval:DISTANCE_INTERVAL,

                foregroundService: {
                    notificationTitle: "Location",
                    notificationBody: "Location Tracking in the background",
                    notificationColor: "#fff"
                }
            })


        }
        requestLocationPerms()
            .then(()=>console.log("perms got"))
            .then(startForegroundUpdate)
            .then(()=>console.log("fg started"))
            .then(startBackgroundUpdate)
            .then(()=>console.log("bg started"))
    }, []);


    let text = "Waiting";
    if(errorMsg) {
        text = errorMsg;
    } else if(loc) {
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
                {
                    markers.map((e, i)=>(
                        <Marker coordinate={e} key={i}/>
                        )
                    )
                }
            </MapView>
                <View style={styles.container}>
                    <CircleButton/>
                </View>
            {/*<View style={styles.container}>*/}
            {/*    <Text>{text}</Text>*/}
            {/*/!*<CircleButton onPress={()=>{}}/>*!/*/}
            {/*</View>*/}
        </View>

    )
}
