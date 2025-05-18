import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { HomeComponent } from "./home/home.component";
// import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../app/shared/shared.module";
import { ComponentsRoutes } from "./components.routing";

@NgModule({
  declarations: [
    // HomeComponent,
    // LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(ComponentsRoutes),
  ]
})
export class ComponentsModule { }
