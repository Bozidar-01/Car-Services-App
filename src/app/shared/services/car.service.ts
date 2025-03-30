import { Injectable } from '@angular/core';
import { HttpApiClientService } from './http-api-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private httpApiClient: HttpApiClientService) { }

  getCars(): Observable<any> {
    return this.httpApiClient.get<any>(`cars`)
  }

}
