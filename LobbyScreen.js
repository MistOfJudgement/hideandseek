import {Button, Text, View} from "react-native";
import {styles, Teams} from "./constants";
import {useState} from "react";

function Player({playerName}) {

    const [ready, setReady] = useState(false);
    const [team, setTeam] = useState(Teams.HIDER);
    function changeTeam() {
        setReady(false);
        setTeam(team===Teams.HIDER ? Teams.SEEKER : Teams.HIDER);
    }
    return (
        <View style={{display:"flex", flexDirection:"row"}}>
            <Text>{playerName} - {team} - {ready ? "Ready": "Not Ready"}</Text>
            <Button
                title="Change Team"
                onPress={changeTeam}
                />
            <Button
                title={ready ? "Unready": "Ready"}
                onPress={()=>setReady(!ready)}
                />
        </View>
            )

}
export default function LobbyScreen({navigation, route}) {
    const [players, setPlayers] = useState([route.params.username]);
    const code = route.params.code;
    return (
        <View style={styles.container}>
            <Text>Lobby</Text>
            <Text>CODE: {code}</Text>
            {players.map(p=>(<Player player={p}/>))}
            <Button title="Start Game" onPress={()=>navigation.navigate("Game")}/>
        </View>
    )
}