import { ChangeDetectorRef, Component, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { CodNombre } from 'src/app/interfaces/auth/private/cod-nombre';
import { AdminService } from 'src/app/service/admin.service';
import { SupervisionConsultaService } from 'src/app/service/supervision-consultas.service';
import { alertNotificacion, languageDataTable } from 'src/app/util/helpers';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supervision-consultas',
  templateUrl: './supervision-consultas.component.html',
  styleUrls: ['./supervision-consultas.component.scss']
})
export class SupervisionConsultasComponent {

  constructor(
    private ref: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private adminService: AdminService,
    private modalservice: NgbModal,
    private supervisionConsultaService: SupervisionConsultaService
  ) { }

  formBusqueda = new FormGroup({
    categoria: new FormControl(""),
    usuario: new FormControl(""),
  });

  listaEstudiantes: CodNombre<number>[] = [];
  listaCategoria: CodNombre<number>[] = [];
  listaConsulta: any = [];
  listaConsultaDetalle: any = [];
  categoriaSeleccionada:string="";

  @ViewChildren(DataTableDirective) private dtElements;
  datatable_consulta: DataTables.Settings = {};
  datatable_dtTrigger_consulta: Subject<ADTSettings> = new Subject<ADTSettings>();

  @ViewChild('modal_ver_detalle') modal_ver_detalle: NgbModalRef;
  modal_ver_detalle_va: any;
  modalOpciones: NgbModalOptions = {
    centered: true,
    animation: true,
    backdrop: 'static',
    keyboard: false
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.datatable_consulta = {
        dom: '<"top"if>rt<"bottom">p<"clear">',
        paging: true,
        pagingType: 'full_numbers',
        pageLength: 10,
        responsive: true,
        language: languageDataTable("Consultas"),
        columns: [
          { data: 'nombre' },
          { data: 'nombre' },
          { data: 'categoria' },
          { data: 'total_consultas' },
          { data: 'ultima_fecha' },
          {
            data: 'nombre', render: (data: any, type: any, full: any) => {
              return '<div class="btn-group"><button type="button" style ="margin-right:5px;" class="btn-sunarp-cyan ver_detalle mr-3"><i class="fa fa-eye" aria-hidden="true"></i> Ver Detalles</button><button type="button" class="btn-sunarp-red generar_reporte mr-3"><i class="fa fa-file" aria-hidden="true"></i> Generar Informe</button></div';
            }
          },
        ],
        columnDefs: [
          { orderable: false, className: "text-center align-middle", targets: 0, },
          { className: "text-center align-middle", targets: '_all' }
        ],
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          $('.ver_detalle', row).off().on('click', () => {
            this.verDetalleModal(data);
          });
          $('.generar_reporte', row).off().on('click', () => {
            this.generarInforme(data);
          });
          row.childNodes[0].textContent = String(index + 1);
          return row;
        }
      }
    });
    this.adminService.listarEstudiantes().subscribe(listaEstudiantes => this.listaEstudiantes = listaEstudiantes);
    this.adminService.listarCategoria().subscribe(listaCategoria => this.listaCategoria = listaCategoria);

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.datatable_dtTrigger_consulta.next(this.datatable_consulta);
      this.buscar();
    }, 200);
  }
  ngOnDestroy(): void {
    this.datatable_dtTrigger_consulta.unsubscribe();
  }

  buscar(){
    let valores = this.formBusqueda.getRawValue();
    this.spinner.show();
    this.supervisionConsultaService.listaConsultas(valores).subscribe(resp => {
      this.listaConsulta = [];
      if (resp.cod === 1 || resp.cod === 0) {
        this.listaConsulta = resp.list;
      }
      else {
        alertNotificacion(resp.mensaje, resp.icon, resp.mensajeTxt);
      }
      this.recargarTabla();
      this.spinner.hide();
    });
  }
  limpiar(){
    this.formBusqueda.setValue({
      categoria:"",
      usuario:""
    })
    setTimeout(() => {
      this.buscar()
    }, 200);
  }
  recargarTabla() {
    let tabla_ren = this.dtElements._results[0].dtInstance;
    tabla_ren.then((dtInstance: DataTables.Api) => {
      dtInstance.search('').clear().rows.add(this.listaConsulta).draw();
    });
    this.ref.detectChanges();
  }

  verDetalleModal(data:any){
    const request={categoria:data.id_categoria,usuario:data.id_persona};
    this.categoriaSeleccionada=data.categoria;
    this.spinner.show();
    this.supervisionConsultaService.listaConsultaDetalle(request).subscribe(resp => {
      this.listaConsultaDetalle = [];
      if (resp.cod === 1) {
        this.listaConsultaDetalle = resp.list;
        this.modal_ver_detalle_va = this.modalservice.open(this.modal_ver_detalle, { ...this.modalOpciones, size: 'xl', centered: true, animation: true });
        setTimeout(() => {
          document.querySelector(".modal").scrollTo({top:0,behavior:'smooth'});
        }, 10);

      }
      else {
        alertNotificacion(resp.mensaje, resp.icon, resp.mensajeTxt);
      }
      this.recargarTabla();
      this.spinner.hide();
    });
  }

  generarInforme(data:any){
    Swal.fire({
      icon: "info",
      title: "¿Que formato desea generar su informe?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Exportar a PDF",
      denyButtonText: 'Exportar a Excel',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#EB3219',
      denyButtonColor:'#198754',
      cancelButtonColor: '#EB3219',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmarGenerarInforme(data,"1");
      } else if (result.isDenied) {
        this.confirmarGenerarInforme(data,"2");
      }
    });
  }

  confirmarGenerarInforme(data:any,tipo:string){
    let tipoTexto:string="a formato PDF";
    if(tipo=="2"){
      tipoTexto="a formato EXCEL"
    }
    Swal.fire({
      icon: "warning",
      title: "¿Desea generar su informe por la categoria " + data.categoria + " " + tipoTexto + "?",
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
        if(tipo=="1"){
          this.spinner.show();
          const request={categoria:data.id_categoria,usuario:data.id_persona};
          this.supervisionConsultaService.exportarSupervisionConsultaPDF(request).subscribe(resp => {
            this.convertirBase64aPDF(resp);
            this.spinner.hide();
          });
        }
        else{

        }
      }
    });
  }

  convertirBase64aPDF(data) {
    if (data != null) {
      var base64str = data;

      var binary = atob(base64str.replace(/\s/g, ''));
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }
      var file = new Blob([view], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  }


}
