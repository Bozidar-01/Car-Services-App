import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailsComponent } from '../details/details.component';
import { ServicesComponent } from '../services/services.component';
import { CarService } from 'src/app/shared/services/car.service';
import { first } from 'rxjs';
import Swiper from 'swiper';

@Component({
  standalone:false,
  selector: 'app-my-cars',
  templateUrl: './my-cars.component.html',
  styleUrls: ['./my-cars.component.scss'],
})
export class MyCarsComponent  implements OnInit,AfterViewInit {
  @ViewChild('swiperRef') swiperElement: any;
  swiper?: Swiper;
  previousCarOrder: number[] = [];
  myCars: Array<any> = []
  count: number = 0
  carsInNeedOfService: Array<any>
  showLoader: boolean = true

  constructor(private modalCtrl: ModalController, private carService: CarService) { }

  ngOnInit() {
   this.getMyCars()
   this.countServiceCars()
  }

  ngAfterViewInit() {
    this.swiper = this.swiperElement?.nativeElement?.swiper;
  }


    async viewServices(car:any){
      const modal = await this.modalCtrl.create({
        component: ServicesComponent,
        componentProps:{
          car:car
        },
        cssClass: '',
        backdropDismiss: true, 
        animated: true, 
      });
    
      await modal.present();
    
      const {data} = await modal.onDidDismiss();
    
      if(data){
        this.getMyCars()
        this.countServiceCars()
      }
    }

    getMyCars() {
      this.carService.getUserCars().pipe(first()).subscribe({
        next: (response) => {
          const newCarOrder = response.data.map(car => car.id);
    
          // Check if the order has changed
          const hasOrderChanged = this.previousCarOrder.length &&
            !this.previousCarOrder.every((id, index) => id === newCarOrder[index]);
    
          // Update myCars
          this.myCars = response.data;
          this.showLoader = false;
          this.previousCarOrder = [...newCarOrder]; // Save the new order
    
          // Reset Swiper index if order changed
          if (hasOrderChanged && this.swiper && this.myCars.length) {
            this.swiper.slideTo(0);
          }
        }
      });
    }
    

    countServiceCars(){
      this.carService.countServiceCars().pipe(first()).subscribe({
        next:(response)=>{
            this.count = response.data.count
            this.carsInNeedOfService = response.data.car_ids
        }
      })
    }

    trackByCarId(index, car) {
      return car.id;
    }

}
