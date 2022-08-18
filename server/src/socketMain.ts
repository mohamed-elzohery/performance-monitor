import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import Machine, { MachineI } from "./models/Machine";
mongoose.connect('mongodb://localhost:27017/machines');

const socketMain = (io: Server, connection: Socket) => {
    console.log("Hello main socket");

    connection.on('ui-client', (room) => {
        connection.join('ui');
    });
    
    connection.on('connect-machine', async (macAddress) => {
        console.log(macAddress);
        try {
            const machine = await Machine.findOne({macAddress});
            if(!machine){
                await Machine.create({macAddress});
                return;
            }
            machine.lastActive = new Date();
        } catch (err) {
            connection.emit('validation-error', {err: 'invalid data input'});
            connection.disconnect(true);
        }
    });
    
    connection.on('send-performance', (performanceData) => {
        console.log(performanceData);
        io.to('ui').emit('data', performanceData);
    });



    connection.on('disconnect', async (macAddress) => {
        await Machine.findOneAndUpdate({macAddress}, {lastActive: new Date()});
    });


}

export default socketMain;