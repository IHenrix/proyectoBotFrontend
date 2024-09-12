import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { ChatBotService } from 'src/app/service/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewChecked {
  userInputControl = new FormControl('');
  messages: { sender: string, text: string }[] = [];
  currentBotMessage = '';
  loading = false;

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private chatBotService: ChatBotService) {}

  ngOnInit(){

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  enviarMensaje() {
    this.generarEnvio(this.userInputControl.value);
  }

  generarEnvio(userInput: string) {
    if (userInput && userInput.trim()) {
      this.messages.push({ sender: 'user', text: userInput });
      this.loading = true;

      let request = { mensaje: userInput };

      this.chatBotService.enviarMensaje(request).subscribe(
        response => {
          this.loading = false;
          this.showBotResponseGradually(response.model);
        },
        error => {
          this.loading = false;
          console.error('Error al obtener la respuesta del bot', error);
        }
      );
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

  showBotResponseGradually(fullMessage: string) {
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
      }
    }, 20);
  }
  seleccionarOpcion(opcion: string) {
    this.generarEnvio( opcion);
  }
}
