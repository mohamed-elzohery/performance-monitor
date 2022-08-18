import React from 'react';
import Guage from '../Gauge';
import classes from './CPU.module.css';

const CPU: React.FC<{avgLoad: number}> = ({avgLoad}) => {
    return <div className={classes.cpu}>
    <h2>CPU usage</h2>
    <Guage value={avgLoad} />
    <h3 className={classes.cpuUsage}>{avgLoad}%</h3>
</div>
}

export default CPU;