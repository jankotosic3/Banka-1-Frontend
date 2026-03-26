import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../user.service';

export type User = {
  firstname: string;
  lastname: string;
  jmbg: string;
}

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})

    // OVAKO IZGLEDA OBJEKAT KOJIM SE PRAVI NOVI KLIJENT


    // @NotBlank(message = "Ime je obavezno")
    // private String ime;

    // @NotBlank(message = "Prezime je obavezno")
    // private String prezime;

    // @NotNull(message = "Datum rodjenja je obavezan")
    // private Long datumRodjenja;

    // @NotNull(message = "Pol je obavezan")
    // private Pol pol;

    // @NotBlank(message = "Email je obavezan")
    // private String email;

    // /** Broj telefona klijenta (opcioni, u internacionalnom formatu). */
    // private String brojTelefona;

    // /** Adresa stanovanja klijenta (opciona). */
    // private String adresa;

    // /** JMBG klijenta – jedinstveni identifikator, ne sme se menjati. */
    // @NotBlank(message = "JMBG je obavezan")
    // @Size(min = 13, max = 13, message = "JMBG mora imati tacno 13 cifara")
    // private String jmbg;


export class UserCreateComponent {
  public firstName = '';
  public lastName = '';
  public jmbg = '';
  public submitting = false;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) {}

  public submit(form: NgForm): void {
    this.submitting = true;

    // If form is invalid, do not proceed and show validation messages
    if (form.invalid) {
      form.form.markAllAsTouched();
      this.submitting = false;
      return;
    }
    const user: User = {
      firstname: this.firstName,
      lastname: this.lastName,
      jmbg: this.jmbg
    };

    this.userService.createUser(user).subscribe({
      next: (createdUser) => {
        // Simulate creation and generate an id. In real app, call UserService.create(...) and use returned id.
        const createdId = 'c' + String(Math.floor(Math.random() * 1000000));
        const createdName = `${this.firstName} ${this.lastName}`.trim();
        
          // Read returnUrl from query params (if provided)
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/employees/accounts/new';
          
          // Navigate back to returnUrl with navigation state containing createdClientId and name
        this.router.navigateByUrl(returnUrl, { state: { createdClientId: createdId, createdClientName: createdName } });
        return;
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.submitting = false;
      }
    });

  }
}
