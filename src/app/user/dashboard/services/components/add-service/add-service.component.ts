import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { first } from 'rxjs';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { CarService } from 'src/app/shared/services/car.service';

@Component({
  standalone:false,
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss'],
})
export class AddServiceComponent  implements OnInit {
  @Input() service:any;
  @Input() car:any;
  @Input() type:string='service';
  serviceForm:FormGroup
  modForm:FormGroup
  
  serviceIntervals: number[] = [
    5000, 
    10000,
    15000,
    30000,
    50000,
    70000,
    100000
  ];

  constructor(public modalCtrl: ModalController,
    private fb: FormBuilder,
    private carService:CarService,
     private alertService: AlertsService) { }

  ngOnInit() {
    if(this.type === 'service'){

      let initialInterval:any
      if(!this.service?.custom_service){
        initialInterval = this.service?.default_service.service_interval 
        ? Number(this.service?.default_service.service_interval) 
        : null;
      }else{
        initialInterval = this.service?.custom_service.service_interval 
        ? Number(this.service?.custom_service.service_interval) 
        : null;
      }
      
      // If the existing interval isn’t in serviceIntervals, add it dynamically
      if (initialInterval && !this.serviceIntervals.includes(initialInterval)) {
        this.serviceIntervals.push(initialInterval);
        this.serviceIntervals.sort((a, b) => a - b); // Optional: keep sorted
      }
      
      this.serviceForm = this.fb.group({
        name: [!this.service?.custom_service ? this.service?.default_service.name :
          this.service?.custom_service.name || '', Validators.required],
          service_interval: [initialInterval, Validators.required],
        });
      }else{
        this.modForm = this.fb.group({
          mod_type: ['', Validators.required],
          price: ['', Validators.required],
       });
      }
}


  addCustomService(){
    if(this.serviceForm.invalid){
      this.alertService.presentToast('Please fill the above fields!','bottom','danger');
      return;
    }else{
      let data = {
        custom_service:{
          name: this.serviceForm.value.name,
          service_interval: this.serviceForm.value.service_interval,
        },
        user_car_id: this.car.id
      }
      
      console.log(data)
      
      this.carService.addCustomService(data).pipe(first()).subscribe({
        next:(response)=>{
          this.alertService.presentToast('Service added!','bottom','success');

          this.modalCtrl.dismiss({value:response.data})
        }
      })
    }
  }

  updateService(){
    if(this.serviceForm.invalid){
      this.alertService.presentToast('Please fill the above fields!','bottom','danger');
      return;
    }else{
    let data = {
      id: this.service.id,
      custom_service:{
        name: this.serviceForm.value.name,
        service_interval: this.serviceForm.value.service_interval,
      },
      user_car_id: this.car.id
    }

    console.log(data)

    this.carService.updateService(data).pipe(first()).subscribe({
      next:(response)=>{
        this.alertService.presentToast('Service updated!','bottom','success');
        this.modalCtrl.dismiss({value:response.data})
      }
    })
  }
  }
  
  addMod(){
    console.log('here')
    if(this.modForm.invalid){
      this.alertService.presentToast('Please fill the above fields!','bottom','danger');
      return;
    }else{
    let data = {
        mod_type: this.modForm.value.mod_type,
        price: this.modForm.value.price,
        user_car_id: this.car.id
    }

    console.log(data)

    this.carService.addMod(data).pipe(first()).subscribe({
      next:(response)=>{
        this.alertService.presentToast('Mod added!','bottom','success');
        this.modalCtrl.dismiss()
      }
    })
  }
  }

}
