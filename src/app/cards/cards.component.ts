import { Component, OnInit } from '@angular/core';
import { ContractsService } from './cards.service';
import { CardsDeck, Card } from './cards.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  deck: Card[] = new Array();

  table: Card[] = new Array();
  tableFreze: boolean = false;

  playerOne: Card[] = new Array();
  playerOneFreze: boolean = true;

  playerTwo: Card[] = new Array();
  playerTwoFreze: boolean = true;

  selectedCards: string[] = new Array();


  constructor(private contractsService: ContractsService) { }

  ngOnInit() {
    this.contractsService.getCards().subscribe(data => {
      this.deck = data.cards;
      console.log('data.cards', data.cards)
      this.deck = this.assignCardValues(data.cards);
      console.log('this.deck', this.deck)
      this.dealCards();
    });
  };

  assignCardValues(deck: Card[]): Card[] {
    for (let i in deck) {
      switch (deck[i].value) {
        case 'ACE':
          deck[i].otherValues = ['11', '1'];
          break;
        case 'JACK':
          deck[i].otherValues = ['12'];
          break;
        case 'QUEEN':
          deck[i].otherValues = ['13'];
          break;
        case 'KING':
          deck[i].otherValues = ['14'];
          break;
      }
    }
    return deck;
  }

  dealCards() {
    this.playerOne = this.deck.splice(0, 6);
    console.log('this.playerOne', this.playerOne)
    this.table = this.deck.splice(0, 4);
    console.log('this.table', this.table)
    this.playerTwo = this.deck.splice(0, 6);
    console.log('this.playerTwo', this.playerTwo)
    console.log('this.deck', this.deck);
  }

  cardIsSelected(playerCard: any) {
    console.log('playerCard', playerCard);
    if (playerCard.list === 'table') {
      for (let i in this.table) {
        if (playerCard.value.code === this.table[i].code) {
          this.table[i].isSelected = true;
          this.selectedCards.push(playerCard.value);
          this.playerOneFreze = false;
        }
      }
    } else if (playerCard.list === 'playerOne') {
      for (let i in this.playerOne) {
        if (playerCard.value.code === this.playerOne[i].code) {
          this.playerOne[i].isSelected = true;
          isMoveValid(this.selectedCards, playerCard.value);
          this.playerTwoFreze = false;
        }
      }
    }
    else if (playerCard.list === 'playerTwo') {
      for (let i in this.playerTwo) {
        if (playerCard.playerCard.code === this.playerTwo[i].code) {
          this.playerTwo[i].isSelected = true;
        }
      }
    }
  }

}

const isMoveValid = (selectedCards, playerCard) => {
  console.log('playerCard', playerCard);
  console.log('selectedCards', selectedCards);

  let selectedCardsValue = [];

  for (let i in selectedCards) {
    if (selectedCards[i].otherValues) {
      selectedCardsValue.push(selectedCards[i].otherValues);
    } else {
      selectedCardsValue.push(selectedCards[i].value);
    }
  }

  var sum = selectedCardsValue.map(Number).reduce(add, 0);
  console.log('sum', sum);
  // funkcija koja uporedjuje i sabira brojeve nije gotova mora da se zavrsi
  if (playerCard.otherValues) {
    if (sum === playerCard.otherValues[0]) {

    }
  }
  
  function add(a, b) {
    return a + b;
  }

}
