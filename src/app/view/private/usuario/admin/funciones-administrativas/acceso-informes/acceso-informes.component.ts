import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-acceso-informes',
  templateUrl: './acceso-informes.component.html',
  styleUrls: ['./acceso-informes.component.scss']
})
export class AccesoInformesComponent {

  HighchartsCategorias: typeof Highcharts = Highcharts;
  chartOptionsCategorias: any;
  HighchartsFrecuenciaUso: typeof Highcharts = Highcharts;
  chartOptionsFrecuenciaUso: any;

  HighchartsInteracciones: typeof Highcharts = Highcharts;
  chartOptionsInteracciones: any;

  private fontFamilyCustom: string = '\'Roboto Condensed\', sans-serif';




  ngOnInit(): void {

    this.cargarDashboard();
  }


  cargarDashboard() {
    // this._admService.reporte_ate_lima(this.firstDateSelected,this.lastDateSelected).subscribe(
    this.chartOptionsCategorias = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor: 'transparent',
        style: {
          color: '#E0E0E3',
          fontFamily: this.fontFamilyCustom
        }
      },
      title: {
        text: 'TOP 5- CATEGORIAS MÁS GENERADAS',
        style: {
          color: '#E0E0E3',
          textTransform: 'uppercase',
          fontSize: '20px'
        }
      },
      colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798bf', '#aaeeee'],
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y} TICKETS</b>',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
          color: '#F0F0F0'
        }
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      legend: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        itemStyle: {
          color: '#E0E0E3'
        },
        itemHoverStyle: {
          color: '#FFF'
        },
        itemHiddenStyle: {
          color: '#606063'
        },
        align: 'center',
        verticalAlign: 'bottom',
        floating: false,
        borderColor: '#CCC',
        borderWidth: 0,
        shadow: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}',
            color: '#F0F0F3',
            style: {
              fontSize: '13px'
            }
          },
          showInLegend: true,
          marker: {
            lineColor: '#333'
          }
        }
      },
      series: [{
        name: 'TICKETS',
        colorByPoint: true,
        data: [
          {
            "name": "SIR-RPV",
            "y": 7906,
            "sliced": true
          },
          {
            "name": "SIR",
            "y": 5464,
            "sliced": false
          },
          {
            "name": "SISTEMA DE MARCACIÓN PRESENCIAL",
            "y": 3764,
            "sliced": false
          },
          {
            "name": "SPR",
            "y": 3427,
            "sliced": false
          },
          {
            "name": "SPRN",
            "y": 3213,
            "sliced": false
          }
        ],
      }]
    };

    this.chartOptionsFrecuenciaUso = {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        style: {
          color: '#E0E0E3',
          fontFamily: this.fontFamilyCustom
        }
      },
      title: {
        text: "TOP 10 - TICKETS CON MÁS REASIGNACIONES",
        style: {
          color: '#E0E0E3',
          textTransform: 'uppercase',
          fontSize: '20px'
        }
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '13.5px'
          }
        },
        title: {
          style: {
            color: '#A0A0A3',
            textTransform: 'uppercase'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'N° DE SEGUIMIENTO',
          style: {
            color: '#A0A0A3',
            textTransform: 'uppercase'
          }
        },
        labels: {
          style: {
            color: '#E0E0E3'
          }
        }
      },
      colors: ['#e5af0f'],
      legend: {
        enabled: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
          color: '#F0F0F0'
        }
      },
      series: [{
        name: 'N° DE SEGUIMIENTO',
        data: [
          ["MDA039893-2024", 17],
          ["MDA031370-2024", 16],
          ["MDA031371-2024", 15],
          ["MDA031372-2024", 14],
          ["MDA031373-2024", 13],
          ["MDA031374-2024", 12],
          ["MDA031375-2024", 11]
        ],
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'center',
          format: '{point.y}',
          y: 10,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    };

    this.chartOptionsInteracciones = {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Monthly Average Temperature'
      },
      subtitle: {
        text: 'Source: ' +
          '<a href="https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature" ' +
          'target="_blank">Wikipedia.com</a>'
      },
      xAxis: {
        categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        accessibility: {
          description: 'Months of the year'
        }
      },
      yAxis: {
        title: {
          text: 'Temperature'
        },
        labels: {
          format: '{value}°'
        }
      },
      tooltip: {
        crosshairs: true,
        shared: true
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1
          }
        }
      },
      series: [{
        name: 'Tokyo',
        marker: {
          symbol: 'square'
        },
        data: [5.2, 5.7, 8.7, 13.9, 18.2, 21.4, 25.0, {
          y: 26.4,
          marker: {
            symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
          },
          accessibility: {
            description: 'Sunny symbol, this is the warmest point in the ' +
              'chart.'
          }
        }, 22.8, 17.5, 12.1, 7.6]

      }]
    }

    // )

  }
}
