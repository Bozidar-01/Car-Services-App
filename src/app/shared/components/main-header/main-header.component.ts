import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent  implements OnInit {
  isVisible: boolean = true;
  
  constructor(private router: Router) { 
    this.router.events.subscribe(() => {
      this.isVisible = this.router.url !== '/authed/user/profile';
    });
  }
  

  ngOnInit() {}

  goHome(){}
}
