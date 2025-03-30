import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailsComponent } from '../details/details.component';
import { CarService } from 'src/app/shared/services/car.service';
import { first } from 'rxjs';

@Component({
  standalone:false,
  selector: 'app-available-cars',
  templateUrl: './available-cars.component.html',
  styleUrls: ['./available-cars.component.scss'],
})
export class AvailableCarsComponent  implements OnInit {
  selectedCard: HTMLElement | null = null; // Track the currently selected card
  cars:Array<any>=[]
  carModels:Array<any>=[]
  carBrands:Array<any>=[]
  selectedFilter:string = 'cars';
  constructor(private modalCtrl: ModalController,private carService: CarService) { }

  ngOnInit() {
    this.getCars()
    this.getCarBrands()
  }

  async viewDetails(){
    const modal = await this.modalCtrl.create({
      component: DetailsComponent,
      cssClass: 'details-modal',
      componentProps:{
        models: this.carModels
      },
      backdropDismiss: true, 
      animated: true, 
    });
  
    await modal.present();
  
    const {data} = await modal.onDidDismiss();
  
    if(data){
    }
  }


  toggleCard(event: Event,filter:string) {
    const clickedCard = event.currentTarget as HTMLElement;
    this.selectedFilter = filter
    // Remove 'clicked' class from the previously selected card
    if (this.selectedCard && this.selectedCard !== clickedCard) {
      this.selectedCard.classList.remove("clicked");
    }
  
    // Toggle 'clicked' class on the newly clicked card
    clickedCard.classList.toggle("clicked");
  
    // Update the selected card
    this.selectedCard = clickedCard.classList.contains("clicked") ? clickedCard : null;
  }

  getCars(){

    this.carService.getCars().pipe(first()).subscribe({
      next:(response)=>{
        this.cars = response.data
      }
    })
}

  getCarModels(id:number){

    this.carService.getCarModels(id).pipe(first()).subscribe({
      next:(response)=>{
        this.carModels = response.data

        this.viewDetails()

      }
    })
}

  getCarBrands(){

    this.carService.getCarBrands().pipe(first()).subscribe({
      next:(response)=>{
        this.carBrands = response.data

      }
    })
}

}
