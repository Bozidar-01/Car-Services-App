import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddServiceComponent } from '../add-service/add-service.component';

@Component({
  standalone:false,
  selector: 'app-change-settings',
  templateUrl: './change-settings.component.html',
  styleUrls: ['./change-settings.component.scss'],
})
export class ChangeSettingsComponent  implements OnInit {
  @Input() defaultServices:any
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {}


     async editService(service:any){
        const modal = await this.modalCtrl.create({
          component: AddServiceComponent,
          cssClass: 'addServiceModal',
          componentProps:{
              service:service
          },
          backdropDismiss: true, 
          animated: true, 
        });
      
        await modal.present();
      
        const {data} = await modal.onDidDismiss();
      
        if(data){
        }
      }

}
