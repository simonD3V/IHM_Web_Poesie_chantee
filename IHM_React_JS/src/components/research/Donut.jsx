import React from 'react';
import Chart from 'react-apexcharts'

function Donut({ series, labels }) {

    const options = {
        colors: ['#B1D3DD', '#B2DA82', '#FFC300', '#FF5733', '#80624D'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                }
            }
        }],
        dataLabels: {
            enabled: false,
        },
        fill: {
            colors: ['#B1D3DD', '#B2DA82', '#FFC300', '#FF5733', '#80624D'],
            type: 'gradient' // gradient -> à voir 
        },
        legend: {
            show: true,
            showForSingleSeries: false,
            showForNullSeries: true,
            showForZeroSeries: true,
            position: 'top',
            horizontalAlign: 'center',
            labels: {
                colors: ['#B1D3DD', '#B2DA82', '#FFC300', '#FF5733', '#80624D'],
                useSeriesColors: false
            },
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                strokeColor: ['#B1D3DD', '#B2DA82', '#FFC300', '#FF5733', '#80624D'],
                fillColors: ['#B1D3DD', '#B2DA82', '#FFC300', '#FF5733', '#80624D'],
                radius: 12,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
            },
        },
        series: series,
        labels: labels,

        // theme: {
        //     palette: 'palette7'
        // },
    }


    return (
        <div className="donut">
            {console.log(labels)}
            <Chart options={options} series={series} type="donut" width="500" labels={labels} />
        </div>
    );
}


export default Donut;