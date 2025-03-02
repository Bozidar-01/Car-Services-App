import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailsComponent } from '../details/details.component';
import { ServicesComponent } from '../services/services.component';

@Component({
  standalone:false,
  selector: 'app-my-cars',
  templateUrl: './my-cars.component.html',
  styleUrls: ['./my-cars.component.scss'],
})
export class MyCarsComponent  implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    // this.viewServices()
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

}
