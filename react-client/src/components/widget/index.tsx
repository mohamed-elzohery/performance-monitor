import React from 'react';
import CPU from '../cpu';
import Info from '../info';
import Memory from '../memory';
import classes from './Wigdet.module.css';
import { Machine } from '../../types';


const Widget: React.FC<Machine> = ({totalMemory, 
                                    freeMemory, 
                                    memoryUsage, 
                                    usedMemory, 
                                    avgLoad, 
                                    osType, 
                                    upTime, 
                                    cpuModel, 
                                    cpuSpeed, 
                                    macAddress, 
                                    numberOfCores}) => {
                                        
    return <li className={classes.machineList__item}>
                <Memory 
                    totalMemory={totalMemory} 
                    freeMemory={freeMemory}
                    memoryUsage={memoryUsage}
                    usedMemory={usedMemory}
                    />
                <CPU
                    avgLoad={+avgLoad.toFixed(0)}
                />
                <Info 
                    macAddress={macAddress}
                    osType={osType}
                    upTime={upTime}
                    cpuModel={cpuModel}
                    cpuSpeed={cpuSpeed}
                    numberOfCores={numberOfCores}
                />
            </li>
}

export default Widget;