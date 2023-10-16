export interface CreateUser {
  username: string;
  password: string;
  role: string;
  email: string;
}

export interface UpdateUser {
  id: string;
  username: string;
  password: string;
  role: string;
  email: string;
}

export interface DeleteUser {
  id: string;
}

export interface Sendmail {
  email: string;
  verify: string;
}

export interface Adminlog {
  username: string;
  password: string;
  role: string;
}
