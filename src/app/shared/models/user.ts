export class User {
    id: number;
    first_name: string;
    last_name: string;
    favorite_team: string;
    email: string;
    badge_days_7: boolean;
    badge_days_31: boolean;
    balance: number;
    bio: string;
    expert: boolean;
    autorenew: boolean;
    points: number;
    profile_picture: string;
    rank: string;
    rate: string;
    subscription: string; 
    subscription_ends_at: string;
    token: string;
    accuracy: number;
    followers: number;
    following: number;
    last_week_rank: number;
    overall: number;
    payments: boolean;
    winning: number;
    following_users: Array<any>;


  
    constructor(
      id: number = 0,
      accuracy: number = 0,
      followers: number = 0,
      following: number = 0,
      following_users: Array<any> = [],
      first_name: string = '',
      last_name: string = '',
      email: string = '', 
      favorite_team: string = '', 
      badge_days_7: boolean = false,
      badge_days_31: boolean = false,
      autorenew: boolean = false,
      balance: number = null,
      bio: string = null,
      expert: boolean = false,
      payments: boolean = false,
      points: number = null,
      last_week_rank: number = 0,
      overall: number = 0,
      winning: number = 0,
      profile_picture: string = null,
      rank: string = null,
      rate: string = null,
      subscription: string = null,
      subscription_ends_at: string = null,
      token: string = '',
    ) {
      this.id = id;
      this.accuracy = accuracy;
      this.followers = followers;
      this.following = following;
      this.following_users = following_users;
      this.first_name = first_name;
      this.last_name = last_name;
      this.favorite_team = favorite_team;
      this.email = email;
      this.token = token;
      this.autorenew = autorenew;
      this.badge_days_7 = badge_days_7;
      this.badge_days_31 = badge_days_31;
      this.balance = balance;
      this.bio = bio;
      this.expert = expert;
      this.payments = payments;
      this.points = points;
      this.last_week_rank = last_week_rank;
      this.overall = overall;
      this.winning = winning;
      this.profile_picture = profile_picture;
      this.rank = rank;
      this.rate = rate;
      this.subscription = subscription;
      this.subscription_ends_at = subscription_ends_at;
    }
  }
  