import {FlatList, View} from "react-native";
import {useLogsStore} from "../state/logs";
import {Text} from "react-native-paper";

export const LogViewerScreen = () => {
  const logs = useLogsStore(state => state.logs);
  return (
    <FlatList data={logs} renderItem={({item}) => {
      const isError = item.startsWith('ERROR');
      return(
        <View style={{
          backgroundColor: isError ? 'red' : 'white',
        }}>
          <Text style={{
            color: isError ? 'white' : 'black',
          }}>
            {item}
          </Text>
        </View>
    )}}
    contentContainerStyle={{
      paddingBottom: 200,
    }}
    />
  )
}

