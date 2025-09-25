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
  htmlContent?: SafeHtml;
}

interface Chip {
  id: string;
  text: string;
  visible: boolean;
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

  // Predefined suggestion chips - always visible
  chips: Chip[] = [
    {
      id: '1',
      text: 'Show me real-time status of all Qatar Airways ULDs currently at LHR',
      visible: true,
    },
    {
      id: '2',
      text: 'Show me real-time status of all Qatar Airways ULDs currently at DOH',
      visible: true,
    },
    {
      id: '3',
      text: 'Show me real-time status of all Qatar Airways ULDs currently at SYD',
      visible: true,
    },
    // {
    //   id: '4',
    //   text: 'Show me Qatar Airways cargo capacity information',
    //   visible: true,
    // },
    // {
    //   id: '5',
    //   text: 'What destinations does Qatar Airways serve?',
    //   visible: true,
    // },
    // {
    //   id: '6',
    //   text: 'Tell me about Qatar Airways fleet information',
    //   visible: true,
    // },
  ];

  private destroy$ = new Subject<void>();
  private apiUrl =
    'https://qneo-openai-eegqg5bah4gqgzg2.canadacentral-01.azurewebsites.net/callAzureOpenAIRestAPI';

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

  sendMessage(message?: string): void {
    const messageToSend = message || this.newMessage.trim();
    if (!messageToSend) return;

    this.addUserMessage(messageToSend);
    this.newMessage = '';
    // Chips remain visible - no hiding logic
    this.postAPIResponse(messageToSend);
  }

  // Handle chip click
  onChipClick(chip: Chip): void {
    this.sendMessage(chip.text);
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

  private addSystemMessage(text: string, htmlContent?: SafeHtml): void {
    const message: Message = {
      id: this.generateId(),
      text,
      type: 'system',
      timestamp: new Date(),
      htmlContent: htmlContent,
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
          responseType: 'text' as 'json',
        }
      )
      .subscribe({
        next: (response) => {
          this.isTyping = false;

          if (response.includes('<div')) {
            const sanitizedHtml =
              this.sanitizer.bypassSecurityTrustHtml(response);
            this.addSystemMessage('', sanitizedHtml);
          } else {
            this.addSystemMessage(response);
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
