import {io} from 'socket.io-client';

const socket = io('http://localhost:8181');

socket.emit('ui-client', 'elzohery');

export default socket;