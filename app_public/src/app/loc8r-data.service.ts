import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Location } from './home-list/home-list.component';
import { Location, Review } from './location';
import { User } from './user';
import { Authresponse } from './authresponse';
import { firstValueFrom } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { BROWSER_STORAGE } from './storage';


@Injectable({ providedIn: 'root' })

export class Loc8rDataService {
  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}
  //private apiBaseUrl = 'http://localhost:3000/api';
  private apiBaseUrl = environment.apiBaseUrl;

  public getLocations(lat: number, lng: number): Promise<Location[]> {
    //const lng: number = 126.94138;
    //const lat: number = 37.473399;
    const maxDistance: number = 20000;
    const url: string = `${this.apiBaseUrl}/locations?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`;
    return firstValueFrom(this.http.get<Location[]>(url))
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public getLocationById(locationId: string): Promise<Location> {
    const url: string = `${this.apiBaseUrl}/locations/${locationId}`;
    return firstValueFrom(this.http.get<Location>(url))
      .catch(this.handleError);
  }

  public addReviewByLocationId(locationId: string, formData: Review): Promise<any> {
    const url: string = `${this.apiBaseUrl}/locations/${locationId}/reviews`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('loc8r-token')}`
      })
    };
    return lastValueFrom(this.http.post(url, formData, httpOptions))
      .catch(this.handleError);
  }

  public login(user: User): Promise<Authresponse> {
    return this.makeAuthApiCall('login', user);
  }

  public register(user: User): Promise<Authresponse> {
    return this.makeAuthApiCall('register', user);
  }

  private makeAuthApiCall(urlPath: string, user: User): Promise<Authresponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return lastValueFrom(this.http.post<Authresponse>(url, user))
      .catch(this.handleError);
  }


}
