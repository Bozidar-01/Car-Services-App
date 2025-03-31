import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
})
export class SkeletonLoaderComponent  implements OnInit {
 @Input() type: string =''
 
  constructor() { }

  ngOnInit() {}

}
