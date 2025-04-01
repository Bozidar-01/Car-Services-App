import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AddServiceComponent } from '../add-service/add-service.component';
import { CarService } from 'src/app/shared/services/car.service';
import { first } from 'rxjs';

@Component({
  standalone:false,
  selector: 'app-change-settings',
  templateUrl: './change-settings.component.html',
  styleUrls: ['./change-settings.component.scss'],
})
export class ChangeSettingsComponent  implements OnInit {
  @Input() services:any
  @Input() car:any;
  constructor(public modalCtrl: ModalController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private carService: CarService
  ) { }

  ngOnInit() {
    console.log(this.services)
  }


     async editService(service:any,type:string){
        const modal = await this.modalCtrl.create({
          component: AddServiceComponent,
          cssClass: type == 'car' ? 'editCarKmModal' : 'editServiceModal',
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

      async presentAlert() {
        const alert = await this.alertController.create({
          header: 'Remove Car',
          message: 'Are you sure you want to remove this car?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Car deletion cancelled');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                console.log('Car marked as deleted');
                this.deleteUserCar(this.car.id)
              }
            }
          ]
        });
    
        await alert.present();
      }
    
      deleteUserCar(id:number){
    
        this.carService.deleteUserCar(id).pipe(first()).subscribe({
          next:async(response)=>{
              await this.modalCtrl.dismiss({value:{
                deleted:true,
                car:response.data
              }});
            this.navCtrl.navigateRoot('authed/user/dashboard')
          }
        })
    
      }
  

}
