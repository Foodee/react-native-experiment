import { AsyncStorage } from "react-native";
import MasterFox from 'master-fox-client';

const ROOT_URL = 'https://concierge-staging.food.ee/';
export const API_KEY = "master-fox-api-key";

export async function masterFoxClient(){
  const token = await AsyncStorage.getItem(API_KEY);
  return new MasterFox(ROOT_URL, token);
}

export const login = async (email, password) => {
    const masterFox = await MasterFox.login(ROOT_URL, email, password);
    await AsyncStorage.setItem(API_KEY, masterFox.apiKey);
    return masterFox;
};

export const logout = async () => {
  await AsyncStorage.removeItem(API_KEY);
};

export const isLoggedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(API_KEY)
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};
