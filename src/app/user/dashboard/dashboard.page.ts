import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
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
  carsSegment:string = 'available'
  constructor() { }

  ngOnInit() {
  }


  changeSegment(event:any){
    setTimeout(() => {
      this.carsSegment = event.detail.value
    }, 200);
  }



  

}
