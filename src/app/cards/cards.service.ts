import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Deck, Cards } from './cards.model';

@Injectable()
export class ContractsService {

    constructor(private http: HttpClient) { }

    public getCards(): Observable<Cards> {

        return this.http.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
            .mergeMap((deck: Deck) => {
                // console.log('deck', deck);
                return this.http.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${deck.remaining}`)
            })
            .map((res: Cards) => {
                // console.log('res', res)
                return res;
            }).catch(this.handleError);
    }

    private handleError(error: Response | any) {
        console.error('ApiService::handleError', error);
        return Observable.throw(error);
    }
}