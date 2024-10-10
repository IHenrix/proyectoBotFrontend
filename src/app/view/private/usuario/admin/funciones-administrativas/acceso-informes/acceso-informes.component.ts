import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccesoInformesService } from 'src/app/service/acceso-informes.service';
import { convertirBase64aPDF } from 'src/app/util/helpers';
import Swal from 'sweetalert2';
Exporting(Highcharts);
@Component({
  selector: 'app-acceso-informes',
  templateUrl: './acceso-informes.component.html',
  styleUrls: ['./acceso-informes.component.scss']
})
export class AccesoInformesComponent {

  formBusqueda = new FormGroup({
    reporte: new FormControl(''),
    inicio: new FormControl(new Date().getFullYear() + '-01-01', [Validators.required]),
    fin: new FormControl(new Date().getFullYear() + '-12-31', [Validators.required]),
  });

  constructor(
    private ref: ChangeDetectorRef,
    private accesoInformesService: AccesoInformesService,
    private spinner: NgxSpinnerService
  ) { }

  get fv() {
    return this.formBusqueda.controls;
  }

  HighchartsPrimero: typeof Highcharts = Highcharts;
  chartOptionsPrimero: any;
  HighchartsSegundo: typeof Highcharts = Highcharts;
  chartOptionsSegundo: any;
  HighchartsTercero: typeof Highcharts = Highcharts;
  chartOptionsTercero: any;
  HighchartsCuatro: typeof Highcharts = Highcharts;
  chartOptionsCuatro: any;
  fontFamilyCustom: string = '\'Roboto Condensed\', sans-serif';
  ngOnInit(): void {
    this.buscar();
  }
  buscar() {
    this.cargarDashboard();
  }
  limpiar() {
    this.formBusqueda.setValue({
      reporte:null,
      inicio:new Date().getFullYear() + '-01-01',
      fin:new Date().getFullYear() + '-12-31'
    });
    this.buscar() ;
  }

