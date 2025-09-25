import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'system';
  timestamp: Date;
  htmlContent?: SafeHtml; // Added htmlContent property to store HTML per message
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

  // Removed the global htmlContent property as it's now per-message
  
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
     this.isOpen = true;
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

  // Modified to accept optional htmlContent parameter
  private addSystemMessage(text: string, htmlContent?: SafeHtml): void {
    const message: Message = {
      id: this.generateId(),
      text,
      type: 'system',
      timestamp: new Date(),
      htmlContent: htmlContent, // Store HTML content in the individual message
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
          
          // FIXED: Proper handling of HTML vs text responses
          if (response.includes('<div')) {
            // For HTML responses: sanitize HTML and pass it as htmlContent
            const sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(response);
            this.addSystemMessage('', sanitizedHtml); // Empty text, HTML content
          } else {
            // For plain text responses: just pass the text
            this.addSystemMessage(response); // Text only, no HTML content
          }
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