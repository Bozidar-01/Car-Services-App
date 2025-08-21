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
  completedServiceForm: FormGroup
  modForm:FormGroup
  carForm:FormGroup
  maxDate: string = new Date().toISOString().split('T')[0];
  usedProduct: boolean = false;

  
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
          date_interval: [!this.service?.custom_service ? this.service?.default_service.date_interval :
            this.service?.custom_service.date_interval || '', Validators.required],
        });
      }else if (this.type === 'mod'){
        this.modForm = this.fb.group({
          mod_type: ['', Validators.required],
          price: ['', Validators.required],
       });
      }else if(this.type === 'completedService'){
        this.completedServiceForm = this.fb.group({
          name: ['', Validators.required],
          price: ['',Validators.required],
          service_date: ['', Validators.required],
          product_used: [''],
       });
      }else{
        this.carForm = this.fb.group({
          car_km: [this.car.car_km, Validators.required],
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
          product_used: this.serviceForm.value.product_used,
          price: this.serviceForm.value.price,
          service_interval: this.serviceForm.value.service_interval,
          date_interval: this.serviceForm.value.date_interval,
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


  addCompletedService(){
    if(this.completedServiceForm.invalid){
      this.alertService.presentToast('Please fill the above fields!','bottom','danger');
      return;
    }else{
      let data = {
        custom_service:{
          name: this.completedServiceForm.value.name,
          price: this.completedServiceForm.value.price,
          product_used: this.completedServiceForm.value.product_used,
          service_date: this.completedServiceForm.value.service_date,
        },
        user_car_id: this.car.id
      }
            
      this.carService.addCompletedService(data).pipe(first()).subscribe({
        next:(response)=>{
          this.alertService.presentToast('Service added!','bottom','success');

          this.modalCtrl.dismiss()
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
        date_interval: this.serviceForm.value.date_interval,
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

    this.carService.addMod(data).pipe(first()).subscribe({
      next:(response)=>{
        this.alertService.presentToast('Mod added!','bottom','success');
        this.modalCtrl.dismiss()
      }
    })
  }
  }


  updateKm(){
    if(this.carForm.invalid){
      this.alertService.presentToast('Please fill the above fields!','bottom','danger');
      return;
    }else{

      if(this.carForm.value.car_km == this.car.car_km){
        this.alertService.presentToast('Km cannot be same with previous Km record!','bottom','danger');
        return;
      }else if(this.carForm.value.car_km < this.car.car_km){
        this.alertService.presentToast('Km cannot be smaller then previous Km record!','bottom','danger');
        return;
      }else{
        let data = {
          car_km: this.carForm.value.car_km,
          user_car_id: this.car.id
        }
        
        this.carService.updateKm(data).pipe(first()).subscribe({
          next:(response)=>{
            this.alertService.presentToast('Km updated!','bottom','success');
            this.modalCtrl.dismiss({km:this.carForm.value.car_km})
          }
        })
      }
    }
  }


  toggleService(status:string){
      let data = {
        service_id: this.service.id,
        status: status,
      }


      this.carService.toggleService(data).pipe(first()).subscribe({
        next:(response)=>{
          this.alertService.presentToast('Service Status Changed!', 'bottom' , 'success');
          this.service.status = response.data.status
        }
      })
    }


    selectDate(event: any) {
      const selectedValue = event.detail.value;
      if (selectedValue) {
        this.completedServiceForm.patchValue({ service_date: selectedValue });
        // this.modalCtrl.dismiss();
      }
    }

}
