import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { CarService } from 'src/app/shared/services/car.service';

@Component({
  standalone:false,
  selector: 'app-mods',
  templateUrl: './mods.component.html',
  styleUrls: ['./mods.component.scss'],
})
export class ModsComponent  implements OnInit {
  allMods:Array<any> = [];
  loaded:boolean = false;
  @Input() car:any;
  total:number = 0
  totalEuro:string = '0'
  constructor(private carService: CarService,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getAllMods()
  }

      getAllMods(){
        this.carService.getAllMods(this.car.id).pipe(first()).subscribe({
          next:(response)=>{
              this.allMods = response.data
              this.loaded = true;
              setTimeout(() => {
                this.calculateTotal(response.data)
              }, 200);
          }
        })
      }

      calculateTotal(services) {
        this.total = 0;
        services.forEach(service => {
          const price = Number(service.price) || 0; // Convert to number, default to 0
          this.total += price;
        });
        this.totalEuro = (this.total / 61.3).toFixed(2);
        this.cdr.detectChanges();
      }

}
