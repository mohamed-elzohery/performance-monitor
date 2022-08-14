import { Server, Socket } from "socket.io";

const socketMain = (io: Server, connection: Socket | null) => {
    console.log("Hello main socket")
}

export default socketMain;