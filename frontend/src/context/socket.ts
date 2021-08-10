import { io } from 'socket.io-client';
import { io } from 'socket.io-client';
import { ENV } from 'common/enums/enums';
import { createContext } from 'react';

const socket = io(ENV.SOCKET_SERVER as string);

export const SocketContext = createContext(socket);
export const { Provider } = SocketContext;
