import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CarService } from 'src/app/shared/services/car.service';
import { first } from 'rxjs';
@Component({
  standalone:false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0 }))
      ]),
  
      transition(':enter', [
        style({ opacity: 0 }), 
        animate('200ms ease-in-out', style({ opacity: 1 })) 
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0 })) 
      ])
    ]),
  ]
})
export class DashboardPage implements OnInit {
  carsSegment:string = 'own'
  constructor(private carService: CarService) { }

  ngOnInit() {
    this.getBrands()
  }


  changeSegment(event:any){
    setTimeout(() => {
      this.carsSegment = event.detail.value
    }, 200);
  }


  getBrands(){

      this.carService.getCars().pipe(first()).subscribe({
        next:(response)=>{
          console.log(response)
        }
      })
  }
  

}
