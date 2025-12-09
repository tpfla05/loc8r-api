import { Component, OnInit } from '@angular/core';
import { KakaoService } from '../kakao.service';
import { GeolocationService } from '../geolocation.service';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit {
  public locations: any[] = [];
  public message = '';

  public keywords: string[] = ['카페', '음식점', '분식', '치킨', '한식', '편의점'];
  public searchKeyword: string = this.keywords[0];

  private lat: number = 0;
  private lng: number = 0;

  public recentKeywords: string[] = [];

  constructor(
    private kakaoService: KakaoService,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit(): void {
    this.getUserLocation();
    this.loadRecentKeywords();
  }

  private getUserLocation(): void {
    this.message = 'Getting your location...';
    this.geolocationService.getPosition(
      this.setCoordinates.bind(this),
      this.showError.bind(this),
      this.noGeo.bind(this)
    );
  }

  private setCoordinates(position: any): void {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    this.searchCafes();
  }

  public searchCafes(): void {
    if (!this.searchKeyword.trim()) {
      this.message = '검색어를 입력하세요.';
      return;
    }

    this.message = `Searching for nearby ${this.searchKeyword}...`;

    this.kakaoService
      .searchCafes(this.searchKeyword, this.lng, this.lat)
      .subscribe(res => {

        this.locations = res.documents;
        this.message =
          res.documents.length > 0
            ? ''
            : `"${this.searchKeyword}" 검색 결과가 없습니다.`;

        this.saveRecentKeyword(this.searchKeyword);
      });
  }

  private saveRecentKeyword(keyword: string): void {
    const stored = localStorage.getItem('recentKeywords');
    let recent = stored ? JSON.parse(stored) : [];
    recent = [keyword, ...recent.filter((k: string) => k !== keyword)].slice(0, 5);
    localStorage.setItem('recentKeywords', JSON.stringify(recent));
    this.recentKeywords = recent;
  }

  private loadRecentKeywords(): void {
    const stored = localStorage.getItem('recentKeywords');
    this.recentKeywords = stored ? JSON.parse(stored) : [];
  }

  private showError(error: any): void {
    this.message = error.message;
  }

  private noGeo(): void {
    this.message = 'Geolocation not supported by this browser.';
  }
}
