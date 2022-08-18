import React, { useEffect } from 'react';
import classes from './App.module.css';
import socket from './utils/socket';



function App() {
  
  useEffect(() => {
    socket.on('data', console.log);
  }, []);

  return (
    <div className="App">
      <div className={classes.app__container}>
        <ul className={classes.machineList}>
          <li className={classes.machineList__item}>
            sdvsdvsdvsdvsdv
          </li>
          <li className={classes.machineList__item}>
            sdvsdvsdvsdvsdv
          </li>
          <li className={classes.machineList__item}>
            sdvsdvsdvsdvsdv
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
