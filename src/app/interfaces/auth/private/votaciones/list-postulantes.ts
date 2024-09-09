import { ArchivoBase64Response } from "./archivo-base64";

export class PostulanteVotaResponse{
	co_vota:number;
	co_postu:number;
	nombre_completo:string;
	des_vota_postu:string;
	src_img_postu:string;
	archivo:ArchivoBase64Response;
}
