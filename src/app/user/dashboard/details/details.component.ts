import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent  implements OnInit {

  engines = [
    {
      engine:'2.0 TDI',
      power: '150Hp',
    },
    {
      engine:'2.7 TDI',
      power: '190Hp',
    },
    {
      engine:'3.0 TDI',
      power: '230Hp',
    },
  ]

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {}

}
