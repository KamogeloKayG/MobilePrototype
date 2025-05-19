// lib/api/auth.ts
type User = {
  userID: number;
  email: string;
  name: string;
  surname: string;
  password: string;
  phoneNumber: string;
  role: string;
}


const BASE_URL = 'http://192.168.137.1:8080/api/users';

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  const user = await res.json();

  // Save role and other info for later
  await AsyncStorage.setItem('userRole', user.role);
  await AsyncStorage.setItem('userID', user.userID.toString());

  return user;
}


