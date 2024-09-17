import { Component, ElementRef, ViewChild, AfterViewChecked, ViewEncapsulation, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { ChatBotService } from 'src/app/service/chatbot.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { alertNotificacion, languageDataTable } from 'src/app/util/helpers';
import { Subject } from 'rxjs';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  userInputControl = new FormControl('');
  @ViewChild('modal_ver_documento') modal_ver_documento: NgbModalRef;
  modal_ver_documento_va: any;
  contenidoArchivoVisor: any;
  messages: { sender: string, text: string }[] = [];
  currentBotMessage = '';
  loading = false;
  loadingAction = false;
  accionGlobal:number=0;
  listGuias:any=[];
  constructor(    private adminService: AdminService, private spinner: NgxSpinnerService,private chatBotService: ChatBotService,private modalservice: NgbModal, public sanitizer: DomSanitizer, private renderer: Renderer2) { }
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('modal_lista_guias') modal_lista_guias: NgbModalRef;
  modal_lista_guias_va: any;
  modalOpciones: NgbModalOptions = {
    centered: true,
    animation: true,
    backdrop: 'static',
    keyboard: false
  }
  ngOnInit() {

  }
  ngAfterViewChecked() {
    this.scrollToBottom();
    this.botonesDinamicosHmtl();
  }
  enviarMensaje() {
    this.generarEnvio(this.userInputControl.value);
  }
  botonesDinamicosHmtl(){
    const metodoBuscarGuia = document.getElementById('metodoBuscarGuia');
    if (metodoBuscarGuia) {
      metodoBuscarGuia.addEventListener('click', () => {
        this.modal_lista_guias_va = this.modalservice.open(this.modal_lista_guias, { ...this.modalOpciones,size: 'xl' });
      });
    }
  }

  generarEnvio(userInput: string) {
    if (userInput && userInput.trim()) {
      this.messages.push({ sender: 'user', text: userInput });
      this.loading = true;
      this.loadingAction=true;
      this.userInputControl.disable();
      let request = { mensaje: userInput };

      if(this.accionGlobal===3){
        this.listGuias=[];
        this.chatBotService.buscarGuias(request).subscribe(
          response => {
            this.loading = false;
            this.loadingAction=false;
            this.userInputControl.enable();
            this.showBotResponseGradually(response.mensaje).then(() => {
              if(response.cod==1){
                this.listGuias=response.list;
                this.showBotResponseGradually('<button style="width:250px" id="metodoBuscarGuia" class="option-btn">Ver Resultados</button>');
              }
            });
          },
          error => {
            this.userInputControl.enable();
            this.loading = false;
            this.loadingAction=false;
            console.error('Error al obtener la respuesta del bot', error);
          }
        );
      }
      else{
        this.chatBotService.enviarMensaje(request).subscribe(
          response => {
            this.loading = false;
            this.loadingAction=false;
            this.userInputControl.enable();
            
            this.showBotResponseGradually(response.model);
          },
          error => {
            this.userInputControl.enable();
            this.loading = false;
            this.loadingAction=false;
            console.error('Error al obtener la respuesta del bot', error);
          }
        );
  
      }


      this.userInputControl.reset();
    }
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error al desplazar el chat hacia abajo:', err);
    }
  }


  showBotResponseGradually(fullMessage: string): Promise<void> {
    return new Promise<void>((resolve) => {
      this.currentBotMessage = '';
      let i = 0;

      const typingInterval = setInterval(() => {
        if (i < fullMessage.length) {
          this.currentBotMessage += fullMessage.charAt(i);
          i++;
        } else {
          clearInterval(typingInterval);
          this.messages.push({ sender: 'bot', text: this.currentBotMessage });
          this.currentBotMessage = '';
          resolve(); 
        }
      }, 10);
    });
  }
  seleccionarOpcion(opcion: number) {
    this.userInputControl.disable();
    this.loadingAction=true;
    let txtResponder: string = "";
    let textBotRespuesta: string = "No tengo respuestas a eso chamo";
    let textBotRespuesta2: string = "";
    this.accionGlobal=opcion;
    switch (opcion) {
      case 1:
        txtResponder = "Retroalimentación de Documentos";
        textBotRespuesta = "Te explico el rol de la opción Retroalimentación de Documentos que acabas de seleccionar. El fin de esta opción es brindarte una revisión completa de la estructura, redacción y formato de tu documento, enfocándome en los lineamientos de la Directiva de Trabajos de Investigación. Mi objetivo es ayudarte a mejorar cada sección del proyecto, no hacer el trabajo por ti. Recibirás recomendaciones en cuanto a coherencia, estilo, y el uso correcto del formato APA.  Ahora, por favor adjunta tu archivo en formato Word o PDF para que pueda analizar tu proyecto y brindarte sugerencias personalizadas.";
        break;
      case 2:
        txtResponder = "Consulta sobre mi Proyecto";
        textBotRespuesta = "Te explico el rol de la opción Consulta sobre mi Proyecto que acabas de seleccionar. El fin de esta opción es brindarte orientación académica sobre preguntas puntuales que tengas sobre tu proyecto, como la estructura del marco teórico, la formulación de objetivos, o cualquier otra duda metodológica. Mi objetivo es guiarte, no proporcionarte respuestas automáticas.";
        break;
      case 3:
        txtResponder = "Guías Académicas";
        textBotRespuesta = "Te explico el rol de la opción Guías Académicas que acabas de seleccionar. El fin de esta opción es proporcionarte acceso a guías académicas que te ayuden a estructurar correctamente cada parte de tu proyecto de investigación, desde el planteamiento del problema hasta la conclusión. Las guías te ayudarán a entender qué se espera en cada sección.";
        textBotRespuesta2 = '<p>Por favor, Indique que el tema que necesita para poder devolverle la Guia correspondiente</p>';
        break;
      case 4:
        txtResponder = "Consulta de Recursos Bibliográficos";
        textBotRespuesta = "Te explico el rol de la opción Consulta de Recursos Bibliográficos que acabas de seleccionar. El fin de esta opción es proporcionarte una lista de artículos académicos, papers y estudios que sean relevantes para tu tema de investigación. Los recursos recomendados te ayudarán a profundizar en la revisión teórica de tu proyecto.Por favor, escribe el tema o palabra clave relacionada con tu investigación para que pueda sugerirte recursos académicos."
        break;
    }
    this.messages.push({ sender: 'user', text: txtResponder });

    this.showBotResponseGradually(textBotRespuesta).then(() => {

      if(this.accionGlobal===1){
        this.userInputControl.disable();
        this.userInputControl.setValue("Adjunte el documento para su revisión")
      }
      else{
        this.userInputControl.enable();
      }
      this.loadingAction=false;
      if (textBotRespuesta2.length > 0) {
        this.showBotResponseGradually(textBotRespuesta2);
      }
    });

  }

  adjuntarArchivo(){
    if(this.accionGlobal===1){
      this.fileInput.nativeElement.click();
    }
  }

  archivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.cargarArchivoTipo1(file);
    }
  }

  cargarArchivoTipo1(file: File) {
    this.messages.push({ sender: 'user', text: file.name });
    this.userInputControl.setValue("")
  }

  verDocumento(id: any) {
    this.spinner.show();
    this.adminService.obtenerDocumento(id).subscribe(resp => {
      if (resp.cod === 1) {
        this.contenidoArchivoVisor = String(resp.model)
        this.modal_ver_documento_va = this.modalservice.open(this.modal_ver_documento, { ...this.modalOpciones, size: 'xl' });
      }
      else {
        alertNotificacion(resp.mensaje, resp.icon, resp.mensajeTxt);
      }
    });
  }
  pdfLoaded() {
    this.spinner.hide();
  }

}
