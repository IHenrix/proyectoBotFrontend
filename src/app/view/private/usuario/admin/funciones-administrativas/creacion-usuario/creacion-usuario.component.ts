import { ChangeDetectorRef, Component, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { CodNombre } from 'src/app/interfaces/auth/private/cod-nombre';
import { AdminService } from 'src/app/service/admin.service';
import { FormValidationCustomService } from 'src/app/util/form-validation-custom.service';

import { alertNotificacion, languageDataTable } from 'src/app/util/helpers';
import Swal from 'sweetalert2';

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
    private customvalidator: FormValidationCustomService,

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
    usuario: new FormControl("",[Validators.required]),
    password: new FormControl("",[Validators.required]),
    confirmPassword: new FormControl("",[Validators.required]),
    apellidoPaterno: new FormControl("",[Validators.required]),
    apellidoMaterno: new FormControl("",[Validators.required]),
    nombre: new FormControl("",[Validators.required]),
    sexo: new FormControl("",[Validators.required]),
    codigo: new FormControl("",[Validators.required]),
    email: new FormControl("",[Validators.required,Validators.email]),
    telefono: new FormControl("",[Validators.required,this.customvalidator.ValidateTelfCelLenght]),
    idCarrera: new FormControl("",[Validators.required]),
    rol: new FormControl("",[Validators.required])
  });
  get fBus() {
    return this.formUsuario.controls;
  }
  formBusValid:Boolean = false;

  modalOpciones: NgbModalOptions = {
    centered: true,
    animation: true,
    backdrop: 'static',
    keyboard: false
  }

  datatable_dtTrigger_usuario: Subject<ADTSettings> = new Subject<ADTSettings>();
  tipoAccion:number;
  usuarioModel:any=null;

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
            return '<div class="btn-group"><button type="button" style ="margin-right:5px;" class="btn-sunarp-cyan edit_usu mr-3"><i class="fa fa-pencil" aria-hidden="true"></i></button><button type="button" class="btn-sunarp-red eliminar_usu mr-3"><i class="fa fa-trash" aria-hidden="true"></i></button></div';
          }
        },
      ],
      columnDefs: [
        { orderable: false, className: "text-center align-middle", targets: 0, },
        { className: "text-center align-middle", targets: '_all' }
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        $('.edit_usu', row).off().on('click', () => {
          this.mostrarEdicion(data);
        });
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
    this.formBusValid=false;
    this.usuarioModel=null;
    this.formUsuario.setValue({
      usuario: "",
      password: "",
      confirmPassword:"",
      apellidoPaterno: "",
      apellidoMaterno: "",
      nombre: "",
      sexo: "",
      codigo: "",
      email: "",
      telefono:"",
      idCarrera:"",
      rol: ""
    });
    this.abrirModal();
  }
  recargarTabla() {
    let tabla_ren = this.dtElements._results[0].dtInstance;
    tabla_ren.then((dtInstance: DataTables.Api) => {
      dtInstance.search('').clear().rows.add(this.listaUsuario).draw();
    });
    this.ref.detectChanges();
  }
  convertirEnMayusculas(campo: string): void {
    const valorActual = this.formUsuario.get(campo)?.value || '';
    this.formUsuario.get(campo)?.setValue(valorActual.toUpperCase(), { emitEvent: false });
  }
  convertirEnMinusculas(campo: string): void {
    const valorActual = this.formUsuario.get(campo)?.value || '';
    this.formUsuario.get(campo)?.setValue(valorActual.toLowerCase(), { emitEvent: false });
  }

  validarFormulario(){
    this.formBusValid = true;
    if (this.formUsuario.invalid) {
      return;
    }
    if(this.fBus.password.value!==this.fBus.confirmPassword.value){
      alertNotificacion("Las contraseñas deben ser iguales para continuar con la creación del usuario","warning","Por favor validar");
      return;
    }
  }

  crearUsuario(){
    this.validarFormulario();
    Swal.fire({
      icon: "warning",
      title: "¿Desea crear el usuario de "+this.fBus.nombre.value+" "+this.fBus.apellidoPaterno.value+" "+this.fBus.apellidoMaterno.value+"?",
      text: "Por favor verificar todos los datos antes de continuar",
      confirmButtonText: '<span style="padding: 0 12px;">Sí, crear</span>',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      cancelButtonColor: '#EB3219',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let formValues =this.formUsuario.getRawValue();
        let perfilArray = [
          { id: Number(this.fBus.rol.value) }
        ];
        (formValues as any).roles = perfilArray;
        delete formValues.confirmPassword;
        delete formValues.rol;
        this.spinner.show();
        this.adminService.crearUsuario(formValues).subscribe(resp => {
          if (resp.cod === 1) {
            this.modal_ver_usuario_va.close();
            this.buscar();
          }
          alertNotificacion(resp.mensaje, resp.icon, resp.mensajeTxt);
          this.spinner.hide();
        });
      }
    });
  }

  mostrarEdicion(data: any) {
    this.spinner.show();
    this.adminService.buscarPersona(data.id).subscribe(resp => {
      if (resp.cod === 1) {
        this.accionArchivo(2);
        this.usuarioModel = resp.model;
        this.formUsuario.setValue({
          usuario:this.usuarioModel.usuario,
          password: "******",
          confirmPassword:"******",
          apellidoPaterno: this.usuarioModel.apellido_paterno,
          apellidoMaterno: this.usuarioModel.apellido_materno,
          nombre: this.usuarioModel.nombre,
          sexo: this.usuarioModel.sexo,
          codigo:this.usuarioModel.codigo,
          email: this.usuarioModel.email,
          telefono:this.usuarioModel.telefono,
          idCarrera:this.usuarioModel.id_Carrera,
          rol: String(this.usuarioModel.roles[0].id)
        });
      }
      else {
        alertNotificacion(resp.mensaje, resp.icon, resp.mensajeTxt);
      }
      this.spinner.hide();
    });
  }

  editarArchivo() {
    this.validarFormulario();
    Swal.fire({
      icon: "warning",
      title: "¿Desea editar al usuario de "+this.fBus.nombre.value+" "+this.fBus.apellidoPaterno.value+" "+this.fBus.apellidoMaterno.value+"?",
      text: "Por favor verificar todos los datos antes de continuar",
      confirmButtonText: '<span style="padding: 0 12px;">Sí, crear</span>',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      cancelButtonColor: '#EB3219',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let formValues =this.formUsuario.getRawValue();
        let perfilArray = [
          { id: Number(this.fBus.rol.value) }
        ];
        (formValues as any).roles = perfilArray;
        (formValues as any).usuario_id = this.usuarioModel.usuario_id;
        (formValues as any).id = this.usuarioModel.id;
        delete formValues.confirmPassword;
        delete formValues.rol;
        if(formValues.password==="******"){
          formValues.password=null; //en caso que el usuario no modifique nada
        }
        this.spinner.show();
        this.adminService.editarUsuario(formValues).subscribe(resp => {
          if (resp.cod === 1) {
            this.modal_ver_usuario_va.close();
            this.buscar();
          }
          alertNotificacion(resp.mensaje, resp.icon, resp.mensajeTxt);
          this.spinner.hide();
        });
      }
    });

  }

}
