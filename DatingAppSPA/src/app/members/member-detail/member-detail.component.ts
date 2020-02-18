import { Component, OnInit } from '@angular/core';
import {User} from "../../_models/user";
import {UserService} from "../../_services/user.service";
import {AlertifyService} from "../../_services/alertify.service";
import {ActivatedRoute} from "@angular/router";
import {INgxGalleryOptions, NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from "ngx-gallery";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
user: User;
galleryOptions: NgxGalleryOptions[];
galleryImages: NgxGalleryImage[];
  constructor(private userService: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.galleryOptions = [
      {
        width: '300px',
        height: '300px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      }
    ];
    this.galleryImages = this.getImages();

  }
  getImages(){
    const url = [];
    for (const photo of this.user.photos){
      url.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description,
      });
    }
    return url;
  }
loadUser(){
    this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) => {
      this.user = user;
    }, error => {
      this.alertify.error(error);
    })
}
}
