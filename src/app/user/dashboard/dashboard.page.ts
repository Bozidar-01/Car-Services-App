import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailsComponent } from './details/details.component';

@Component({
  standalone:false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  selectedCard: HTMLElement | null = null; // Track the currently selected card

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  async viewDetails(){
    const modal = await this.modalCtrl.create({
      component: DetailsComponent,
      cssClass: 'details-modal',
      backdropDismiss: true, 
      animated: true, 
    });
  
    await modal.present();
  
    const {data} = await modal.onDidDismiss();
  
    if(data){
    }
  }


  toggleCard(event: Event) {
    const clickedCard = event.currentTarget as HTMLElement;
  
    // Remove 'clicked' class from the previously selected card
    if (this.selectedCard && this.selectedCard !== clickedCard) {
      this.selectedCard.classList.remove("clicked");
    }
  
    // Toggle 'clicked' class on the newly clicked card
    clickedCard.classList.toggle("clicked");
  
    // Update the selected card
    this.selectedCard = clickedCard.classList.contains("clicked") ? clickedCard : null;
  }
  
  

}
