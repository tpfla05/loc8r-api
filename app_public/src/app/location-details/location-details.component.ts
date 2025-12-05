import { Component, OnInit, Input } from '@angular/core';
//import { Location } from '../home-list/home-list.component';
import { Location, Review } from '../location';
import { Loc8rDataService } from '../loc8r-data.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {

  @Input() location!: Location;

  public newReview = {
    author: '',
    rating: 5,
    reviewText: ''
  };

  public formVisible = false;

  public googleAPIKey: string = 'AIzaSyDoZjQE0dgM9ncX4OebbBHrq1nFnCoGdZ8';

  public formError!: string;
  private formIsValid(): boolean {
    if (this.newReview.author && this.newReview.rating && this.newReview.reviewText) {
      return true;
    } else {
      return false;
    }
  }

  private resetAndHideReviewForm(): void {
    this.formVisible = false;
    this.newReview.author = '';
    this.newReview.rating = 5;
    this.newReview.reviewText = '';
  }

  public onReviewSubmit(): void {
    this.formError = '';
    console.log('현재 location 데이터 전체:', this.location);
    this.newReview.author = this.getUsername();

    if (this.formIsValid()) {
      console.log(this.newReview);

      // [수정된 부분] id가 있으면 쓰고, 없으면 _id를 써라 (안전장치)
      const locationId = this.location.id || this.location._id;

      // [수정된 부분] locationId! 를 사용하여 확실한 ID를 넘겨줌
      this.loc8rDataService.addReviewByLocationId(locationId!, this.newReview)
        .then((review: Review) => {
          console.log('Review saved', review);
          
          // 리뷰 목록 갱신 (리뷰가 하나도 없을 때를 대비해 안전하게 처리)
          let reviews = this.location.reviews ? this.location.reviews.slice(0) : [];
          reviews.unshift(review);
          this.location.reviews = reviews;
          this.resetAndHideReviewForm();
        });
    } else {
      this.formError = 'All fields required, please try again';
    }
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public getUsername(): string {
  const user = this.authenticationService.getCurrentUser();
  if (!user) return 'Guest';
  return user.name;
}

  constructor(
    private loc8rDataService: Loc8rDataService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void { }

}
