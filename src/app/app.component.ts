import { Component } from '@angular/core';
import { IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonContent, IonFooter } from '@ionic/angular/standalone';
import { ChatBubbleComponent } from "./chat-bubble/chat-bubble.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonRouterOutlet, ChatBubbleComponent, IonHeader, IonToolbar, IonGrid, IonRow, IonCol, IonContent, IonFooter],
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {}
}
