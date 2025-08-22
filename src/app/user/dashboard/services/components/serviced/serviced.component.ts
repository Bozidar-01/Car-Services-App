import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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
  total: number = 0; // Initialize to 0
  totalEuro: string | number = 0; // Can be string due to toFixed()
  loaded:boolean = false;
  @Input() car:any;
  constructor(private carService: CarService,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getServices()
  }

      getServices(){
        this.carService.getCompletedServices(this.car.id).pipe(first()).subscribe({
          next:(response)=>{
              this.services = response.data
              setTimeout(() => {
                this.loaded = true;
                this.calculateTotal(response.data)
              }, 200);
              this.cdr.detectChanges();
          }
        })
      }


      calculateTotal(services) {
        this.total = 0;
        services.forEach(service => {
          const price = service?.custom_service?.price ? Number(service.custom_service.price) + Number(service.price) : Number(service.price) || 0; // Convert to number, default to 0
          this.total += price;
        });
        this.totalEuro = (this.total / 61.3).toFixed(2);
        this.cdr.detectChanges();
      }
}
