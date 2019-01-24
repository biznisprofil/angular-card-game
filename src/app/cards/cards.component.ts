import { Component, OnInit } from '@angular/core';
import { ContractsService } from './cards.service';
import { Card } from './cards.model';

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
  playerOneFinished: boolean = false;

  playerTwo: Card[] = new Array();
  playerTwoFreze: boolean = true;
  playerTwoFinished: boolean = false;

  selectedCards: Card[] = new Array();


  constructor(private contractsService: ContractsService) { }

  ngOnInit() {
    this.contractsService.getCards().subscribe(data => {
      this.deck = data.cards;
      // console.log('data.cards', data.cards)
      this.deck = this.assignCardValues(data.cards);
      // console.log('this.deck', this.deck)
      this.dealCards();
    });
  };

  assignCardValues(deck: Card[]): Card[] {
    for (let i in deck) {
      deck[i].value = this.getCardValue(deck[i].value);
    }
    return deck;
  }

  getCardValue(value) {
    const values = {
      KING: [14],
      QUEEN: [13],
      JACK: [12],
      ACE: [11, 1],
      10: [10],
      9: [9],
      8: [8],
      7: [7],
      6: [6],
      5: [5],
      4: [4],
      3: [3],
      2: [2],
    };
    return values[value];
  }

  dealCards() {
    this.playerOne = this.deck.splice(0, 6);
    // console.log('this.playerOne', this.playerOne)
    this.table = this.deck.splice(0, 4);
    // console.log('this.table', this.table)
    this.playerTwo = this.deck.splice(0, 6);
    // console.log('this.playerTwo', this.playerTwo)
  }

  cardIsSelected(selectedCard: any) {
    console.log('selectedCard', selectedCard);
    if (selectedCard.list === 'table') {
      for (let card = 0; card < this.table.length; card++) {
        if (selectedCard.value.code === this.table[card].code && !this.table[card].isSelected) {
          this.table[card].isSelected = true;
          this.selectedCards.push(selectedCard.value);

          if (!this.playerOneFinished) {
            this.playerOneFreze = false;
          } else {
            this.playerTwoFreze = false;
          }
          console.log('this.selectedCards if', this.selectedCards);
          // statement for unselecting the selected card
        } else if (selectedCard.value.code === this.table[card].code && this.table[card].isSelected) {
          this.table[card].isSelected = false;

          for (let i = 0; i < this.selectedCards.length; i++) {
            if (selectedCard.value.code === this.selectedCards[i].code) {
              this.selectedCards.splice(i, 1);
            }
          }

          console.log('this.selectedCards else', this.selectedCards);

          if (this.selectedCards.length === 0) {
            this.playerOneFreze = true;
            this.playerTwoFreze = true;
          }

        }
      }
    } else if (selectedCard.list === 'playerOne') {
      for (let card in this.playerOne) {
        if (selectedCard.value.code === this.playerOne[card].code) {
          this.playerOne[card].isSelected = true;

          this.playerOneFinished = true;
          this.playerOneFreze = true;

          if (isMoveValid(this.selectedCards, selectedCard.value)) {
            this.moveIsValid();
          } else {
            this.moveIsNotValid(selectedCard.list);
          }
        }
      }
    }
    else if (selectedCard.list === 'playerTwo') {
      for (let card in this.playerTwo) {
        if (selectedCard.value.code === this.playerTwo[card].code) {
          this.playerTwo[card].isSelected = true;

          this.playerTwoFinished = true;
          this.playerOneFinished = false;
          this.playerTwoFreze = true;

          if (isMoveValid(this.selectedCards, selectedCard.value)) {
            this.moveIsValid();
          } else {
            this.moveIsNotValid(selectedCard.list);
          }
        }
      }
    }
  }

  moveIsValid() {
    console.log('move valid');
    setTimeout(() => {

      this.table = this.table.filter((item) => !item.isSelected);

      // console.log('this.table', this.table)

      this.playerOne = this.playerOne.filter((item) => !item.isSelected);

      // console.log('this.playerOne', this.playerOne)

      this.playerTwo = this.playerTwo.filter((item) => !item.isSelected);

      // console.log('this.playerTwo', this.playerTwo)

      this.selectedCards = new Array();
    }, 500);
  }

  moveIsNotValid(list) {
    alert('move is not valid');
    // for (let i = 0; i < this.table.length; i++) {
    //   if (this.table[i].isSelected) {
    //     this.table[i].isSelected = false;
    //   }
    // }

    if (list === 'playerOne') {
      for (let i = 0; i < this.playerOne.length; i++) {
        if (this.playerOne[i].isSelected) {
          this.playerOne[i].isSelected = false;
        }
      }
    }

    if (list === 'playerTwo') {
      for (let i = 0; i < this.playerTwo.length; i++) {
        if (this.playerTwo[i].isSelected) {
          this.playerTwo[i].isSelected = false;
        }
      }
    }

    this.selectedCards = new Array();
  }


}

const isMoveValid = (selectedCards, playerCard) => {
  let isMoveValid: boolean = false;
  console.log('playerCard', playerCard);
  console.log('selectedCards', selectedCards);

  let selectedCardsValues = [];

  let i = selectedCards.length;
  while (i--) {
    console.log('selectedCards[i].value', selectedCards[i].value)
    selectedCards[i].value.forEach(element => {
      selectedCardsValues.push(element);
      let sum = element;
      if (i > 0) {
        selectedCards[i - 1].value.forEach(otherElement => {
          sum += otherElement;
          selectedCardsValues.push(element + otherElement)
        });
      }
      if (i > 1) {
        selectedCards[i - 2].value.forEach(otherElement => {
          sum += otherElement;
          selectedCardsValues.push(element + otherElement)
        });
      }
      if (i > 2) {
        selectedCards[i - 3].value.forEach(otherElement => {
          sum += otherElement;
          selectedCardsValues.push(element + otherElement)
        });
      }

      selectedCardsValues.push(sum);
      console.log('sum', sum);

    });
  }

  function removeDuplicate(arr) {
    let unique_array = Array.from(new Set(arr))
    return unique_array
  }

  let uniqueSelectedCardsValues = removeDuplicate(selectedCardsValues);
  console.log('uniqueSelectedCardsValues', uniqueSelectedCardsValues);


  const playerCardValue = playerCard.value;
  console.log('playerCardValue', playerCardValue);

  const max = Math.max.apply(null, uniqueSelectedCardsValues);

  for (let j = 0; j < uniqueSelectedCardsValues.length; j++) {
    playerCardValue.forEach(element => {
      if (uniqueSelectedCardsValues[j] === element) {
        isMoveValid = true;
        uniqueSelectedCardsValues.splice(j, 1);
      }
    });
  }

  // var isAnyBigger = (element) => {
  //   return element >= max;
  // };

  // if (uniqueSelectedCardsValues.some(isAnyBigger)) {
  //   isMoveValid = false;
  // }



  // function for comparison pssible sum result with player card
  // for (let i in selectedCardsValues) {
  //   for (let j in playerCard.value) {
  //     if (selectedCardsValues[i] === playerCard.value[j]) {
  //       isMoveValid = true;
  //     }
  //   }
  // }

  return isMoveValid;

}
