import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KakaoService {

  private baseUrl = `${environment.apiBaseUrl}/kakao/search`;

  constructor(private http: HttpClient) {}

  searchCafes(keyword: string, x: number, y: number, radius: number = 2000): Observable<any> {
    return this.http.get(this.baseUrl, {
      params: {
        query: keyword,
        x,
        y,
        radius
      }
    });
  }
}
