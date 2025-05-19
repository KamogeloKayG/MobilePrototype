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
  return user;
}

