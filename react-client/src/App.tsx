import React, { useEffect, useState } from 'react';
import classes from './App.module.css';
import socket from './utils/socket';
import Widget from './components/widget';
import { Machine } from './types';

type AppPropsType = null | {[mac: string]: Machine};



function App() {
  const [machines, setMachines] = useState<AppPropsType>(null);
  
  useEffect(() => {
    socket.on('data', (machine: Machine) => {
      setMachines(prev => ({...prev, [machine.macAddress]: machine}));
    });
  }, []);

  return (
    <div className="App">
      <div className={classes.app__container}>
        <ul className={classes.machineList}>
        {machines && Object.entries(machines).map(([mac, details]) => <Widget key={mac} {...details} />)}
        </ul>
      </div>
    </div>
  );
}

export default App;
