import { Component, ElementRef, ViewChild, AfterViewChecked, ViewEncapsulation, Renderer2, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatBotService } from 'src/app/service/chatbot.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { alertNotificacion, languageDataTable } from 'src/app/util/helpers';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/service/admin.service';
import { CATEGORIA } from 'src/app/shared/enum/enum';

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
  @ViewChild('modal_microfono') modal_microfono: NgbModalRef;
  modal_microfono_va: any;
  contenidoArchivoVisor: any;
  messages: { sender: string, text: string }[] = [];
  currentBotMessage = '';
  loading = false;
  loadingAction = false;
  accionGlobal: number = 0;
  categoriaSeleccionada: number = 0;
  listGuias: any = [];
  constructor(private adminService: AdminService, private spinner: NgxSpinnerService, private ref: ChangeDetectorRef, private chatBotService: ChatBotService, private modalservice: NgbModal, public sanitizer: DomSanitizer, private renderer: Renderer2) { }
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('modal_lista_guias') modal_lista_guias: NgbModalRef;
  modal_lista_guias_va: any;
  modalOpciones: NgbModalOptions = {
    centered: true,
    animation: true,
    backdrop: 'static',
    keyboard: false
  }
  selectedFileRetroalimentacion: File | null = null;
  /*VARIABLES PARA VENTANA DE SPEAK TO TEXT*/
  private mediaRecorder: any = null;
  private chunks: any[] = [];
  private startTime: any = null;
  private interval: any = null;
  public isRecording = false;
  public timeElapsed = 0;
  public shadowStyle = '0px 0px 30px rgba(0, 0, 0, 0.3)';
  public chatConVoz:Boolean=false;
  private audio: HTMLAudioElement | null = null;

  ngOnInit() {
    this.insertOpcionesBot();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
    this.botonesDinamicosHmtl();
  }
  ngOnDestroy() {
   this.anularVozActual();
  }
  botonesDinamicosHmtl() {

    const botones = document.querySelectorAll('.btn-opcion-bot');
    if (this.accionGlobal == 0) {
      botones.forEach(boton => {
        boton.addEventListener('click', () => {
          const dataValue = boton.getAttribute('data-value');
          this.seleccionarOpcion(Number(dataValue));
        });
      });
    }

    const metodoBuscarGuia = document.querySelectorAll('.btn-metodo-guia');
    if (metodoBuscarGuia) {
      metodoBuscarGuia.forEach(metodoBuscarGuiaB => {
        metodoBuscarGuiaB.addEventListener('click', () => {
          this.modal_lista_guias_va = this.modalservice.open(this.modal_lista_guias, { ...this.modalOpciones, size: 'xl' });
        });
      });
    }
    const metodoEjecutarAudio = document.querySelectorAll('.btn-audio-texto');
      metodoEjecutarAudio.forEach(boton => {
        boton.addEventListener('click', () => {
          const dataValue = boton.getAttribute('data-value');
          this.mensajeConVoz(this.eliminarEtiquetasHTML(this.messages[Number(dataValue)].text))
        });
      });
  }

  insertOpcionesBot() {
    this.userInputControl.disable();
    this.userInputControl.setValue("")
    let textPresentacion:string=`Hola, soy EPICSBot, tu asistente virtual académico. Mi rol es ayudarte en la formulación de tu proyecto brindándote asesoría.
     Recuerda que mi objetivo no es que copies o que yo te genere respuestas automáticas que puedas copiar y pegar,
      sino ayudarte a agilizar la búsqueda de información, darte retroalimentación y guiarte en el proceso de investigación.Elige una opción para empezar.`;
    let htmlString = `<p>`+textPresentacion+`<i style="cursor: pointer; margin-left: 10px;" data-value="`+this.messages.length+`" class="fa fa-volume-up btn-audio-texto"></i></p>
    <button class="option-btn btn-opcion-bot" data-value="3">Consulta sobre mi Proyecto</button>
    <button class="option-btn btn-opcion-bot" data-value="4">Guías Académicas</button>
    <button class="option-btn btn-opcion-bot" data-value="1">Consulta de Recursos Bibliográficos</button>
    <button class="option-btn btn-opcion-bot" data-value="2">Retroalimentación de Documentos</button>`;
    this.messages.push({ sender: 'bot', text: htmlString });
  }
  enviarMensaje() {
    this.chatConVoz=false;
    this.generarEnvio(this.userInputControl.value);
  }

  promptTemaSeleccionado(): string {
    let prompt: string = "";
    switch (this.accionGlobal) {
      case 1:
        prompt = "Tu misión es proporcionar al usuario una lista de artículos académicos, papers y estudios que sean relevantes para su tema de investigación. Los recursos recomendados deben ayudarlo a profundizar en la revisión teórica de su proyecto.El alumno te dará el tema o palabra clave relacionada con su investigación para que puedas sugerirle recursos académicos.Solo debes dar información de temas académicos osea cientificos o tecnologicos(responde con una lista en <li><li> con todo lo que necesita ,tambien da URLs para que el usuario pueda acceder con un click)";
        break;
      case 2:
        prompt = "Tu misión es ayudar realizar la revisión completa de la estructura de un proyecto pdf,el cual tienes como objetivo ayudar a mejorar cada sección del mismo. Daras recomendaciones en cuanto a coherencia, estilo, y el uso correcto del formato APA.Debes dar sugerencias personalizadas.(Da las recomendaciones en un <li> por favor y todo debe ser estrictamente academico)"
        break;
      case 3:
        prompt = "Tu misión es brindar orientación académica sobre preguntas puntuales que tenga el usuario ya que lo ayudaras en un proyecto.Esto incluye la estructura del marco teórico, la formulación de objetivos, o cualquier otra duda metodológica. Tu debes guiar, no proporcionar respuestas automáticas(Tu misión es netamente academica y solo podras responder de acuerdo a las indicaciones anteriores, Ademas de que si daras una lista ponla en un <li></li>)";
        break;
    }
    return prompt;
  }
  generarEnvio(userInput: string) {
    this.anularVozActual();
    if (userInput && userInput.trim()) {
      this.userInputControl.disable();
      if (this.accionGlobal === 4) {
        this.loading = true;
        this.loadingAction = true;
        this.messages.push({ sender: 'user', text: userInput });
        let request = { categoria: this.categoriaSeleccionada, mensaje: userInput };
        this.listGuias = [];
        this.chatBotService.buscarGuias(request).subscribe(
          response => {
            this.loading = false;
            this.userInputControl.enable();
            this.showBotResponseGradually(response.mensaje).then(() => {
              if (response.cod == 1) {
                this.listGuias = response.list;
                this.showBotResponseGradually('<p>Resultados Encontrados: </p><button class="option-btn btn-metodo-guia">Ver Guias</button>').then(() => {
                  this.showBotResponseGradually('Si desea buscar otras Guías indique el tema correspondiente');
                });
              }
              else{
                this.envioMensajeConVoz(response.mensaje);
              }
              this.loadingAction = false;
            });
          },
          error => {
            this.userInputControl.enable();
            this.loading = false;
            this.loadingAction = false;
            console.error('Error al obtener la respuesta del bot', error);

          }
        );
      }
      else if (this.accionGlobal === 2) {

        if (this.selectedFileRetroalimentacion == null) {
          alertNotificacion("Debe adjuntar el documento PDF para continuar con este proceso", "warning")
          return;
        }
        this.loading = true;
        this.loadingAction = true;
        this.messages.push({ sender: 'user', text: "He adjuntado el documento: " + this.selectedFileRetroalimentacion.name });
        this.chatBotService.enviarMensajeConArchivo(String(this.categoriaSeleccionada), "Aca te indico el documento", this.promptTemaSeleccionado(), this.selectedFileRetroalimentacion).subscribe(
          response => {
            this.loading = false;
            this.envioMensajeConVoz(response.model);
            this.showBotResponseGradually(response.model).then(() => {
              this.showBotResponseGradually("Puedes adjuntar otro documento para la revisión correspondiente");
              this.loadingAction = false;
              this.selectedFileRetroalimentacion = null;
              this.userInputControl.setValue("Adjunte otro documento para su revisión (SOLO ARCHIVOS PDF)")
              this.userInputControl.enable();
            });
          },
          error => {
            this.loading = false;
            this.loadingAction = false;
            this.userInputControl.enable();
            console.error('Error al obtener la respuesta del bot', error);
          }
        );
      }
      else {
        this.loading = true;
        this.loadingAction = true;
        this.messages.push({ sender: 'user', text: userInput });
        let request = { categoria: this.categoriaSeleccionada, mensaje: userInput, prompt: this.promptTemaSeleccionado() };
        this.chatBotService.enviarMensaje(request).subscribe(
          response => {
            this.loading = false;
            this.envioMensajeConVoz(response.model);
            this.showBotResponseGradually(response.model).then(() => {
              this.loadingAction = false;
              this.userInputControl.enable();
            });
          },
          error => {
            this.userInputControl.enable();
            this.loading = false;
            this.loadingAction = false;
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


  showBotResponseGradually(fullMessage: string,time:number=10): Promise<void> {
    return new Promise<void>((resolve) => {
      this.currentBotMessage = '';
      let i = 0;

      const typingInterval = setInterval(() => {
        if (i < fullMessage.length) {
          this.currentBotMessage += fullMessage.charAt(i);
          i++;
        } else {
          clearInterval(typingInterval);
          this.messages.push({
            sender: 'bot',
            text: this.currentBotMessage + '<i style="cursor: pointer; margin-left: 10px;" data-value="'+this.messages.length+'" class="fa fa-volume-up btn-audio-texto" aria-hidden="true"></i>'
          });
          this.currentBotMessage = '';
          resolve();
        }
      }, time);
    });
  }
  seleccionarOpcion(opcion: number) {
    this.userInputControl.disable();
    this.loadingAction = true;
    let txtResponder: string = "";
    let textBotRespuesta: string = "No tengo respuestas a eso chamo";
    this.userInputControl.setValue("")
    let textBotRespuesta2: string = "";
    this.accionGlobal = opcion;
    switch (opcion) {
      case 1:
        txtResponder = "Consulta de Recursos Bibliográficos";
        textBotRespuesta = "Te explico el rol de la opción Consulta de Recursos Bibliográficos que acabas de seleccionar. El fin de esta opción es proporcionarte una lista de artículos académicos, papers y estudios que sean relevantes para tu tema de investigación. Los recursos recomendados te ayudarán a profundizar en la revisión teórica de tu proyecto.Por favor, escribe el tema o palabra clave relacionada con tu investigación para que pueda sugerirte recursos académicos."
        this.categoriaSeleccionada = CATEGORIA.CONSULTA_BIBLIOGRAFICO;
        break;
      case 2:
        txtResponder = "Retroalimentación de Documentos";
        textBotRespuesta = "Te explico el rol de la opción Retroalimentación de Documentos que acabas de seleccionar. El fin de esta opción es brindarte una revisión completa de la estructura, redacción y formato de tu documento, enfocándome en los lineamientos de la Directiva de Trabajos de Investigación. Mi objetivo es ayudarte a mejorar cada sección del proyecto, no hacer el trabajo por ti. Recibirás recomendaciones en cuanto a coherencia, estilo, y el uso correcto del formato APA.  Ahora, por favor adjunta tu archivo en formato PDF para que pueda analizar tu proyecto y brindarte sugerencias personalizadas.";
        this.categoriaSeleccionada = CATEGORIA.RETROALIMENACION;
        break;
      case 3:
        txtResponder = "Consulta sobre mi Proyecto";
        textBotRespuesta = "Te explico el rol de la opción Consulta sobre mi Proyecto que acabas de seleccionar. El fin de esta opción es brindarte orientación académica sobre preguntas puntuales que tengas sobre tu proyecto, como la estructura del marco teórico, la formulación de objetivos, o cualquier otra duda metodológica. Mi objetivo es guiarte, no proporcionarte respuestas automáticas.";
        textBotRespuesta2 = "Por favor, escribe tu pregunta específica relacionada con tu proyecto y te proporcionaré sugerencias académicas que te ayuden a resolver tus dudas.";
        this.categoriaSeleccionada = CATEGORIA.CONSULTA_PROYECTO;
        break;
      case 4:
        txtResponder = "Guías Académicas";
        textBotRespuesta = "Te explico el rol de la opción Guías Académicas que acabas de seleccionar. El fin de esta opción es proporcionarte acceso a guías académicas que te ayuden a estructurar correctamente cada parte de tu proyecto de investigación, desde el planteamiento del problema hasta la conclusión. Las guías te ayudarán a entender qué se espera en cada sección.";
        textBotRespuesta2 = '<p>Por favor, Indique que el tema que necesita para poder devolverle la Guia correspondiente</p>';
        this.categoriaSeleccionada = CATEGORIA.GUIAS_ACADEMICAS;
        break;
    }
    this.messages.push({ sender: 'user', text: txtResponder });

    this.showBotResponseGradually(textBotRespuesta).then(() => {

      if (this.accionGlobal === 2) {
        this.userInputControl.setValue("Adjunte el documento para su revisión (SOLO ARCHIVOS PDF)")
      }
      this.userInputControl.enable();
      this.loadingAction = false;
      if (textBotRespuesta2.length > 0) {
        this.showBotResponseGradually(textBotRespuesta2);
      }
    });

  }

  adjuntarArchivo() {
    if (this.accionGlobal === 2) {
      this.fileInput.nativeElement.click();
    }
    else {
      alertNotificacion("Esta opción solo esta habilitada para las opciones de Retroalimentación de Documentos y Consultas sobre mi Proyectp", "info", "Por favor verificar")
    }
  }


  archivoSeleccionado(event: any): void {
    const file = event.target.files[0];
    if (file === undefined || file === null) {
      this.selectedFileRetroalimentacion = null;
    }
    else {
      this.selectedFileRetroalimentacion = file;
      this.userInputControl.setValue(this.selectedFileRetroalimentacion.name);
    }
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

  downloadPDF(id: any, filename: string): void {
    this.spinner.show();
    this.adminService.obtenerDocumento(id).subscribe(resp => {
      if (resp.cod === 1) {
        const linkSource = `data:application/pdf;base64,${String(resp.model)}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
      }
      else {
        alertNotificacion(resp.mensaje, resp.icon, resp.mensajeTxt);
      }
      this.spinner.hide();
    });

  }
  reiniciarMenu() {
    this.selectedFileRetroalimentacion = null;
    this.anularVozActual();
    if (this.accionGlobal > 0 && !this.loadingAction) {
      this.messages.push({ sender: 'user', text: "Por favor , muestrame nuevamente el Menu Principal" });
      this.showBotResponseGradually("Entendido, procederé a mostrarte nuevamente las opciones").then(() => {
        this.accionGlobal = 0;
        this.insertOpcionesBot();
      });
    }
  }
  /*FUNCIONES PARA VENTANA DE SPEAK TO TEXT*/
  abrirModalGrabacion() {
    this.anularVozActual();
    this.modal_microfono_va = this.modalservice.open(this.modal_microfono, { ...this.modalOpciones, size: 'sm' });
    this.iniciarGrabacion();
  }
  iniciarGrabacion() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();
      this.isRecording = true;
      this.chunks = [];
      this.startTimer();

      this.mediaRecorder.ondataavailable = (event: any) => {
        this.chunks.push(event.data);
      };

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const animateShadow = () => {
        if (!this.isRecording) return;
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const blurRadius = Math.min(volume * 2, 100);
        const spreadRadius = Math.min(volume / 2, 20);
        const shadowOpacity = Math.min(volume / 50, 0.8);
        this.shadowStyle = `0px 0px ${blurRadius}px ${spreadRadius}px rgba(0, 0, 0, ${shadowOpacity})`;
        requestAnimationFrame(animateShadow);
      };

      animateShadow();

    });
  }

  detenerGrabacion() {
    this.mediaRecorder.stop();
    this.isRecording = false;
    this.stopTimer();
    const generarWavBlob = () => {
      return new Promise<Blob>(async (resolve, reject) => {
        this.mediaRecorder.onstop = async () => {
          try {
            const audioBlob = new Blob(this.chunks, { type: 'audio/wav' });
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            const rawAudioData = audioBuffer.getChannelData(0);
            const wavBlob = this.encodeWAV(rawAudioData, audioBuffer.sampleRate);
            resolve(wavBlob);
          } catch (error) {
            reject(error);
          }
        };
      });
    };
    generarWavBlob().then((wavBlob) => {
      this.speakToText(wavBlob);
    }).catch((error) => {
      console.error('Error al generar el archivo WAV:', error);
    });
  }



  encodeWAV(samples: Float32Array, sampleRate = 16000) {
    const bufferLength = samples.length * 2;
    const arrayBuffer = new ArrayBuffer(44 + bufferLength);
    const view = new DataView(arrayBuffer);
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + bufferLength, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, bufferLength, true);
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return new Blob([view], { type: 'audio/wav' });
  }

  writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  startTimer() {
    this.startTime = Date.now();
    this.interval = setInterval(() => {
      this.timeElapsed = Date.now() - this.startTime;
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.interval);
  }
  speakToText(audioBlob: Blob) {
    this.spinner.show();
    this.chatBotService.speakToText(audioBlob).subscribe(
      resp => {
        if (resp.cod === 1) {
          if(String(resp.model)){
            this.chatConVoz=true;
            this.modal_microfono_va.close();
            this.userInputControl.setValue(resp.model);
            this.generarEnvio(this.userInputControl.value);
          }
          else{
            alertNotificacion("No se ha grabado correctamente el audio","info","Por favor volver a intentar");
          }
        }
        else {
          alertNotificacion(resp.mensaje, resp.icon, resp.mensajeTxt);
        }
        this.spinner.hide();
        this.limpiarMicrofono();
      },
      error => {
        this.spinner.hide();
        this.limpiarMicrofono();
      }
    );
  }
  limpiarMicrofono() {
    this.mediaRecorder = null;
    this.chunks = [];
    this.startTime = null;
    this.interval = null;
    this.isRecording = false;
    this.timeElapsed = 0;
  }

  envioMensajeConVoz(mensaje: string) {
    if (this.chatConVoz) {
      this.mensajeConVoz(mensaje);
    }
  }

  mensajeConVoz(mensaje: string) {
    this.spinner.show();
    this.chatBotService.textToSpeak({ mensaje: this.eliminarEtiquetasHTML(mensaje) }).subscribe(
      resp => {
        this.anularVozActual();
        const audioBlob = new Blob([resp], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audio = new Audio(audioUrl);
        this.audio.play().then(() => {
          this.spinner.hide();
        }).catch(error => {
          this.spinner.hide();
        });
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  anularVozActual(){
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

  }
  eliminarEtiquetasHTML(html: string): string {
    const temporal = document.createElement('div');
    temporal.innerHTML = html;
    return temporal.innerText || temporal.textContent || '';
  }

}
