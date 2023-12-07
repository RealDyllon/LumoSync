import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {HomeScreen} from '../screens/Home';
import {
  ActivityIndicator,
  Button,
  IconButton,
  MD3Colors,
  Menu,
  Modal,
  Portal,
  TextInput,
  Tooltip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PeripheralsScreen} from '../screens/Peripherals';
import {StyleSheet, View} from 'react-native';
import {usePeripheralStore, useStartupStore} from '../state';
import PeripheralControl from '../screens/PeripheralControl';
import GroupControl from '../screens/GroupControl';
import ConnectionStatus from '../components/ConnectionStatus';
import {setProperty} from '../utils/mzds01';

// change above to as const
export const Routes = {
  Home: 'Home',
  Peripherals: 'Peripherals',
  PeripheralControl: 'PeripheralControl',
  GroupControl: 'GroupControl',
} as const;

export type Routes = (typeof Routes)[keyof typeof Routes];

type StackParamList = {
  [Routes.Home]: undefined;
  [Routes.Peripherals]: undefined;
  [Routes.PeripheralControl]: {deviceId: string};
  [Routes.GroupControl]: undefined;
};

export type ScreenProps<T extends keyof typeof Routes> = NativeStackScreenProps<
  StackParamList,
  T
>;

const Stack = createNativeStackNavigator<StackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
  },
};

const HomeHeaderLeft = () => {
  const isScanning = usePeripheralStore(state => state.isScanning);
  const isBluetoothEnabled = useStartupStore(state => state.isBluetoothEnabled);
  return (
    <View style={styles.homeHeaderActivityIndicatorContainer}>
      {isScanning &&
          <ActivityIndicator size="small" style={{
            position: 'absolute',
            zIndex: 1,
            top: 0
          }} /> }
      {isBluetoothEnabled &&  <Icon
          style={{
            position: 'absolute',
            zIndex: 2,
            top: 4,
            left: 4
          }} name="bluetooth" size={16} color={MD3Colors.primary50} />
      }
    </View>
  );
};

const PeripheralsHeaderRight = () => {
  const isScanning = usePeripheralStore(state => state.isScanning);
  return (
    <ActivityIndicator
      animating={isScanning}
      color={MD3Colors.error60}
      size="small"
    />
  );
};

interface PeripheralControlHeaderProps {
  navigation: ScreenProps<'PeripheralControl'>['navigation'];
  id: string;
}

const PeripheralControlHeaderRight = ({
  navigation,
  id,
}: PeripheralControlHeaderProps) => {
  const peripheral = usePeripheralStore(state => state.peripherals.get(id));

  const setPeripheral = usePeripheralStore(state => state.setPeripheral);

  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = React.useState(false);
  const [renameText, setRenameText] = React.useState(peripheral?.name ?? '');

  const handleIdentifyPress = async () => {
    // turn light off wait 1 second turn light on
    await setProperty(id, 'power', false);
    await new Promise(resolve => setTimeout(resolve, 250));
    await setProperty(id, 'power', true);
    await new Promise(resolve => setTimeout(resolve, 250));
    await setProperty(id, 'power', false);
    await new Promise(resolve => setTimeout(resolve, 250));
    await setProperty(id, 'power', true);
    await new Promise(resolve => setTimeout(resolve, 250));
    peripheral && (await setProperty(id, 'power', peripheral.properties.power));
  };

  const handleRename = () => {
    setPeripheral(id, {
      name: renameText,
    });
    navigation.setOptions({
      // screen title doesn't auto update, so we have to set it manually
      title: renameText,
    });
  };

  return (
    <View style={{flexDirection: 'row'}}>
      {peripheral && <ConnectionStatus peripheral={peripheral} />}
      <Tooltip title="Identify">
        <IconButton
          size={24}
          icon={'lightbulb-on-outline'}
          onPress={handleIdentifyPress}
        />
      </Tooltip>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginLeft: -12,
          marginRight: -8
        }}>
        <Menu
          visible={isMenuVisible}
          onDismiss={() => setIsMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={24}
              onPress={() => setIsMenuVisible(true)}
              style={{
                marginTop: 8,
              }}
            />
          }
          style={{marginTop: 40}}>
          <Menu.Item
            onPress={() => setIsRenameModalVisible(true)}
            title="Rename Device"
          />
        </Menu>
      </View>
      <Portal>
        <Modal
          visible={isRenameModalVisible}
          onDismiss={() => setIsRenameModalVisible(false)}
          contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
          <TextInput
            label="New Device Name"
            value={renameText}
            onChangeText={text => setRenameText(text)}
          />
          <Button
            icon="check"
            mode="text"
            onPress={() => {
              handleRename();
              setIsRenameModalVisible(false);
            }}>
            Save
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

export const RootNavigation = () => {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        <Stack.Screen
          name={Routes.Home}
          component={HomeScreen}
          options={({
            navigation,
          }: NativeStackScreenProps<StackParamList, typeof Routes.Home>) => ({
            title: 'LumoSync',
            headerLeft: () => <HomeHeaderLeft />,
            headerRight: () => (
              <IconButton
                icon="bug"
                iconColor={MD3Colors.tertiary50}
                // mode="contained-tonal"
                onPress={() => navigation.navigate(Routes.Peripherals)}
              />
            ),
            headerTitleAlign: 'center',
            navigationBarColor: 'white',
          })}
        />
        <Stack.Screen
          name={Routes.Peripherals}
          component={PeripheralsScreen}
          options={({}: NativeStackScreenProps<
            StackParamList,
            typeof Routes.Peripherals
          >) => ({
            title: 'Debug',
            headerRight: () => <PeripheralsHeaderRight />,
          })}
        />
        <Stack.Screen
          name={Routes.PeripheralControl}
          component={PeripheralControl}
          options={({route, navigation}) => ({
            title: usePeripheralStore
              .getState()
              .peripherals.get(route.params.deviceId)?.name,
            headerRight: () => (
              <PeripheralControlHeaderRight
                navigation={navigation}
                id={route.params.deviceId}
              />
            ),
          })}
        />
        <Stack.Screen
          name={Routes.GroupControl}
          component={GroupControl}
          options={() => ({
            title: 'Group Control',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  homeHeaderActivityIndicatorContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20
  },
});
