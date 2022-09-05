import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service'
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'angular-nginx-sample-web-application';

  loginForm: FormGroup;
  submitted = false;
  loading = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private renderer: Renderer2
  ) {
    //redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  handleShowHidePassword() {
    if ((document.getElementById('eyeSlashIcon') as HTMLSpanElement).style.display !== "none") {
      (document.getElementById('eyeSlashIcon') as HTMLSpanElement).style.display = "none";
      (document.getElementById('eyeIcon') as HTMLSpanElement).style.display = "block";
      (document.getElementById('password') as HTMLInputElement).setAttribute('type', 'text');
    }
    else {
      (document.getElementById('eyeIcon') as HTMLSpanElement).style.display = "none";
      (document.getElementById('eyeSlashIcon') as HTMLSpanElement).style.display = "block";
      (document.getElementById('password') as HTMLInputElement).setAttribute('type', 'password');
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
  }
}

