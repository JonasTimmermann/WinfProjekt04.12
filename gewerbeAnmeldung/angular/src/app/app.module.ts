import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';




import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormularComponent } from './formular/formular.component';

import { HttpClientModule } from '@angular/common/http';

import { HttpRequestService } from './http-request.service';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


const appRoutes: Routes = [
  {path:'Formular', component:FormularComponent},
  {path:'AdminDashboard', component:AdminDashboardComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    FormularComponent,
    AdminDashboardComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
   // HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [HttpRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
