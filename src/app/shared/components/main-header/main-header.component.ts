import { Component, OnInit } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  goHome(){}
}
