import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'system';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss'],
})
export class ChatBubbleComponent implements OnInit, OnDestroy {
  isOpen = false;
  messages: Message[] = [];
  newMessage = '';
  isTyping = false;
  isFullscreen = false; 
  private destroy$ = new Subject<void>();
  private apiUrl =
    'https://qneo-openai-eegqg5bah4gqgzg2.canadacentral-01.azurewebsites.net/callAzureOpenAIRestAPI';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.toggleChat();
    this.addSystemMessage(
      'Hello! How can I help you today? Ask me for a quote or any question!'
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    this.addUserMessage(this.newMessage);
    const userMessage = this.newMessage;
    this.newMessage = '';
    this.postAPIResponse(userMessage);
  }

  private addUserMessage(text: string): void {
    const message: Message = {
      id: this.generateId(),
      text,
      type: 'user',
      timestamp: new Date(),
    };
    this.messages.push(message);
    this.scrollToBottom();
  }

  private addSystemMessage(text: string): void {
    const message: Message = {
      id: this.generateId(),
      text,
      type: 'system',
      timestamp: new Date(),
    };
    this.messages.push(message);
    this.scrollToBottom();
  }

  private postAPIResponse(userMessage: string): void {
    this.isTyping = true;
    const headers = new HttpHeaders().set('Accept-Language', 'en');
    this.http
      .post<any>(
        this.apiUrl,
        { msg: userMessage },
        {
          headers: headers,
          responseType: 'text' as 'json', // The cast keeps TypeScript happy
        }
      )
      .subscribe({
        next: (response) => {
          this.isTyping = false;
          const quote = response;
          this.addSystemMessage(quote);
        },
        error: (error) => {
          this.isTyping = false;
          this.addSystemMessage(
            'Sorry, I encountered an error. Please try again later.'
          );
          console.error('API Error:', error);
        },
      });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messagesContainer = document.querySelector(
        '.chat-bubble__messages'
      );
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }
}
