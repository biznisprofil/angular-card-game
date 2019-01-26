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

        }
      }

      if (this.selectedCards.length === 0) {
        this.playerOneFreze = true;
        this.playerTwoFreze = true;
      }
    } else if (selectedCard.list === 'playerOne') {
      for (let card in this.playerOne) {
        if (selectedCard.value.code === this.playerOne[card].code) {
          this.playerOne[card].isSelected = true;

          if (isMoveValid(this.selectedCards, selectedCard.value)) {
            this.playerOneFinished = true;
            this.playerTwoFinished = false;
            this.playerOneFreze = true;
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

          if (isMoveValid(this.selectedCards, selectedCard.value)) {
            this.playerTwoFinished = true;
            this.playerOneFinished = false;
            this.playerTwoFreze = true;
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

      if (this.table.length === 0) {
        if (this.playerOneFinished && !this.playerTwoFinished) {
          this.playerTwoFreze = false;
        }
        if (!this.playerOneFinished && this.playerTwoFinished) {
          this.playerOneFreze = false;
        }
      }
    }, 500);
  }

  moveIsNotValid(list) {
    var answer = confirm('Move is not valid. If you want to drop the card press ok, otherwise press cancel and unselect the card.');

    if (answer) {
      if (list === 'playerOne') {
        for (let i = 0; i < this.playerOne.length; i++) {
          if (this.playerOne[i].isSelected) {
            this.playerOne[i].isSelected = false;
            this.table.push(this.playerOne[i]);
            this.playerOne.splice(i, 1);
            this.playerOneFinished = true;
            this.playerOneFreze = true;
          }
        }
      }

      if (list === 'playerTwo') {
        for (let i = 0; i < this.playerTwo.length; i++) {
          if (this.playerTwo[i].isSelected) {
            this.playerTwo[i].isSelected = false;
            this.table.push(this.playerTwo[i]);
            this.playerTwo.splice(i, 1);
            this.playerTwoFinished = true;
            this.playerOneFinished = false;
            this.playerTwoFreze = true;
          }
        }
      }

      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i].isSelected) {
          this.table[i].isSelected = false;
        }
      }

      this.selectedCards = new Array();
    }
    else {
      if (list === 'playerOne') {
        for (let i = 0; i < this.playerOne.length; i++) {
          if (this.playerOne[i].isSelected) {
            this.playerOne[i].isSelected = false;
          }
        }
        this.playerOneFreze = false;
      }

      if (list === 'playerTwo') {
        for (let i = 0; i < this.playerTwo.length; i++) {
          if (this.playerTwo[i].isSelected) {
            this.playerTwo[i].isSelected = false;
          }
        }
        this.playerTwoFreze = false;
      }
    }
  }
}

const isMoveValid = (selectedCards, playerCard) => {
  let isMoveValid: boolean = false;
  console.log('playerCard', playerCard);
  console.log('selectedCards', selectedCards);
  // if no selected cards move is not valid 
  if (!selectedCards.length) {
    return isMoveValid;
  }

  let selectedCardsCodes = [];
  let selectedCardsValuesAndSum = [];

  let i = selectedCards.length;
  while (i--) {
    selectedCardsCodes.push(selectedCards[i].code);
    console.log('selectedCards[i].value', selectedCards[i].value)
    selectedCards[i].value.forEach(element => {

      selectedCardsValuesAndSum.push(element);
      let sum = element;
      if (i > 0) {
        selectedCards[i - 1].value.forEach(otherElement => {
          sum += otherElement;
          selectedCardsValuesAndSum.push(element + otherElement)
        });
      }
      if (i > 1) {
        selectedCards[i - 2].value.forEach(otherElement => {
          sum += otherElement;
          selectedCardsValuesAndSum.push(element + otherElement)
        });
      }
      if (i > 2) {
        selectedCards[i - 3].value.forEach(otherElement => {
          sum += otherElement;
          selectedCardsValuesAndSum.push(element + otherElement)
        });
      }

      selectedCardsValuesAndSum.push(sum);

    });
  }

  let uniqueSelectedCardsValuesAndSum = removeDuplicate(selectedCardsValuesAndSum);
  console.log('uniqueSelectedCardsValues', uniqueSelectedCardsValuesAndSum);


  const playerCardValue = playerCard.value;
  console.log('playerCardValue', playerCardValue);

  for (let j = 0; j < uniqueSelectedCardsValuesAndSum.length; j++) {
    playerCardValue.forEach(element => {
      if (uniqueSelectedCardsValuesAndSum[j] === element) {
        isMoveValid = true;
        uniqueSelectedCardsValuesAndSum.splice(j, 1);
      }
    });
  }

  // find biggest value from booth arrays
  const playerCardMax = Math.max.apply(null, playerCardValue);
  const uniqueSelectedCardsValuesMax = Math.max.apply(null, uniqueSelectedCardsValuesAndSum);
  console.log('max', playerCardMax);

  // check if every item from selected cards are less than player card
  console.log('every_result_is_smaller_than(uniqueSelectedCardsValuesAndSum, playerCardMax)', every_result_is_smaller_than(uniqueSelectedCardsValuesAndSum, playerCardMax));
  if (!every_result_is_smaller_than(uniqueSelectedCardsValuesAndSum, playerCardMax)) {
    isMoveValid = false;
  }
  // Check if selected card is equal as player card
  if (every_item_is_equal_as(selectedCardsCodes, playerCard.code)) {
    isMoveValid = true;
  }

  // conditon that check two sum
  if (is_equal_like_two_sum(playerCardMax, uniqueSelectedCardsValuesMax) && selectedCards.length > 1) {
    isMoveValid = true;
  }

  if (check_sum_first_and_last_cards_values(selectedCards, playerCardValue)) {
    isMoveValid = true;
  }

  return isMoveValid;

}
// functions that serve as conditions for possible scenarios - naming convetion is intentionally different than component functions
function is_equal_like_two_sum(playerMax, selectedCardSumMax) {
  return selectedCardSumMax / playerMax === 2;
}

function every_item_is_equal_as(arr, equalAs) {
  return arr.every(item => item === equalAs);
}

function every_result_is_smaller_than(arr, lessThan) {
  return arr.every(item => item < lessThan);
}

function removeDuplicate(arr: any[]) {
  let unique_array = Array.from(new Set(arr));
  return unique_array;
}

function check_sum_first_and_last_cards_values(selectedCards, playerCard) {
  let conditionIsTrue = false;
  let i = selectedCards.length;
  let sumFirst = 0;
  let sumLast = 0;
  while (i--) {
    let first = 0;
    let last = selectedCards[i].value.length - 1;
    sumFirst += selectedCards[i].value[first];
    sumLast += selectedCards[i].value[last];
    console.log('selectedCards[i].value', selectedCards[i].value);
  }


  console.log('playerCard', playerCard)


  console.log('sumFirst', sumFirst)
  console.log('sumLast', sumLast)
  playerCard.forEach(element => {
    if (element === sumFirst || element === sumLast) {
      conditionIsTrue = true;
    }
  });


  console.log('conditionIsTrue', conditionIsTrue);

  return conditionIsTrue;

}
