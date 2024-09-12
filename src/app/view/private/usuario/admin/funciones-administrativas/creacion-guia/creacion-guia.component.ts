import { ChangeDetectorRef, Component, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { AdminService } from 'src/app/service/admin.service';

import { alertNotificacion, languageDataTable } from 'src/app/util/helpers';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creacion-guia',
  templateUrl: './creacion-guia.component.html',
  styleUrls: ['./creacion-guia.component.scss']
})
export class CreacionGuiaComponent {

  @ViewChild('modal_ver_archivo') modal_ver_archivo: NgbModalRef;
  modal_ver_archivo_va: any;


  listaArchivos :any = [];
  tipoAccion:number;
  constructor(
    private modalservice: NgbModal,
    private ref: ChangeDetectorRef,
    private adminService:AdminService,
    private spinner: NgxSpinnerService,
  ) { }
  @ViewChildren(DataTableDirective) private dtElements;
  datatable_archivos: DataTables.Settings = {};

  datatable_dtTrigger_archivos: Subject<ADTSettings> = new Subject<ADTSettings>();
  modalOpciones: NgbModalOptions = {
    centered: true,
    animation: true,
    backdrop: 'static',
    keyboard: false
  }

  formGuia = new FormGroup({
    nombre : new FormControl(""),
    descripcion : new FormControl(""),
    idTipoArchivo: new FormControl(1)
  });

  selectedFile: File | null = null;


  ngOnInit(): void {
    setTimeout(() => {
    this.datatable_archivos = {
      dom: '<"top"if>rt<"bottom">p<"clear">',
      paging: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      language: languageDataTable("Guia"),
      columns: [
        { data: 'id' },
        { data: 'nombre' },
        { data: 'descripcion' },
        { data: 'tipo' },
        {
          data: 'id', render: (data: any, type: any, full: any) => {
            return '<div class="btn-group"><button type="button" class="btn-sunarp-green editar_archivo"><i class="fa fa-eye" aria-hidden="true"></i> Ver</button><button type="button" class="btn-sunarp-red eliminar_archivo mr-3"><i class="fa fa-trash" aria-hidden="true"></i> Eliminar</button></div';
          }
        },
      ],
      columnDefs: [
        { orderable: false, className: "text-center align-middle", targets: 0, },
        { className: "text-center align-middle", targets: '_all' }
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('.editar_archivo', row).off().on('click', () => {
          this.mostrarEdicionArchivo(data);
        });
        $('.eliminar_archivo', row).off().on('click', () => {
          this.eliminarArchivo(data);
        })
        row.childNodes[0].textContent = String(index + 1);
        return row;
      }
    }
    });
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.datatable_dtTrigger_archivos.next(this.datatable_archivos);
      this.buscar()
    }, 200);
  }

  ngOnDestroy(): void {
    this.datatable_dtTrigger_archivos.unsubscribe();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }


  buscar(){
    this.spinner.show();
    this.adminService.listarArchivos({idTipoArchivo:null}).subscribe(resp => {
      this.listaArchivos=[];
      if(resp.cod===1){
        this.listaArchivos=resp.list;
      }
      else{
        //alertNotificacion(resp.mensaje,resp.icon,resp.mensajeTxt);
      }
      this.recargarTabla();
      this.spinner.hide();
    });
  }

  accionArchivo(tipoAccion:number){
    this.tipoAccion=tipoAccion;
    this.formGuia.controls.nombre.setValue("");
    this.formGuia.controls.descripcion.setValue("");
    this.selectedFile=null;
    this.abrirModal();
  }

  abrirModal(){
    this.modal_ver_archivo_va = this.modalservice.open(this.modal_ver_archivo, { ...this.modalOpciones });
  }
  mostrarEdicionArchivo(data:any){
    this.adminService.buscarArchivo(data.id).subscribe(resp => {
      if(resp.cod===1){
        this.accionArchivo(2);
        this.formGuia.controls.nombre.setValue(resp.model.nombre);
        this.formGuia.controls.descripcion.setValue(resp.model.descripcion)
      }
      else{
        alertNotificacion(resp.mensaje,resp.icon,resp.mensajeTxt);
      }

      this.spinner.hide();
    });
  }
  
  guardarArchivo(){
    if (this.formGuia.valid && this.selectedFile) {
      const formValues = this.formGuia.value;
      this.spinner.show();
      this.adminService.crearArchivo(formValues, this.selectedFile).subscribe(resp => {
        if(resp.cod===1){
          alertNotificacion("Se ha creado la Guía satisfactoriamente","success");
          this.modal_ver_archivo_va.close();
          this.buscar();
        }
        else{
          alertNotificacion(resp.mensaje,resp.icon,resp.mensajeTxt);
        }
        this.spinner.hide();
      });
    }
  }
  recargarTabla() {
    let tabla_ren = this.dtElements._results[0].dtInstance;
    tabla_ren.then((dtInstance: DataTables.Api) => {
      dtInstance.search('').clear().rows.add(this.listaArchivos).draw();
    });
    this.ref.detectChanges();
  }
  eliminarArchivo(data:any){
    Swal.fire({
      icon: "warning",
      title: "¿Desea eliminar la guía?",
      text: "Esta acción es permanente",
      confirmButtonText: '<span style="padding: 0 12px;">Sí, eliminar</span>',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      cancelButtonColor: '#EB3219',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.adminService.eliminarArchivo(data.id).subscribe(resp => {
          alertNotificacion(resp.mensaje,resp.icon,resp.mensajeTxt);
          this.buscar();
          this.spinner.hide();
        });
      }
    });
  }
}
