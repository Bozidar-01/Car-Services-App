import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddServiceComponent } from '../add-service/add-service.component';

@Component({
  standalone:false,
  selector: 'app-change-settings',
  templateUrl: './change-settings.component.html',
  styleUrls: ['./change-settings.component.scss'],
})
export class ChangeSettingsComponent  implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {}


     async editService(){
        const modal = await this.modalCtrl.create({
          component: AddServiceComponent,
          cssClass: 'addServiceModal',
          backdropDismiss: true, 
          animated: true, 
        });
      
        await modal.present();
      
        const {data} = await modal.onDidDismiss();
      
        if(data){
        }
      }

}
