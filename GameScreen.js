import {View, Text, Linking, Pressable} from "react-native";
import {styles} from "./constants";
import MapView, {Marker, Polygon} from "react-native-maps";
import {useEffect, useState} from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Modal from "react-native-modal"
import {CheckBox, FAB} from '@rneui/themed'
import {Dialog} from "@rneui/themed";

function randomRange(min, max) {
    return Math.random()*(max-min)+min;
}
function randomLocation(min, max) {
    const long = randomRange(min.longitude, max.longitude)
    const lat  = randomRange(min.latitude, max.latitude)
    return {longitude: long, latitude: lat}
}

const questions = ["Latitude", "Longitude"];
const BACKGROUND_TASK_NAME = "BACKGROUND_LOCATION_TASK";
let foregroundSubscription = null;
const TIME_INTERVAL = 0;
const DISTANCE_INTERVAL=1;
const maxLoc = {latitude: 38.831366115945045, longitude:-77.30874202818364}
const minLoc = {latitude: 38.83082521450529, longitude: -77.30633908984834}

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

function VerticalLine({coord, lr}) {
    // console.log("coord: " + JSON.stringify(coord))
    console.log("lr" + lr)
    coord = coord.coords;
    const coords = [
        {latitude:coord.latitude+1, longitude:coord.longitude},
        {latitude:coord.latitude-1, longitude:coord.longitude},
        {latitude:coord.latitude-1, longitude:coord.longitude - (lr?-1: 1)},
        {latitude:coord.latitude+1, longitude:coord.longitude - (lr?-1: 1)},
    ]
    // console.log("coords:" + JSON.stringify(coords))
    return (
        <Polygon coordinates={coords} fillColor={"#f0f7"}/>
    )
}

function HorizontalLine({coord, ud}) {
    coord = coord.coords;
    const coords = [
        {latitude:coord.latitude, longitude:coord.longitude-1},
        {latitude:coord.latitude, longitude:coord.longitude+1},
        {latitude:coord.latitude+(ud?-1:1), longitude:coord.longitude+1},
        {latitude:coord.latitude+(ud?-1:1), longitude:coord.longitude-1},
    ]

    return (
        <Polygon coordinates={coords} fillColor={"#f0f7"}/>
    )
}
export default function GameScreen({navigation}) {
    const [loc, setLoc] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [questionsVisible, setQuestionsVisible] = useState(false);
    const [checked, setChecked] = useState(0);
    const [hidingSpot, setHidingSpot] = useState(randomLocation(minLoc, maxLoc))
    const [questionsAsked, setQuestionsAsked] = useState([])

    console.log(hidingSpot)

    function askLongitude() {
        console.log("loc " + JSON.stringify(loc));
        console.log("lat " + JSON.stringify(hidingSpot) )
        const answer = loc.coords.longitude - hidingSpot.longitude > 0;
        console.log("answer " + loc.longitude - hidingSpot.longitude)
        setQuestionsAsked([...questionsAsked,{q: "longitude", a: {c:loc, d:answer}}]);
    }

    function askLatitude() {
        const answer = loc.coords.latitude - hidingSpot.latitude < 0;
        setQuestionsAsked([...questionsAsked, {q:"latitude", a: {c:loc, d: answer}}])
    }
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
                <Marker coordinate={hidingSpot} pinColor="blue"/>
                {
                    markers.map((e, i)=>(
                        <Marker coordinate={e} key={i+1}/>
                        )
                    )
                }

                {
                    questionsAsked.map((e,i)=>(
                        e.q === "longitude" ? <VerticalLine coord={e.a.c} lr={e.a.d}/> : <HorizontalLine coord={e.a.c} ud={e.a.d}/>

                    ))
                }
            </MapView>
            <FAB
                icon={{name:"add", color:"red"}}
                onPress={()=>setQuestionsVisible(true)}/>
            <Dialog
                isVisible={questionsVisible}
                onBackdropPress={()=>setQuestionsVisible(false)}
            >
                <Dialog.Title title="Choose a question"/>
                {
                    questions.map((e, i)=>(
                        <CheckBox
                        key={i}
                        title={e}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={checked === i}
                        onPress={()=>setChecked(i)}
                    />
                    ))
                }
                <Dialog.Actions>
                    <Dialog.Button
                        title="Confirm"
                        onPress={()=> {
                        console.log(`Asking ${questions[checked]} question`);
                        if (questions[checked] === "Latitude") {
                            askLatitude()
                        } else {
                            askLongitude()
                        }
                        // [askLatitude, askLongitude][checked]();
                        setQuestionsVisible(false);
                    }}/>
                </Dialog.Actions>
            </Dialog>
        </View>
    )
}