  cargarDashboard() {
    this.accesoInformesService.categoriasMasUsadas(this.formBusqueda.getRawValue()).subscribe(resp => {
      let data = [];
      if (resp.cod == 1) {
        data = resp.list;
      }
      this.chartOptionsPrimero = {
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
          text: 'TOP CATEGORIAS MÁS CONSULTADAS',
          style: {
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '15px'
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
        exporting: {
          buttons: {
            contextButton: {
              menuItems: [
                {
                  text: 'Exportar a PDF',
                  onclick: () => {
                    this.confirmarGenerarInforme("1", "1");
                  }
                },
                {
                  text: 'Exportar a Excel',
                  onclick: () => {
                    this.confirmarGenerarInforme("2", "1");
                  }
                },
                {
                  text: 'Pantalla completa',
                  onclick: function () {
                    if (this.fullscreen.isOpen) {
                      this.fullscreen.close();
                    } else {
                      this.fullscreen.open();
                    }
                  },
                  update: function () {
                    if (this.fullscreen.isOpen) {
                      this.settext = ('Salir de Pantalla completa');
                    }
                  }
                },
                {
                  text: 'Imprimir',
                  onclick: function () {
                    this.print();
                  }
                },
              ]
            }
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
          name: 'CONSULTAS',
          colorByPoint: true,
          data: data,
        }]
      };

    });

    this.accesoInformesService.topDiasConsultas(this.formBusqueda.getRawValue()).subscribe(resp => {
      let data = [];
      if (resp.cod == 1) {
        data = resp.list.map(item => [item.dias, parseInt(item.consultas)])
      }
      this.chartOptionsSegundo = {
        chart: {
          type: 'column',
          backgroundColor: 'transparent',
          style: {
            color: '#E0E0E3',
            fontFamily: this.fontFamilyCustom
          }
        },
        exporting: {
          buttons: {
            contextButton: {
              menuItems: [
                {
                  text: 'Exportar a PDF',
                  onclick: () => {
                    this.confirmarGenerarInforme("1", "2");
                  }
                },
                {
                  text: 'Exportar a Excel',
                  onclick: () => {
                    this.confirmarGenerarInforme("2", "2");
                  }
                },
                {
                  text: 'Pantalla completa',
                  onclick: function () {
                    if (this.fullscreen.isOpen) {
                      this.fullscreen.close();
                    } else {
                      this.fullscreen.open();
                    }
                  },
                  update: function () {
                    if (this.fullscreen.isOpen) {
                      this.settext = ('Salir de Pantalla completa');
                    }
                  }
                },
                {
                  text: 'Imprimir',
                  onclick: function () {
                    this.print();
                  }
                },
              ]
            }
          }
        },
        title: {
          text: "TOP 10 - DÍAS CON MÁS CONSULTAS REALIZADAS",
          style: {
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '15px'
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
            text: 'N° DE CONSULTAS',
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
          name: 'N° DE CONSULTAS',
          data: data,
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
    });

    this.accesoInformesService.listaMesesConsulta(this.formBusqueda.getRawValue()).subscribe(resp => {
      let meses = [];
      let consultas = [];
      if (resp.cod == 1) {
        meses = resp.list.map(item => item.mes);
        consultas = resp.list.map(item => item.consultas);
      }
      this.chartOptionsTercero = {
        chart: {
          type: 'spline',
          backgroundColor: 'transparent',
        },
        exporting: {
          buttons: {
            contextButton: {
              menuItems: [
                {
                  text: 'Exportar a PDF',
                  onclick: () => {
                    this.confirmarGenerarInforme("1", "3");
                  }
                },
                {
                  text: 'Exportar a Excel',
                  onclick: () => {
                    this.confirmarGenerarInforme("2", "3");
                  }
                },
                {
                  text: 'Pantalla completa',
                  onclick: function () {
                    if (this.fullscreen.isOpen) {
                      this.fullscreen.close();
                    } else {
                      this.fullscreen.open();
                    }
                  },
                  update: function () {
                    if (this.fullscreen.isOpen) {
                      this.settext = ('Salir de Pantalla completa');
                    }
                  }
                },
                {
                  text: 'Imprimir',
                  onclick: function () {
                    this.print();
                  }
                },
              ]
            }
          }
        },
        title: {
          text: 'CONSULTAS POR MES',
          style: {
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '15px'
          }
        },
        xAxis: {
          categories: meses,
          labels: {
            style: {
              color: '#E0E0E3',
              fontSize: '13px'
            }
          },
          accessibility: {
            description: 'Meses del Año'
          }
        },
        yAxis: {
          title: {
            text: 'Consultas',
          },
          labels: {
            format: '{value}°',
            style: {
              color: '#E0E0E3',
              fontSize: '13px'
            }
          }
        },
        tooltip: {
          crosshairs: true,
          shared: true,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          style: {
            color: '#F0F0F0'
          }
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
        series: [{
          name: 'Consultas',
          marker: {
            symbol: 'square'
          },
          /*data: [5.2, 5.7, 8.7, 13.9, 18.2, 21.4, 25.0, {
            y: 26.4,
            marker: {
              symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
            },
            accessibility: {
              description: 'Sunny symbol, this is the warmest point in the ' +
                'chart.'
            }
          }, 22.8, 17.5, 12.1, 7.6]*/

          data: consultas

        }]
      }
    });

    this.accesoInformesService.topUsuariosConsultas(this.formBusqueda.getRawValue()).subscribe(resp => {
      let usuarios = [];
      let categoria = [];
      if (resp.cod == 1) {
        usuarios = resp.list.map(item => item.nombre);
        categoria = this.agruparCategoriasPorUsuario(resp.list);
      }
      this.chartOptionsCuatro = {
        chart: {
          type: 'bar',
          backgroundColor: 'transparent',
        },
        exporting: {
          buttons: {
            contextButton: {
              menuItems: [
                {
                  text: 'Exportar a PDF',
                  onclick: () => {
                    this.confirmarGenerarInforme("1", "4");
                  }
                },
                {
                  text: 'Exportar a Excel',
                  onclick: () => {
                    this.confirmarGenerarInforme("2", "4");
                  }
                },
                {
                  text: 'Pantalla completa',
                  onclick: function () {
                    if (this.fullscreen.isOpen) {
                      this.fullscreen.close();
                    } else {
                      this.fullscreen.open();
                    }
                  },
                  update: function () {
                    if (this.fullscreen.isOpen) {
                      this.settext = ('Salir de Pantalla completa');
                    }
                  }
                },
                {
                  text: 'Imprimir',
                  onclick: function () {
                    this.print();
                  }
                },
              ]
            }
          }
        },
        title: {
          text: 'USUARIOS CON MAS CONSULTAS REALIZADAS',
          style: {
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '15px'
          }
        },
        xAxis: {
          categories: usuarios,
          labels: {
            style: {
              color: '#E0E0E3',
              fontSize: '13px'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Consultas'
          },
          labels: {
            style: {
              color: '#E0E0E3',
              fontSize: '13px'
            }
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
          series: {
            stacking: 'normal',
            dataLabels: {
              enabled: true
            }
          }
        },
        series: categoria
      }
    });
  }

  agruparCategoriasPorUsuario(data) {
    const resultado = [];
    data.forEach(usuario => {
      usuario.lstCategoria.forEach(categoria => {
        const categoriaExistente = resultado.find(item => item.name === categoria.categoria);
        if (categoriaExistente) {
          categoriaExistente.data.push(categoria.consultas);
        } else {
          resultado.push({
            name: categoria.categoria,
            data: [categoria.consultas]
          });
        }
      });
    });
    return resultado;
  }


  confirmarGenerarInforme(tipo: string, reporte: string) {
    let tipoTexto: string = "a formato PDF";
    if (tipo == "2") {
      tipoTexto = "a formato EXCEL"
    }
    Swal.fire({
      icon: "warning",
      title: "¿Desea generar su informe " + tipoTexto + "?",
      text: "Por favor verificar todos los datos antes de continuar",
      confirmButtonText: '<span style="padding: 0 12px;">Sí, generar</span>',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      cancelButtonColor: '#EB3219',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.fv.reporte.setValue(reporte)
        const request = this.formBusqueda.getRawValue();
        if (tipo == "1") {
          this.spinner.show();
          this.accesoInformesService.exportarAccesoInformacionPDF(request).subscribe(resp => {
            convertirBase64aPDF(resp);
            this.spinner.hide();
          });
        }
        else {
          this.spinner.show();
          this.accesoInformesService.exportarAccesoInformacionExcel(request).subscribe(resp => {
            this.spinner.hide();
            const blob = new Blob([resp], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'ReporteExcel.xlsx';
            anchor.click();
            window.URL.revokeObjectURL(url);
            this.spinner.hide();
          });
        }
      }
    });
  }
}
