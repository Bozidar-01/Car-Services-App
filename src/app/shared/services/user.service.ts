import { Injectable } from '@angular/core';
import { HttpApiClientService } from './http-api-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 constructor(private httpApiClient: HttpApiClientService) { }

  getUserData(): Observable<any> {
    return this.httpApiClient.get<any>(`user`)
  }


  updateUser(data:any): Observable<any> {
    return this.httpApiClient.post<any>(`user/update`,data,true)
  }


  updateProfilePic(data:any): Observable<any> {
    return this.httpApiClient.post<any>(`user/updatePic`,data,true)
  }

}
