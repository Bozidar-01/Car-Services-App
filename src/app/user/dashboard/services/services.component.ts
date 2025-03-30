import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonModal, ModalController, ViewWillEnter } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChangeSettingsComponent } from './components/change-settings/change-settings.component';
import { AddServiceComponent } from './components/add-service/add-service.component';
import { CarService } from 'src/app/shared/services/car.service';
import { first } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/shared/services/alerts.service';

@Component({
  standalone:false,
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  animations: [
    trigger('enterAnimation', [
      // First to Second: Second step enters from the bottom
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('exitLeftAnimation', [
      // Second to Third: Second step exits to the left
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('enterRightAnimation', [
      // Third step enters from the right
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('1300ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ServicesComponent  implements OnInit,ViewWillEnter {
  type:string
  newCarForm:FormGroup
  @ViewChild('dateModal') modal: IonModal
  @Input() car:any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  defaultServices:Array<any>;
  services:Array<any>;

  constructor(public modalCtrl: ModalController,
    private carService: CarService,
  private alertsService: AlertsService) { }

  ngOnInit() {
    this.newCarForm = new FormGroup ({
      car_km: new FormControl('',Validators.required),
      purchase_date: new FormControl('',Validators.required),
    })
  }

  
  async ionViewWillEnter() {
    if(!this.car.purchase_date && !this.car.car_km){
      this.type = 'firstStep'
    }else{
      await Promise.all([
        this.getDefaultServices(),
        this.getServices()
      ]);
        this.type = 'thirdStep'
    }
  }

  submit(){
    this.type = 'secondStep'
    setTimeout(async() => {
      await Promise.all([
        this.getDefaultServices(),
        this.getServices()
      ]);
        this.type = 'thirdStep'
    }, 2000);
  }
  
  scrollToTop() {
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
        this.content.scrollToTop(300);
      }
    }, 200); // Short delay to allow focus change detection
  }


   async changeSettingsModal(){
      const modal = await this.modalCtrl.create({
        component: ChangeSettingsComponent,
        cssClass: 'editServiceSettings',
        componentProps:{
          defaultServices:this.defaultServices
        },
        backdropDismiss: true, 
        animated: true, 
      });
    
      await modal.present();
    
      const {data} = await modal.onDidDismiss();
    
      if(data){
      }
    }

   async addServiceModal(){
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


    addNewCarDetails(){
      if(this.newCarForm.invalid){
        this.alertsService.presentToast('Please fill the fields above!', 'bottom' , 'danger');
        return;
      }else{

        let data = {
          id:this.car.id,
          car_km: this.newCarForm.value.car_km,
          purchase_date: this.newCarForm.value.purchase_date
        }
        console.log(data)
        this.carService.addNewUserCarDetails(data).pipe(first()).subscribe({
          next:(response)=>{
            this.submit()
          }
        })
      }
      
    }

    selectDate(event: any) {
      const selectedValue = event.detail.value;
      if (selectedValue && this.isFullDate(selectedValue)) {
        this.newCarForm.patchValue({ purchase_date: selectedValue });
        this.modal.dismiss(); // Close only on full date selection
      }  
    }

    isFullDate(value: string): boolean {
      // A full date looks like "2025-03-30" (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      return dateRegex.test(value);
    }

    getDefaultServices(){
      this.carService.getDefaultServices().pipe(first()).subscribe({
        next:(response)=>{
            this.defaultServices = response.data
        }
      })
    }

    getServices(){
      this.carService.getUserServices().pipe(first()).subscribe({
        next:(response)=>{
            this.services = response.data
        }
      })
    }

}
