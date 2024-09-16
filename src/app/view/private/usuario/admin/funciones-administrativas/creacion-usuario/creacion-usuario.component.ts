import { ChangeDetectorRef, Component, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { CodNombre } from 'src/app/interfaces/auth/private/cod-nombre';
import { AdminService } from 'src/app/service/admin.service';

import { alertNotificacion, languageDataTable } from 'src/app/util/helpers';

@Component({
  selector: 'app-creacion-usuario',
  templateUrl: './creacion-usuario.component.html',
  styleUrls: ['./creacion-usuario.component.scss']
})
export class CreacionUsuarioComponent {

  @ViewChild('modal_ver_usuario') modal_ver_usuario: NgbModalRef;
  modal_ver_usuario_va: any;

  listaUsuario :any = [];
  constructor(
    private modalservice: NgbModal,
    private ref: ChangeDetectorRef,
    private adminService:AdminService,
    private spinner: NgxSpinnerService,
  ) { }
  @ViewChildren(DataTableDirective) private dtElements;
  datatable_usuario: DataTables.Settings = {};

  formBusqueda = new FormGroup({
    nombre: new FormControl(""),
    apellidoPaterno: new FormControl(""),
    apellidoMaterno: new FormControl(""),
    usuario: new FormControl(""),
  });

  listaSexo: CodNombre<string>[] = [
    { cod: "M", nombre: "MASCULINO" },
    { cod: "F", nombre: "FEMENINO" }
  ];

  listaCarrera: CodNombre<string>[] = [];

  formUsuario = new FormGroup({
    usuario: new FormControl(""),
    password: new FormControl(""),
    apellidoPaterno: new FormControl(""),
    apellidoMaterno: new FormControl(""),
    nombre: new FormControl(""),
    sexo: new FormControl(""),
    codigo: new FormControl(""),
    email: new FormControl(""),
    telefono: new FormControl(""),
    idCarrera: new FormControl(""),
    rol: new FormControl("")
  });
  modalOpciones: NgbModalOptions = {
    centered: true,
    animation: true,
    backdrop: 'static',
    keyboard: false
  }

  datatable_dtTrigger_usuario: Subject<ADTSettings> = new Subject<ADTSettings>();
  tipoAccion:number;

  ngOnInit(): void {
    setTimeout(() => {
    this.datatable_usuario = {
      dom: '<"top"if>rt<"bottom">p<"clear">',
      paging: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      language: languageDataTable("Usuarios"),
      columns: [
        { data: 'usuario' },
        { data: 'usuario' },
        { data: 'nombre' },
        { data: 'apellido_paterno' },
        { data: 'apellido_materno' },
        { data: 'codigo' },
        { data: 'email' },
        { data: 'telefono' },
        { data: 'carrera' },
        {
          data: 'usuario', render: (data: any, type: any, full: any) => {
            return '<div class="btn-group"><button type="button" style ="margin-right:5px;"  class="btn-sunarp-cyan edit_usu mr-3"><i class="fa fa-pencil" aria-hidden="true"></i></button><button type="button" class="btn-sunarp-red eliminar_usu mr-3"><i class="fa fa-trash" aria-hidden="true"></i></button></div';
          }
        },
      ],
      columnDefs: [
        { orderable: false, className: "text-center align-middle", targets: 0, },
        { className: "text-center align-middle", targets: '_all' }
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('.ver_deta_soli', row).off().on('click', () => {

        })
        row.childNodes[0].textContent = String(index + 1);
        return row;
      }
    }
    });
    this.adminService.listaCarrera().subscribe(listaCarrera => this.listaCarrera=listaCarrera);
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.datatable_dtTrigger_usuario.next(this.datatable_usuario);
      this.buscar()
    }, 200);
  }

  ngOnDestroy(): void {
    this.datatable_dtTrigger_usuario.unsubscribe();
  }

  buscar(){
    let valores = this.formBusqueda.getRawValue();
    let valoresEnMayusculas = Object.keys(valores).reduce((acc, key) => {
      acc[key] = valores[key] ? valores[key].toString().toUpperCase() : valores[key];
      return acc;
    }, {});
    this.spinner.show();
    this.adminService.listarUsuarios(valoresEnMayusculas).subscribe(resp => {
      this.listaUsuario=[];
      if(resp.cod===1){
        this.listaUsuario=resp.list;
      }
      else{
        alertNotificacion(resp.mensaje,resp.icon,resp.mensajeTxt);
      }
      this.recargarTabla();
      this.spinner.hide();
    });
  }

  limpiar(){
    this.formBusqueda.reset();
    setTimeout(() => {
      this.buscar()
    }, 200);
  }
  
  abrirModal(){
    this.modal_ver_usuario_va = this.modalservice.open(this.modal_ver_usuario, { ...this.modalOpciones,size: 'xl' });
  }
  accionArchivo(tipoAccion: number) {
    this.tipoAccion = tipoAccion;
    this.abrirModal();
  }
  recargarTabla() {
    let tabla_ren = this.dtElements._results[0].dtInstance;
    tabla_ren.then((dtInstance: DataTables.Api) => {
      dtInstance.search('').clear().rows.add(this.listaUsuario).draw();
    });
    this.ref.detectChanges();
  }

}
