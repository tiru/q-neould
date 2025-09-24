import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ChatBubbleComponent } from "./chat-bubble/chat-bubble.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, ChatBubbleComponent],
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {}
}
