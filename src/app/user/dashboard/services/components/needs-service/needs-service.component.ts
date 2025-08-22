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
  @Input() car: any;
  @Input() services: any[] = [];
  @Output() overdueServices = new EventEmitter<number>();
  overdueSrv: number = 0;

  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {
    this.updateServicesDaysDiff();
  }

  getDaysDifference(nextService: string): { text: string; overdue: boolean } {
    const today = new Date();
    const nextServiceDate = new Date(nextService);

    if (isNaN(nextServiceDate.getTime())) {
      return { text: 'Invalid date', overdue: false };
    }

    const diffMs = nextServiceDate.getTime() - today.getTime();
    const overdue = diffMs < 0;
    const totalDays = Math.round(Math.abs(diffMs) / (1000 * 60 * 60 * 24));

    if (totalDays >= 365) {
      const years = Math.round(totalDays / 365);
      return {
        text: overdue ? `Overdue: ${years} year${years !== 1 ? 's' : ''}` : `Due in: ${years} year${years !== 1 ? 's' : ''}`,
        overdue
      };
    } else if (totalDays >= 30) {
      const months = Math.round(totalDays / 30);
      return {
        text: overdue ? `Overdue: ${months} month${months !== 1 ? 's' : ''}` : `Due in: ${months} month${months !== 1 ? 's' : ''}`,
        overdue
      };
    } else {
      return {
        text: overdue ? `Overdue: ${totalDays} day${totalDays !== 1 ? 's' : ''}` : totalDays === 0 ? 'Due today' : `Due in: ${totalDays} day${totalDays !== 1 ? 's' : ''}`,
        overdue
      };
    }
  }

  updateServicesDaysDiff() {
    if (!this.services) return;

    this.services = this.services.map(service => {
      if (service.status === 'active') {
        const diff = this.getDaysDifference(service.next_service);
        return { ...service, daysDiffText: diff.text, daysOverdue: diff.overdue };
      }
      return service;
    });

    this.overdueSrv = this.services.filter(s => s.status === 'active').length;
    this.overdueServices.emit(this.overdueSrv);
  }

async completeServiceModal(service: any) {
  const modal = await this.modalCtrl.create({
    component: CompleteServiceComponent,
    cssClass: 'completeServiceModal',
    componentProps: { service },
    backdropDismiss: true,
    animated: true,
  });

  await modal.present();

  const { data } = await modal.onDidDismiss();

  if (data?.value) {
    const returnedService = data.value;
    const index = this.services.findIndex(s => s.id === service.id);

    if (index !== -1) {
      let updatedService = { ...this.services[index], ...returnedService };

      if (updatedService.status === 'completed') {
        // Remove completed service
        this.services.splice(index, 1);
      } else {
        // Update service and recalculate days difference
        const diff = this.getDaysDifference(updatedService.next_service);
        updatedService.daysDiffText = diff.text;
        updatedService.daysOverdue = diff.overdue;

        // Replace object in array
        this.services[index] = updatedService;
      }

      // Force change detection
      this.services = [...this.services];

      // Update overdue services count
      this.overdueSrv = this.services.filter(srv => srv.status === 'active').length;
      this.overdueServices.emit(this.overdueSrv);
    }
  }
}


  // trackBy function for *ngFor
  trackByServiceId(index: number, service: any) {
    return service.id;
  }
}
