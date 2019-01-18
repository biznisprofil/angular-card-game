import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CardsDeck, Card } from './../cards.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input() cards: CardsDeck;
  @Input() cardFreeze: boolean;
  @Input() list: string;
  @Output() cardIsSelected = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    
    console.log('cards', this.cards)
  }

  cardSelected(value) {
    console.log('value', value);
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
