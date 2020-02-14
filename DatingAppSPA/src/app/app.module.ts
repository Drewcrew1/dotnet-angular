import { BrowserModule } from '@angular/platform-browser';
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
import {BsDropdownModule} from "ngx-bootstrap";
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import {appRoutes} from "./routes";
import { MemberCardComponent } from './members/member-card/member-card.component';


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
    MemberCardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService, ErrorInterceptorprovider],
  bootstrap: [AppComponent]
})
export class AppModule { }
