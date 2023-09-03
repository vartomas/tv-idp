import { get } from './api';

export const getChannels = () => () => get('api/Chat/GetChannels');
