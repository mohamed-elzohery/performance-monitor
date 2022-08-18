import React from 'react';
import GaugeChart from 'react-gauge-chart'


const Guage: React.FC<{value: number}> = ({value}) => {
    return <GaugeChart 
            id="gauge-chart1"
            hideText={true}
            arcWidth={.2}
            style={{marginTop:'2rem'}}
            cornerRadius={0}
            percent={value / 100}
            animate={false}
            />

}

export default Guage;