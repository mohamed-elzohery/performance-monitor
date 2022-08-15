import os, { CpuInfo } from 'os';
import { io } from 'socket.io-client';

let macAddress: string;
// Socket connection
const socket = io('http://127.0.0.1:8181', {transports: ['websocket']});

socket.on("connect", () => {
    console.log('client is connected to server');

    const interfaces = os.networkInterfaces();
    for(let key in interfaces){
        if(!interfaces[key]![0].internal){
            macAddress = interfaces[key]![0].mac;
            socket.emit('connect-machine', macAddress);
            return;
        }
        break;
    }


    let getPerformanceDataInterval = setInterval( async () => {
        const performanceData = await getMachineInfo();
        socket.emit('send-performance', performanceData);
    }, 1000);

    socket.on('disconnect', () => {
        clearInterval(getPerformanceDataInterval);
    });
});
import { resolve } from 'path';

// CPU avg laod
const getInstantCpuLoad = (cpus:CpuInfo[] ) => {
    let idleTime = 0;
    let totalTime = 0;

    cpus.forEach(core => {
        totalTime += core.times.idle + core.times.user + core.times.sys + core.times.nice + core.times.irq;
        idleTime += core.times.idle;
    });

    return {
        totalTime: totalTime / cpus.length,
        idleTime: idleTime / cpus.length
    }
};



const getAverageCpuLoad = () => {
    return new Promise((resolve, reject) => {
        const startLoad = getInstantCpuLoad(os.cpus());

        setTimeout(() => {
            const endLoad = getInstantCpuLoad(os.cpus());
            const avgIdleTime = endLoad.idleTime - startLoad.idleTime;
            const avgTotalTime = endLoad.totalTime - startLoad.totalTime;
            const avgLoadTime = +((avgTotalTime - avgIdleTime) / avgTotalTime).toFixed(2) * 100;
            resolve(avgLoadTime);
        } ,1000)
    });
}

const getMachineInfo = () => {
    return new Promise(async (reslove, reject) => {
        const cpus = os.cpus();

        // Memory Info
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = +(totalMemory - freeMemory).toFixed(2);
        const memoryUsage = +(usedMemory / totalMemory).toFixed(2) * 100;

        // OS
        const osType = os.type() === 'Darwin' ? 'Mac' : os.type();

        // CPUs
        const upTime = os.uptime();
        const cpuModel = cpus[0].model;
        const cpuSpeed = cpus[0].speed;
        const numberOfCores = cpus.length;
        const avgLoad = await getAverageCpuLoad();

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
        })
    });
};

process.on('exit', () => {
    socket.emit('disconnect', macAddress)
});


getMachineInfo().then(console.log);
