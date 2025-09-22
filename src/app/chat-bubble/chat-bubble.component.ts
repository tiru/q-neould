import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'system';
  timestamp: Date;
}

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements OnInit {
  isOpen = false;
  messages: Message[] = [];
  newMessage = '';
  isTyping = false;

  ngOnInit(): void {
    // Add welcome message
    this.addSystemMessage('Hello! How can I help you today?');
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

    // Simulate system response
    this.simulateSystemResponse(userMessage);
  }

  private addUserMessage(text: string): void {
    const message: Message = {
      id: this.generateId(),
      text,
      type: 'user',
      timestamp: new Date()
    };
    this.messages.push(message);
    this.scrollToBottom();
  }

  private addSystemMessage(text: string): void {
    const message: Message = {
      id: this.generateId(),
      text,
      type: 'system',
      timestamp: new Date()
    };
    this.messages.push(message);
    this.scrollToBottom();
  }

  private simulateSystemResponse(userMessage: string): void {
    this.isTyping = true;
    
    setTimeout(() => {
      this.isTyping = false;
      let response = 'Thank you for your message. How else can I assist you?';
      
      // Simple response logic
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        response = 'Hello there! Nice to meet you. What can I help you with?';
      } else if (userMessage.toLowerCase().includes('help')) {
        response = 'I\'m here to help! Please let me know what you need assistance with.';
      } else if (userMessage.toLowerCase().includes('bye')) {
        response = 'Goodbye! Feel free to reach out anytime if you need help.';
      }
      
      this.addSystemMessage(response);
    }, 1500);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.chat-bubble__messages');
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