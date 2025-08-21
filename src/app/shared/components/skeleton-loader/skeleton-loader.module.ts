import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SkeletonLoaderComponent } from './skeleton-loader.component';

@NgModule({
  declarations: [SkeletonLoaderComponent],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports:[SkeletonLoaderComponent]
})
export class SkeletonLoaderModule { }
