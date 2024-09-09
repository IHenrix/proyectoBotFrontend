import { ArchivoBase64Response } from "./archivo-base64";

export class ListVotacionesResponse{
    co_vota:number;
    nom_vota:string;
    deta_vota:string;
    vota:number;
    duracion:string;
    fe_ini:string;
    fe_fin:string;
    valid_tiempo:number;
    tiempo_restante:string="00:00:00";
    archivo:ArchivoBase64Response;
}
