const dashboardChartsConfig = {
    chartOptions: {
        labels: ['Ganhou', 'Aguardando', 'Perdeu'],
        plotOptions: {
            radialBar: {
                size: 165,
                offsetY: -5,
                hollow: {
                    size: '20%'
                },
                track: {
                    background: "#ebebeb",
                    strokeWidth: '100%',
                    margin: 15,
                },
                dataLabels: {
                    show: true,
                    name: {
                        fontSize: '18px',
                    },
                    value: {
                        fontSize: '16px',
                        color: "#636a71",
                        offsetY: 11
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: this.somaTickets
                    }
                }
            },
        },
        responsive: [{
            breakpoint: 576,
            options: {
                plotOptions: {
                    radialBar: {
                        size: 150,
                        hollow: {
                            size: '20%'
                        },
                        track: {
                            background: "#ebebeb",
                            strokeWidth: '100%',
                            margin: 15,
                        },
                    }
                }
            }
        }],
        colors: ['#4DE98A', '#FF9F43', '#EA5455'],
        fill: {
            type: 'gradient',
            gradient: {
                // enabled: true,
                shade: 'dark',
                type: 'vertical',
                shadeIntensity: 0.5,
                gradientToColors: ['#65dd91', '#FFC085', '#f29292'],
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            },
        },
        stroke: {
            lineCap: 'round'
        },
        chart: {
            height: 355,
            dropShadow: {
                enabled: true,
                blur: 3,
                left: 1,
                top: 1,
                opacity: 0.1
            },
        }
    },
    chartMediaOptions: {
        chart: {
            toolbar: {show: false},
            dropShadow: {
                enabled: true,
                top: 5,
                left: 0,
                blur: 4,
                opacity: 0.10,
            },
        },
        stroke: {
            curve: 'smooth',
            dashArray: [0, 8],
            width: [4, 2],
        },
        grid: {
            borderColor: '#e7e7e7',
        },
        legend: {
            show: false,
        },
        colors: ['#F97794', '#b8c2cc'],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                inverseColors: false,
                gradientToColors: ['#7367F0', '#b8c2cc'],
                shadeIntensity: 1,
                type: 'horizontal',
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100]
            },
        },
        markers: {
            size: 0,
            hover: {
                size: 5
            }
        },
        xaxis: {
            labels: {
                style: {
                    cssClass: 'text-grey fill-current',
                }
            },
            axisTicks: {
                show: false,
            },
            categories: [],
            axisBorder: {
                show: false,
            },
        },
        yaxis: {
            tickAmount: 5,
            labels: {
                style: {
                    cssClass: 'text-grey fill-current',
                },
                formatter: function (val) {
                    return val > 999 ? (val / 1000).toFixed(1) + 'k' : val;
                }
            }
        },
        tooltip: {
            x: {show: false}
        }
    },
}