export class User {
    id: number;
    name: string;
    email: string;
    profile_pic: string;



  
    constructor(
      id: number = 0,
      name: string = '',
      email: string = '',
      profile_pic: string = ''      

    ) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.profile_pic = profile_pic;

    }
  }
  