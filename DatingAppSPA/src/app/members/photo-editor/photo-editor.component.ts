import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Photo} from "../../_models/photo";
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../_services/auth.service";
import {UserService} from "../../_services/user.service";
import {AlertifyService} from "../../_services/alertify.service";
import {OuterSubscriber} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  public uploader:FileUploader;
  public hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;

  constructor(private authService: AuthService,
              private userService: UserService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.initUploader();
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  initUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.userId + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false;};

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response){
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
        if(photo.isMain){
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }
      }
    }
  }

  setMainPhoto(photo: Photo){
    this.userService.setMainPhoto(this.authService.decodedToken.userId, photo.id).subscribe(() => {
      this.currentMain = this.photos.filter( p => p.isMain === true)[0];
   this.currentMain.isMain = false;
   photo.isMain = true;
   this.authService.changeMemberPhoto(photo.url);
   this.authService.currentUser.photoUrl = photo.url;
   localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    }, error => {
      this.alertify.error(error);
    };
  }
  deletePhoto(id: number){
    this.alertify.confirm('Are you sure you wanted to delete this photo', () => {
      this.userService.deletePhoto(this.authService.decodedToken.userId, id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
        this.alertify.success('Photo has been deleted');
      }, error => {
        this.alertify.error('failed to delete the photo');
      })
    });

}