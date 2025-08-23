import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent, IonModal, IonSelect, ModalController, NavController, ViewWillEnter } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChangeSettingsComponent } from './components/change-settings/change-settings.component';
import { AddServiceComponent } from './components/add-service/add-service.component';
import { CarService } from 'src/app/shared/services/car.service';
import { first } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import { CarDocsComponent } from './components/car-docs/car-docs.component';

@Component({
  standalone: false,
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
animations: [
  trigger('enterAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translate3d(0, 50px, 0)' }),
      animate(
        '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
        style({ opacity: 1, transform: 'translate3d(0, 0, 0)' })
      )
    ])
  ]),

  trigger('exitLeftAnimation', [
    transition(':leave', [
      animate(
        '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
        style({ opacity: 0, transform: 'translate3d(-100%, 0, 0)' })
      )
    ])
  ]),

  trigger('enterRightAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translate3d(100%, 0, 0)' }),
      animate(
        '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
        style({ opacity: 1, transform: 'translate3d(0, 0, 0)' })
      )
    ])
  ])
]

})
export class ServicesComponent implements OnInit, ViewWillEnter {
  type: string;
  newCarForm: FormGroup;
  maxDate: string = new Date().toISOString().split('T')[0];
  user: any;
  loaded:boolean = false;
  @ViewChild('dateModal') modal: IonModal;
  @Input() car: any;
  overdueServices: number = 0;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('addSelect', { static: false }) addSelect: IonSelect;
  allServices: Array<any>;
  services: Array<any>;
  addOptions = [
    { value: 'service', label: 'Add New Service' },
    { value: 'completedService', label: 'Add Completed Service' },
    { value: 'mod', label: 'Add New Mod' },
  ];

  constructor(
    public modalCtrl: ModalController,
    private carService: CarService,
    private alertsService: AlertsService,
  ) {}

  ngOnInit() {
    this.newCarForm = new FormGroup({
      car_km: new FormControl('', Validators.required),
      purchase_date: new FormControl('', Validators.required),
      car_price: new FormControl('', Validators.required),
    });
  }

  async ionViewWillEnter() {
    this.loadUserData();
    if (!this.car.purchase_date && !this.car.car_km) {
      this.type = 'firstStep';
    } else {
      await Promise.all([this.getAllServices(), this.getServices()]);
      this.type = 'thirdStep';
      setTimeout(() => {            
        this.loaded = true;
      }, 500);
    }
  }

  submit() {
    this.type = 'secondStep';
    setTimeout(async () => {
      await Promise.all([this.getAllServices(), this.getServices()]);
      this.loaded=true
      this.type = 'thirdStep';
    }, 2000);
  }

  scrollToTop() {
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
        this.content.scrollToTop(300);
      }
    }, 200);
  }

  async handleAddOption(event: CustomEvent) {
    const selectedValue = event.detail.value;
    if (selectedValue === 'service') {
      await this.addServiceModal('service');
    } else if (selectedValue === 'mod') {
      await this.addServiceModal('mod');
    } else if (selectedValue === 'completedService') {
      await this.addServiceModal('completedService');
    }
    if (this.addSelect) {
      this.addSelect.value = null;
    }
  }

  async changeSettingsModal() {
    const modal = await this.modalCtrl.create({
      component: ChangeSettingsComponent,
      cssClass: 'editServiceSettings',
      componentProps: {
        services: this.allServices,
        car: this.car,
      },
      backdropDismiss: true,
      animated: true,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.value && !data.value.deleted) {
      this.services = data.value;
      this.getServices();  
    }
    if(data.value.deleted){
      this.modalCtrl.dismiss({value:''})
    }
  }

  async addServiceModal(type: string) {
    const modal = await this.modalCtrl.create({
      component: AddServiceComponent,
      cssClass: type === 'service' ? 'addServiceModal' : type === 'mod' ? 'addModModal' : 'addOldServiceModal',
      componentProps: {
        car: this.car,
        type: type,
      },
      backdropDismiss: true,
      animated: true,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.value && type === 'service') {
      this.allServices.push(data.value);
      await this.getServices(); // This will update services and overdueServices
    }else if (data?.value){
          this.car.total_price = this.car.total_price + (data.value)/61.3
    }
  }

    async carDocsModal() {
    const modal = await this.modalCtrl.create({
      component: CarDocsComponent,
      cssClass: 'carDocsModal',
      componentProps: {
        car: this.car,
      },
      backdropDismiss: true,
      animated: true,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
 
  }

  addNewCarDetails() {
    if (this.newCarForm.invalid) {
      this.alertsService.presentToast('Please fill the fields above!', 'bottom', 'danger');
      return;
    } else {
      let data = {
        id: this.car.id,
        car_km: this.newCarForm.value.car_km,
        car_price: this.newCarForm.value.car_price,
        purchase_date: this.newCarForm.value.purchase_date,
      };
      this.carService.addNewUserCarDetails(data).pipe(first()).subscribe({
        next: (response) => {
          this.car = { ...this.car, car_km: this.newCarForm.value.car_km, purchase_date: this.newCarForm.value.purchase_date };
          this.submit();
        },
      });
    }
  }

  selectDate(event: any) {
    const selectedValue = event.detail.value;
    if (selectedValue && this.isFullDate(selectedValue)) {
      this.newCarForm.patchValue({ purchase_date: selectedValue });
      this.modal.dismiss();
    }
  }

  isFullDate(value: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(value);
  }

  getAllServices() {
    return new Promise((resolve) => {
      this.carService.getAllServices(this.car.id).pipe(first()).subscribe({
        next: (response) => {
          this.allServices = response.data;
          resolve(true);
        },
      });
    });
  }

  getServices() {
    return new Promise((resolve) => {
      this.carService.getUserServices(this.car.id).pipe(first()).subscribe({
        next: (response) => {
          this.services = response.data;
          this.updateOverdueCount(); // Recalculate with reset         
          resolve(true);
        },
      });
    });
  }

  updateOverdueCount() {
    this.overdueServices = 0; // Reset to 0 before counting
    
    const currentDate = new Date(); 
    
    this.overdueServices = this.services?.filter(service => 
        service.status === 'active' &&
        new Date(service.next_service) <= currentDate ||
        service.next_service_km <= this.car.car_km
    ).length || 0;
    console.log('Updated overdueServices:', this.overdueServices); // Debug
}

  async loadUserData() {
    const { value } = await Preferences.get({ key: environment.carServiceStorageKey.user });
    if (value) {
      this.user = JSON.parse(value);
    }
  }

  servicesOverdue(srv:any) {
    if(srv){
      this.overdueServices = srv.overdueSrv; 
      this.services.length = 0;
      this.services.push(...srv.services);
    }
   }

  updateCarPrice(price:any) {
      this.car.total_price = this.car.total_price + (price)/61.3
   }



}