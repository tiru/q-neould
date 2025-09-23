import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

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
  private destroy$ = new Subject<void>();
  private apiUrl = 'https://api.quotable.io/random'; // Free quotes API as fallback

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Add welcome message
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

    // Add user message
    this.addUserMessage(this.newMessage);
    const userMessage = this.newMessage;
    this.newMessage = '';

    // Call API for response
    this.getApiResponse(userMessage);
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

  private getApiResponse(userMessage: string): void {
    this.isTyping = true;

    // Determine which API to call based on user message
    if (
      userMessage.toLowerCase().includes('quote') ||
      userMessage.toLowerCase().includes('inspire')
    ) {
      // Use Quotable API for inspirational quotes
      this.http
        .get<any>('https://api.quotable.io/random')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isTyping = false;
            const quote = `"${response.content}" - ${response.author}`;
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
    } else if (
      userMessage.toLowerCase().includes('joke') ||
      userMessage.toLowerCase().includes('funny')
    ) {
      // Use JokesAPI for jokes
      this.http
        .get<any>('https://v2.jokeapi.dev/joke/Any?safe-mode&type=single')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isTyping = false;
            if (response.joke) {
              this.addSystemMessage(response.joke);
            } else if (response.setup && response.delivery) {
              this.addSystemMessage(`${response.setup} - ${response.delivery}`);
            } else {
              this.addSystemMessage(
                "Here's a joke for you, but it seems I lost it! 😄"
              );
            }
          },
          error: (error) => {
            this.isTyping = false;
            this.addSystemMessage(
              "Sorry, I couldn't fetch a joke right now. Please try again!"
            );
            console.error('Joke API Error:', error);
          },
        });
    } else if (
      userMessage.toLowerCase().includes('fact') ||
      userMessage.toLowerCase().includes('trivia')
    ) {
      // Use Numbers API for interesting facts
      this.http
        .get('http://numbersapi.com/random/trivia', { responseType: 'text' })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isTyping = false;
            this.addSystemMessage(`Here's an interesting fact: ${response}`);
          },
          error: (error) => {
            this.isTyping = false;
            this.getAdvice();
          },
        });
    } else if (
      userMessage.toLowerCase().includes('advice') ||
      userMessage.toLowerCase().includes('help')
    ) {
      // Use Advice Slip API
      this.getAdvice();
    } else {
      // Default to quote API for general messages
      this.http
        .get<any>('https://api.quotable.io/random')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isTyping = false;
            this.addSystemMessage(
              `I understand you said "${userMessage}". Here's something to think about: "${response.content}" - ${response.author}`
            );
          },
          error: (error) => {
            this.isTyping = false;
            this.addSystemMessage(
              "Thank you for your message. I'm currently learning to respond better. Please try asking for a quote, joke, or advice!"
            );
            console.error('API Error:', error);
          },
        });
    }
  }

  private getAdvice(): void {
    this.http
      .get<any>('https://api.adviceslip.com/advice')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isTyping = false;
          this.addSystemMessage(`Here's some advice: ${response.slip.advice}`);
        },
        error: (error) => {
          this.isTyping = false;
          this.addSystemMessage(
            "Here's some advice: Always believe in yourself and keep learning new things!"
          );
          console.error('Advice API Error:', error);
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
}
