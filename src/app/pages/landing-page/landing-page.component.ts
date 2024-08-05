import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  title = 'Loan';

  selectedCard: string='';

  selectCard(cardType: string) {
    this.selectedCard = cardType;
  }

}
