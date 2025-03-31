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
  @Input() services:any
  @Input() car:any;
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.services)
  }


     async editService(service:any,type:string){
        const modal = await this.modalCtrl.create({
          component: AddServiceComponent,
          cssClass: type == 'car' ? 'editCarKmModal' : 'addServiceModal',
          componentProps:{
              service:service,
              type:type,
              car:this.car
          },
          backdropDismiss: true, 
          animated: true, 
        });
      
        await modal.present();
      
        const {data} = await modal.onDidDismiss();
      
        if(data?.value){
            // Update the service in the services array
            const index = this.services.findIndex(s => s.id === service.id);
            if (index !== -1) {
              this.services[index] = { ...this.services[index], ...data.value };
            }
        }
        if(data?.km){
            this.car.car_km = data.km
         }
      }

}
