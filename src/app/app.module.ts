import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';



import {AppComponent} from './app.component';

import {AppConfig} from './app-config';
import {AppConfigModule} from './app-config/app-config.module';
import {AppRoutingModule} from './app-routing.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    AppConfigModule.forRoot<AppConfig>({apiUrl:'http://localhost:8080'}, './assets/data/appConfig.json'),
    AppRoutingModule
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
