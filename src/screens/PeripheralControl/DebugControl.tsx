import {View} from "react-native";
import {useEffect, useState} from "react";
import {Characteristic, Device, Service} from "react-native-ble-plx";
import DropDownPicker from "react-native-dropdown-picker";
import {Button, Text} from "react-native-paper";
import {logError, logMsg} from "../../utils/logger";
import {codes} from "../../utils/mzds01";

interface Props {
  dev: Device
}

interface CharacteristicItem {
  char: Characteristic,
  service: Service
}

export const DebugControl = ({dev}: Props) => {
  const [characteristics, setCharacteristics] = useState<CharacteristicItem[]>([])

  const [selectedCharacteristicUuid, setSelectedCharacteristicUuid] = useState<string | null>(null)
  const selectedCharacteristic = characteristics.find(({char}) => char.uuid === selectedCharacteristicUuid)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const getCharacteristics = async () => {
    const services = await dev.services()
    const characteristics = (
      await Promise.all(services.map(async service =>
        // ({char: await service.characteristics(), service: service})
        {
          const charsInService = await service.characteristics()
          return charsInService.map(char => ({char: char, service: service}))
        }
      ))
    ).flat()
    return characteristics
  }

  useEffect(() => {
    getCharacteristics().then(characteristics => {
      console.log('characteristics', characteristics)
      setCharacteristics(characteristics)
    })
  }, []);

  const characteristicsOptions = characteristics.map(({char, service}) => ({
    label: `${service.uuid} - ${char.uuid}`,
    value: char.uuid
  }))

  const handleSendPress = async () => {
    if (!selectedCharacteristic) {
      logError('charItem not found', new Error('charItem not found'))
      return
    }

    await dev.writeCharacteristicWithResponseForService(
      selectedCharacteristic.service.uuid,
      selectedCharacteristic.char.uuid,
      codes.power.on
    )
  }

  return <View>
    <DropDownPicker setValue={setSelectedCharacteristicUuid} value={selectedCharacteristicUuid ?? null} items={characteristicsOptions} open={isDropdownOpen} setOpen={setIsDropdownOpen} />
    <Text>
      selected Service {selectedCharacteristic?.service.uuid} -- {selectedCharacteristic?.service.isPrimary ? "primary" : "non-primary"}
    </Text>
    <Button onPress={handleSendPress} mode="contained" disabled={!selectedCharacteristic}>Send</Button>
  </View>
}
