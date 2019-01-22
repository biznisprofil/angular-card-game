import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cards, Card } from './../cards.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  @Input() cards: Cards;
  @Input() cardFreeze: boolean;
  @Input() list: string;
  @Output() cardIsSelected = new EventEmitter<any>();

  constructor() { }

  cardSelected(value:Card) {
    // console.log('value', value);
    if (!this.cardFreeze) {
      this.cardIsSelected.emit({
        value: value,
        list: this.list
      });
    } else {
      console.log('This cards are freezed!')
    }
  }

}
