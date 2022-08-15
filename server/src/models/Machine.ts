import mongoose, {Schema, Document} from "mongoose";

export interface MachineI extends Document{
    _id: string,
    macA: string,
    lastActive: Date
}

const MachineSchema = new Schema<MachineI>({
    macA: {
        type: String,
        unique: true,
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
});

const Machine = mongoose.model<MachineI>('Machine', MachineSchema);

export default Machine;