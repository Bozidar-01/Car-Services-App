import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  chooseFile:any
    @ViewChild(IonContent, { static: false }) content!: IonContent;
  constructor() { }

  ngOnInit() {
  }

  
  popFileChooser(event) {
    let formData = new FormData();
    this.chooseFile = event.target.files;
    formData.append('image', this.chooseFile[0]);
    // this.profileService
    //   .updatePictures(formData)
    //   .pipe(first())
    //   .subscribe({
    //     next: async (res) => {
    //       this.authService
    //         .getUserData()
    //         .pipe(first())
    //         .subscribe({
    //           next: (res) => {
    //             this.user.profile_picture = res.profile_picture;
    //           },
    //           error: (err) => {

    //           },
    //         });
    //     },
    //     error: (err) => {
    //       console.log(err);
    //   },
    //   });
  }
  
  scrollToTop() {
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
        this.content.scrollToTop(300);
      }
    }, 200); // Short delay to allow focus change detection
  }

}
