export interface User {
  id?: string;
  name: string;
  email: string;
  role?: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUser {
  name: string;
  email: string;
  password?: string;
  role?: string;
}
