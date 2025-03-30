import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { CarService } from 'src/app/shared/services/car.service';

@Component({
  standalone:false,
  selector: 'app-serviced',
  templateUrl: './serviced.component.html',
  styleUrls: ['./serviced.component.scss'],
})
export class ServicedComponent  implements OnInit {
  services: Array<any>;
  total:number = 0
  totalEuro:string = '0'
  @Input() car:any;
  constructor(private carService: CarService) { }

  ngOnInit() {
    this.getServices()
  }

      getServices(){
        this.carService.getCompletedServices(this.car.id).pipe(first()).subscribe({
          next:(response)=>{
              this.services = response.data
              this.calculateTotal()
          }
        })
      }


      calculateTotal(){
        this.services.forEach(service => {
              this.total += service.price  
              this.totalEuro = (this.total / 61.3).toFixed(2);
          });
      }

}
