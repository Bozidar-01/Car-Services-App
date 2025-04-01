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
  
  getUserServices(id:number): Observable<any> {
    return this.httpApiClient.get<any>(`cars/activeServices/${id}`)
  }

  getAllServices(id:number): Observable<any> {
    return this.httpApiClient.get<any>(`cars/getAllServices/${id}`)
  }

  getCompletedServices(id:number): Observable<any> {
    return this.httpApiClient.get<any>(`cars/completedServices/${id}`)
  }

  completeService(data): Observable<any> {
    return this.httpApiClient.post<any>(`cars/completeService`,data,true)
  }

  toggleService(data): Observable<any> {
    return this.httpApiClient.post<any>(`cars/toggleService`,data,true)
  }

  addCustomService(data): Observable<any> {
    return this.httpApiClient.post<any>(`cars/addCustomService`,data,true)
  }

  updateService(data): Observable<any> {
    return this.httpApiClient.post<any>(`cars/updateService`,data,true)
  }

  addMod(data): Observable<any> {
    return this.httpApiClient.post<any>(`cars/addMod`,data,true)
  }

  getAllMods(id:number): Observable<any> {
    return this.httpApiClient.get<any>(`cars/getAllMods/${id}`)
  }

  countServiceCars(): Observable<any> {
    return this.httpApiClient.get<any>(`cars/countServiceCars`)
  }
  
  updateKm(data): Observable<any> {
    return this.httpApiClient.post<any>(`cars/updateCarKm`,data,true)
  }


  deleteUserCar(id:number): Observable<any> {
    return this.httpApiClient.get<any>(`cars/deleteUserCar/${id}`)
  }

}
