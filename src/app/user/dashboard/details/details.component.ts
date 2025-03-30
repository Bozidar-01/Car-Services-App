import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { first } from 'rxjs';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { CarService } from 'src/app/shared/services/car.service';

@Component({
  standalone:false,
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent  implements OnInit {
@Input() models: any;

selectedModel:any = null

  constructor(public modalCtrl: ModalController,private carService: CarService,private alertsService:AlertsService) { }

  ngOnInit() {}

  selectModel(model:any){
      this.selectedModel = model
      console.log(this.selectedModel)
  }


  addNewCar(){
    if(this.selectedModel){

      let data = {
        car_model_id: this.selectedModel.id,
      engine: this.selectedModel.engines,
      color: this.selectedModel.colors,
      manufacture_date: this.selectedModel.manufacture_date,
    }
    
    this.carService.addNewUserCar(data).pipe(first()).subscribe({
      next:(response)=>{
        this.alertsService.presentToast('Car Added Successfully', 'bottom' , 'success');
        
        this.modalCtrl.dismiss()
      }
    })
  }else{
    this.alertsService.presentToast('Please select your model', 'bottom' , 'warning');
  }


  }

}
