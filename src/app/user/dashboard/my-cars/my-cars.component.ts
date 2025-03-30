import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailsComponent } from '../details/details.component';
import { ServicesComponent } from '../services/services.component';
import { CarService } from 'src/app/shared/services/car.service';
import { first } from 'rxjs';

@Component({
  standalone:false,
  selector: 'app-my-cars',
  templateUrl: './my-cars.component.html',
  styleUrls: ['./my-cars.component.scss'],
})
export class MyCarsComponent  implements OnInit {

  myCars: Array<any> = []

  constructor(private modalCtrl: ModalController, private carService: CarService) { }

  ngOnInit() {
   this.getMyCars()
  }

    async viewServices(){
      const modal = await this.modalCtrl.create({
        component: ServicesComponent,
        cssClass: '',
        backdropDismiss: true, 
        animated: true, 
      });
    
      await modal.present();
    
      const {data} = await modal.onDidDismiss();
    
      if(data){
      }
    }

    getMyCars(){
      this.carService.getUserCars().pipe(first()).subscribe({
        next:(response)=>{
            this.myCars = response.data
        }
      })
    }

}
