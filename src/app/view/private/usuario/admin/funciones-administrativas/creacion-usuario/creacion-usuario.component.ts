import { Component, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';

import { languageDataTable } from 'src/app/util/helpers';

@Component({
  selector: 'app-creacion-usuario',
  templateUrl: './creacion-usuario.component.html',
  styleUrls: ['./creacion-usuario.component.scss']
})
export class CreacionUsuarioComponent {

  listaUsuario :any = [];
  @ViewChildren(DataTableDirective) private dtElements;
  datatable_usuario: DataTables.Settings = {};

  datatable_dtTrigger_usuario: Subject<ADTSettings> = new Subject<ADTSettings>();



  formRegistro = new FormGroup({
    inicio: new FormControl("2022-10-01",[Validators.required]),
    fin: new FormControl("2022-12-31",[Validators.required]),
    tipo_obj: new FormControl(""),
    anho_obj: new FormControl(""),
    nu_objt: new FormControl(""),
    fech_pag: new FormControl(""),
    tipo_estado : new FormControl(""),
    tramite : new FormControl("")
  });
  formValid = false;

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
        { data: 'paterno' },
        { data: 'materno' },
        { data: 'codAlumno' },
        { data: 'email' },
        { data: 'telfcel' },
        { data: 'carrera' },
        {
          data: 'usuario', render: (data: any, type: any, full: any) => {
            return '<div class="btn-group"><button type="button" class="btn-sunarp-green ver_deta_soli"><i class="fa fa-eye mr-2" aria-hidden="true"></i>Ver</button></div';
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
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.datatable_dtTrigger_usuario.next(this.datatable_usuario);
    }, 200);
  }


  ngOnDestroy(): void {
    this.datatable_dtTrigger_usuario.unsubscribe();
  }
}
