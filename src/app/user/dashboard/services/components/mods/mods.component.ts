import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { CarService } from 'src/app/shared/services/car.service';

@Component({
  standalone:false,
  selector: 'app-mods',
  templateUrl: './mods.component.html',
  styleUrls: ['./mods.component.scss'],
})
export class ModsComponent  implements OnInit {
  allMods:Array<any>;
  @Input() car:any;
  total:number = 0
  totalEuro:string = '0'
  constructor(private carService: CarService) { }

  ngOnInit() {
    this.getAllMods()
  }

      getAllMods(){
        this.carService.getAllMods(this.car.id).pipe(first()).subscribe({
          next:(response)=>{
              this.allMods = response.data
              this.calculateTotal()

          }
        })
      }

      calculateTotal(){
        this.allMods.forEach(service => {
              this.total += service.price  
              this.totalEuro = (this.total / 61.3).toFixed(2);
          });
      }

}
