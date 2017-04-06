import { Component, Input } from '@angular/core';

@Component({
  selector: 'chat-box',
  templateUrl: 'chat-box.html',
  host: {
    '[style.justify-content]': "((!isOfSender) ? 'flex-start' : 'flex-end')",
    '[style.text-align]': "((!isOfSender) ? 'left' : 'flex-right')"
  }
})
export class ChatBoxComponent {

  @Input() message: string;
  @Input() isOfSender: boolean;

  constructor() {
        
  }

}
