import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact',
    imports: [
        FormsModule,HttpClientModule, ReactiveFormsModule
    ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',

})
export class ContactComponent {
    public form: FormGroup;
    http = inject(HttpClient);
    fb = inject(FormBuilder);

    constructor() {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            message: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    submitForm() {
        this.http.post('https://twoje-api.execute-api.eu-west-1.amazonaws.com/prod/contact', this.form)
            .subscribe(() => alert('Wiadomość wysłana!'));
    }
}
