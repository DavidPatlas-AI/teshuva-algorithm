// StorageAdapter עבור React Native — עוטף @react-native-async-storage/async-storage

import AsyncStorage from '@react-native-async-storage/async-storage'

export function createReactNativeAdapter() {
  return {
    async get(key) {
      const raw = await AsyncStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    },
    async set(key, value) {
      if (value === null) {
        await AsyncStorage.removeItem(key)
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(value))
      }
    },
  }
}
