class OpeningTimes {
    days!: string;
    opening!: string;
    closing!: string;
    closed!: string;
}

export class Review {
    author!: string;
    rating!: number;
    reviewText!: string;
}

export class Location {
  _id?: string; // MongoDB 원본 ID가 올 수도 있고
  id?: string;  // 변환된 ID가 올 수도 있음
  name!: string;
  distance!: number;
  address!: string;
  rating!: number;
  facilities!: string[];
  reviews!: Review[];
  coords!: number[];
  openingTimes?: any[];
}
