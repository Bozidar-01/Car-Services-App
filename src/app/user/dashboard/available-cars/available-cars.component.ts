import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() type = new EventEmitter<string>();
  selectedCard: HTMLElement | null = null; // Track the currently selected card
  cars:Array<any>=[]
  filteredCars:Array<any>=[]
  carModels:Array<any>=[]
  carBrands:Array<any>=[]
  selectedFilter:string = 'cars';
  selectedBrand = null;
  showLoader: boolean = true
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
  
    if(data?.value){
      this.getCars()
      this.getCarBrands()
      this.changeType();
    }
  }

  changeType(){
    this.type.emit('own')
  }


  toggleCard(event: Event, filter: string) {
    const clickedCard = event.currentTarget as HTMLElement;
    this.selectedFilter = filter;

    if (filter === 'cars') {
      this.filteredCars = this.cars;
    }

    // Remove 'clicked' class from the previously selected card (if different)
    if (this.selectedCard && this.selectedCard !== clickedCard) {
      this.selectedCard.classList.remove("clicked");
    }

    // Add 'clicked' class, but don’t remove it if already present
    if (!clickedCard.classList.contains("clicked")) {
      clickedCard.classList.add("clicked");
    }

    // Update the selected card
    this.selectedCard = clickedCard;
  }

  getCars(){

    this.carService.getCars().pipe(first()).subscribe({
      next:(response)=>{
        this.cars = response.data
        this.filteredCars = this.cars

          this.showLoader = false
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

showBrandCars(brandID: number) {
  this.filteredCars = this.cars.filter(car => car.car_brand_id === brandID);

  this.selectedFilter = 'cars'
}

}
