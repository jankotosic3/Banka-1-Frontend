import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Banka-1-Frontend';

  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('refreshToken');
  }
}
