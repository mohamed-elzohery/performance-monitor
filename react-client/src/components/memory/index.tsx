import React from 'react';
import classes from './Memory.module.css';
import Guage from '../Gauge';

export type memoryPorp = {
    totalMemory: number,
    freeMemory: number,
    usedMemory: number,
    memoryUsage: number,
};

const Memory: React.FC<memoryPorp> = ({totalMemory, freeMemory, usedMemory, memoryUsage}) => {
    return  <div className={classes.memory}>
        <h2>Memory usage</h2>
        <Guage value={memoryUsage} />
        <h3 className={classes.memoryUsage}>{`${memoryUsage}%`}</h3>
        <div className={classes.memory__info}>
            <p className={classes.memory__txt}>{`Total Memory: ${(totalMemory/1000000000).toFixed(2)}gb`}</p>
            <p className={classes.memory__txt}>{`Free Memory: ${(freeMemory/1000000000).toFixed(2)}gb`}</p>
        </div>
    </div>
}

export default Memory;