import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CompleteServiceComponent } from '../complete-service/complete-service.component';

@Component({
  standalone: false,
  selector: 'app-needs-service',
  templateUrl: './needs-service.component.html',
  styleUrls: ['./needs-service.component.scss'],
})
export class NeedsServiceComponent implements OnInit {
  @Input() services:any
  @Output() overdueServices = new EventEmitter<number>();
  overdueSrv:number = 0;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {}

  getDaysDifference(nextService: string): { text: string, overdue: boolean } {
    const today = new Date();
    const nextServiceDate = new Date(nextService);
  
    // Validate date
    if (isNaN(nextServiceDate.getTime())) {
      return { text: 'Invalid date', overdue: false };
    }
  
    const diffMs = nextServiceDate.getTime() - today.getTime();
    const overdue = diffMs < 0;
    const absDiffMs = Math.abs(diffMs);
    const totalDays = Math.round(absDiffMs / (1000 * 60 * 60 * 24));
  
    // Determine the largest unit
    if (totalDays >= 365) {
      const years = Math.round(totalDays / 365);
      return {
        text: overdue 
          ? `Overdue: ${years} year${years === 1 ? '' : 's'}`
          : `Due in: ${years} year${years === 1 ? '' : 's'}`,
        overdue
      };
    } else if (totalDays >= 30) {
      const months = Math.round(totalDays / 30);
      return {
        text: overdue 
          ? `Overdue: ${months} month${months === 1 ? '' : 's'}`
          : `Due in: ${months} month${months === 1 ? '' : 's'}`,
        overdue
      };
    } else {
      return {
        text: overdue 
          ? `Overdue: ${totalDays} day${totalDays === 1 ? '' : 's'}`
          : totalDays === 0 
            ? 'Due today'
            : `Due in: ${totalDays} day${totalDays === 1 ? '' : 's'}`,
        overdue
      };
    }
  }




     async completeServiceModal(service:any){
        const modal = await this.modalCtrl.create({
          component: CompleteServiceComponent,
          cssClass: 'addServiceModal',
          componentProps:{
            service:service
          },
          backdropDismiss: true, 
          animated: true, 
        });
      
        await modal.present();
      
        const {data} = await modal.onDidDismiss();
        
        if (data?.value) {
          // Update the service in the services array
          const index = this.services.findIndex(s => s.id === service.id);
          if (index !== -1) {
            this.services[index] = { ...this.services[index], ...data.value };
            // Example: Update status and other fields
            this.services[index].status = 'completed'; // Adjust based on response

            this.services.forEach(srv => {
              if(srv.status === 'active'){
                this.overdueSrv++
              }
            });

            this.overdueServices.emit(this.overdueSrv);

          }
        }
      }


}