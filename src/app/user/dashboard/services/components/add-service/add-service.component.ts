import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss'],
})
export class AddServiceComponent  implements OnInit {
  @Input() service:any;
  serviceForm:FormGroup
  
  serviceIntervals: number[] = [
    5000, 
    10000,
    15000,
    30000,
    50000,
    70000,
    100000
  ];

  constructor(public modalCtrl: ModalController,private fb: FormBuilder) { }

  ngOnInit() {
    console.log('Service:', this.service);

    // Ensure service_interval is a number (if your intervals are numbers)
    const initialInterval = this.service?.service_interval 
      ? Number(this.service.service_interval) 
      : null;

    // If the existing interval isn’t in serviceIntervals, add it dynamically
    if (initialInterval && !this.serviceIntervals.includes(initialInterval)) {
      this.serviceIntervals.push(initialInterval);
      this.serviceIntervals.sort((a, b) => a - b); // Optional: keep sorted
    }

    this.serviceForm = this.fb.group({
      name: [this.service?.name || '', Validators.required],
      service_interval: [initialInterval, Validators.required],
    });
  }

}
