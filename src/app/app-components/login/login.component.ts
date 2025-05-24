import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PrismController } from "src/prism_core/controller/prism.controller";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DialogData } from "../../shared/components/error/error.component";
import { ConfigService } from 'src/core/services/config.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends PrismController<any> implements OnInit {
  loginForm!: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    data: DialogData = { title: ""};
  constructor(
    private formBuilder: FormBuilder,
    private auth_Service: AuthService,
    private configService: ConfigService
  ) {
    super()
  }
  async ngOnInit(){
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required/*, Validators.minLength(6)*/]
  });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  async onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    this.error = '';
    this.loading = true;
    var res = await this.auth_Service.Login(this.f['username'].value, this.f['password'].value)
    if(!res.Data.status){
      this.error = res.Data.message;
      this.loading = false;
      this.submitted = false;
      this.loginForm.setValue({username: '', password: ''});
      this.data.title = res.Data.message;
      this.ShowErrorInDialog(this.data);
    }
    else{
      var lastUrl = await this.getLastUrl();
      if (lastUrl){
        this.navigate(lastUrl);
      }
      else {
        this.navigate("/");
      }
    }
  }
}
