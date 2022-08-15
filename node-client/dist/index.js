"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const socket_io_client_1 = require("socket.io-client");
// Socket connection
const socket = (0, socket_io_client_1.io)('http://127.0.0.1:8181');
socket.on("connect", () => {
    console.log('client is connected to server');
});
// CPU avg laod
const getInstantCpuLoad = (cpus) => {
    let idleTime = 0;
    let totalTime = 0;
    cpus.forEach(core => {
        totalTime += core.times.idle + core.times.user + core.times.sys + core.times.nice + core.times.irq;
        idleTime += core.times.idle;
    });
    return {
        totalTime: totalTime / cpus.length,
        idleTime: idleTime / cpus.length
    };
};
const getAverageCpuLoad = () => {
    return new Promise((resolve, reject) => {
        const startLoad = getInstantCpuLoad(os_1.default.cpus());
        setTimeout(() => {
            const endLoad = getInstantCpuLoad(os_1.default.cpus());
            const avgIdleTime = endLoad.idleTime - startLoad.idleTime;
            const avgTotalTime = endLoad.totalTime - startLoad.totalTime;
            const avgLoadTime = +((avgTotalTime - avgIdleTime) / avgTotalTime).toFixed(2) * 100;
            resolve(avgLoadTime);
        }, 1000);
    });
};
const getMachineInfo = () => {
    return new Promise((reslove, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const cpus = os_1.default.cpus();
        // Memory Info
        const totalMemory = os_1.default.totalmem();
        const freeMemory = os_1.default.freemem();
        const usedMemory = +(totalMemory - freeMemory).toFixed(2);
        const memoryUsage = +(usedMemory / totalMemory).toFixed(2) * 100;
        // OS
        const osType = os_1.default.type() === 'Darwin' ? 'Mac' : os_1.default.type();
        // CPUs
        const upTime = os_1.default.uptime();
        const cpuModel = cpus[0].model;
        const cpuSpeed = cpus[0].speed;
        const numberOfCores = cpus.length;
        const avgLoad = yield getAverageCpuLoad();
        reslove({
            totalMemory,
            freeMemory,
            usedMemory,
            memoryUsage,
            osType,
            upTime,
            cpuModel,
            cpuSpeed,
            numberOfCores,
            avgLoad
        });
    }));
};
getMachineInfo().then(console.log);
