import { Component, Input } from '@angular/core';

@Component({
  selector: 'custom-header',
  templateUrl: 'custom-header.html'
})
export class CustomHeaderComponent {

  @Input() title: string;

  constructor() { }

}
