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

  getUserCars(): Observable<any> {
    return this.httpApiClient.get<any>(`cars/getUserCars`)
  }

  getCarBrands(): Observable<any> {
    return this.httpApiClient.get<any>(`carBrands`)
  }

  getCarModels(id:number): Observable<any> {
    return this.httpApiClient.get<any>(`cars/models/${id}`)
  }

  addNewUserCar(data:any): Observable<any> {
    return this.httpApiClient.post<any>(`cars/addUserCar`,data,true)
  }

  addNewUserCarDetails(data:any): Observable<any> {
    return this.httpApiClient.post<any>(`cars/updateUserCar`,data,true)
  }

  getDefaultServices(): Observable<any> {
    return this.httpApiClient.get<any>(`cars/defaultServices`)
  }
  
  getUserServices(): Observable<any> {
    return this.httpApiClient.get<any>(`cars/activeServices`)
  }

  completeService(data): Observable<any> {
    return this.httpApiClient.post<any>(`cars/completeService`,data,true)
  }
}
