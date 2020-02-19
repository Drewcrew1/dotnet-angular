import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import { NavComponent } from './nav/nav.component';
import {FormsModule} from "@angular/forms";
import {AuthService} from "./_services/auth.service";
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import {ErrorInterceptorprovider} from "./_services/Error.interceptor";
import {BsDropdownModule, TabsModule} from "ngx-bootstrap";
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import {appRoutes} from "./routes";
import { MemberCardComponent } from './members/member-card/member-card.component';
import {JwtModule} from "@auth0/angular-jwt";
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import {MemberDetailResolver} from "./_resolvers/member-detail.resolver";
import {MemberListResolver} from "./_resolvers/member-list.resolver";
import {NgxGalleryModule} from "ngx-gallery";
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import {MemberEditResolver} from "./_resolvers/member-edit.resolver";


export function tokenGetter(){
  return localStorage.getItem("token");
}

export class CustomHammerConfig extends HammerGestureConfig{
  overrides = {
    pinch: {enable: false},
    rotate: {enable: false},
  };

}

@NgModule({
  declarations: [
    AppComponent,
    ValueComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    NgxGalleryModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:5000"],
        blacklistedRoutes: ["localhost:5000/api/auth"]
      }
    })
  ],
  providers: [AuthService, ErrorInterceptorprovider,
    MemberDetailResolver,
    MemberListResolver,
    MemberEditResolver,
    {provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
