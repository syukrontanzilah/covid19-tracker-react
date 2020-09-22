import React, {useState, useEffect} from 'react'
import './LineGraph.css'
import {Line} from 'react-chartjs-2'
import numeral from 'numeral'

const options = {
    legend: {
        display:false,
    },
    elements: {
        point:{
            radius:0
        }
    },
    maintainAspectRatio: false,
    tooltips:{
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0")
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format:'MM/DD/YY',
                    tooltipFormat: 'll'
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function(value, index, values) {
                        return numeral(value).format("0a");
                    }
                }
            },
        ]
    }
}

    const bulidChartData = (data, casesType="cases") => {
        const chartData = []
        let lastDataPoint;
    
       for(let date in data.cases)  {
            if(lastDataPoint){
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
               chartData.push(newDataPoint)
            }
             lastDataPoint = data[casesType][date];
        }
        return chartData
    }

function LineGraph() {
    const [data, setData] = useState({})



useEffect((casesType="cases")=> {
    const fetchData = async () => {
await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
.then(response => response.json())
.then(data => {
    let chartData = bulidChartData(data, 'cases')
    setData(chartData)
})
    }
    fetchData()
}, [])



    return (
        <div className="lineGraph">
            {data?.length > 0 && (
                <Line
           data = {{
               datasets: [{
                   backgroundColor:"rgba(204,16,52, 0.5)",
                   borderColor:'#cc1034',
                   data: data,
               }]
           }}
           options={options}
           /> 
            )}
          
        </div>
    )
}

export default LineGraph
