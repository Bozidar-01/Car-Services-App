import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChangeSettingsComponent } from './components/change-settings/change-settings.component';
import { AddServiceComponent } from './components/add-service/add-service.component';

@Component({
  standalone:false,
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  animations: [
    trigger('enterAnimation', [
      // First to Second: Second step enters from the bottom
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('exitLeftAnimation', [
      // Second to Third: Second step exits to the left
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('enterRightAnimation', [
      // Third step enters from the right
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('1300ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ServicesComponent  implements OnInit {
  type:string = 'firstStep'
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    this.addServiceModal()
  }


  submit(){
    this.type = 'secondStep'
    setTimeout(() => {
      this.type = 'thirdStep'
    }, 2000);
  }
  
  scrollToTop() {
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
        this.content.scrollToTop(300);
      }
    }, 200); // Short delay to allow focus change detection
  }


   async changeSettingsModal(){
      const modal = await this.modalCtrl.create({
        component: ChangeSettingsComponent,
        cssClass: 'editServiceSettings',
        backdropDismiss: true, 
        animated: true, 
      });
    
      await modal.present();
    
      const {data} = await modal.onDidDismiss();
    
      if(data){
      }
    }

   async addServiceModal(){
      const modal = await this.modalCtrl.create({
        component: AddServiceComponent,
        cssClass: 'addServiceModal',
        backdropDismiss: true, 
        animated: true, 
      });
    
      await modal.present();
    
      const {data} = await modal.onDidDismiss();
    
      if(data){
      }
    }

}
