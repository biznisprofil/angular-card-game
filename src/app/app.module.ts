import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CardsComponent } from './cards/cards.component';
import { ContractsService } from './cards/cards.service';
import { ListComponent } from './cards/list/list.component';


@NgModule({
  declarations: [
    AppComponent,
    CardsComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ContractsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
