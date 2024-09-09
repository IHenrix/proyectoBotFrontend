import { environment } from 'src/environments/environment';
import Swal, { SweetAlertIcon } from 'sweetalert2';

export function languageDataTable( 
    infoDetail: string = "registros", 
    searchText: string = "Buscar: ", 
    searchPlaceholderText:  string = "Término de búsqueda" ,
    infoFilteredText: string = "búsqueda"
) {
    return {
        lengthMenu: "Mostrar _MENU_ registros",
        searchPlaceholder: searchPlaceholderText,
        zeroRecords: "No se encontraron resultados",
        info: "N° de " + infoDetail + ": _MAX_",
        infoEmpty: "",
        infoFiltered: "",
        // infoFiltered: "(N° de resultados de la "+infoFilteredText+": _TOTAL_)",
        search: searchText,
        paginate: {
            "first": "Primero",
            "last": "Último",
            "next": "Siguiente",
            "previous": "Anterior"
        },
        loadingRecords:"Cargando...",
        processing:'<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span> '
    }
}

export function contarRepetidos(cadenaCompleta:string, palabraPorContar:string): number{
    let contar=0;
    for(let i=0; i<cadenaCompleta.length; i++){
      let letra = cadenaCompleta.substring(i,(i+1));
      if (palabraPorContar == letra) contar++;
    }
    return contar;
}

export function formatMoney(valor: number, decimales: number = 2){
    return "" + Number(Math.round(Number(valor +'e'+ decimales)) +'e-'+ decimales).toFixed(decimales);
}

export function obtenerZona(zona: string): string{
    let desZona: string = zona;
    if ( zona.includes('I') ) desZona = "ZONA I - PIURA";
    if ( zona.includes('II') ) desZona = "ZONA II - CHICLAYO";
    if ( zona.includes('III') ) desZona = "ZONA III - MOYOBAMBA";
    if ( zona.includes('V') ) desZona = "ZONA V - TRUJILLO";
    if ( zona.includes('IV') ) desZona = "ZONA IV - IQUITOS";
    if ( zona.includes('VI') ) desZona = "ZONA VI - PUCALLPA";
    if ( zona.includes('VII') ) desZona = "ZONA VII - HUARAZ";
    if ( zona.includes('VIII') ) desZona = "ZONA VIII - HUANCAYO";
    if ( zona.includes('X') ) desZona = "ZONA X - CUSCO";
    if ( zona.includes('IX') ) desZona = "ZONA IX - LIMA";
    if ( zona.includes('XI') ) desZona = "ZONA XI - ICA";
    if ( zona.includes('XII') ) desZona = "ZONA XII - AREQUIPA";
    if ( zona.includes('XIII') ) desZona = "ZONA XIII - TACNA";
    if ( zona.includes('XIV') ) desZona = "ZONA XIV - AYACUCHO";
    return desZona;
}


export function alertNotificacion(message: string,icon: string = "error", text: string = environment.nameSystem) {
    Swal.fire({ 
      icon: icon as SweetAlertIcon, 
      title: message, 
      text: text,
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonColor: '#00A5A5',
      confirmButtonText: '<span style="padding: 0 15px;">Aceptar</span>'
    });
  }