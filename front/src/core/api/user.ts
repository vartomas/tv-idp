import { get, post } from './api';

export const checkUser = () => () => get('api/Users/Check');

export const registerUser = (username: string, password: string) => () =>
  post('api/Users/Register', { username, password });

export const loginUser = (username: string, password: string) => () => post('api/Users/Login', { username, password });
