import React from 'react';
import classes from './Info.module.css';

export type InfoProps = {
    osType: string,
    upTime: number,
    cpuModel: string,
    cpuSpeed: number,
    numberOfCores: number,
    macAddress: string
}

const Info: React.FC<InfoProps> = ({osType, upTime, cpuModel, cpuSpeed, numberOfCores, macAddress}) => {
    return <div className={classes.info}>
        <h2>Operating System</h2>
        <h3>{osType}</h3>
        <h2>Time Online</h2>
        <h3>{upTime}</h3>
        <h2>Processor Infomration</h2>
        <h3>CPU Model: {cpuModel}</h3>
        <h3>CPU Speed: {cpuSpeed}</h3>
        <h3>Number of chores: {numberOfCores}</h3>
    </div>
}

export default Info;