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
      this.loc8rDataService.addReviewByLocationId(this.location.id, this.newReview)
        .then((review: Review) => {
          console.log('Review saved', review);
          let reviews = this.location.reviews.slice(0);
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
