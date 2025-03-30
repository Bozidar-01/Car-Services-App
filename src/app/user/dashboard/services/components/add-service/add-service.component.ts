import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss'],
})
export class AddServiceComponent  implements OnInit {
  serviceIntervals = [
    '5 000',
    '10 000',
    '15 000',
    '30 000',
    '50 000',
    '70 000',
    '100 000'
];

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {}

}
