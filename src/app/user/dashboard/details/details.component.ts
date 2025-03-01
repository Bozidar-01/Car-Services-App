import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent  implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {}

}
