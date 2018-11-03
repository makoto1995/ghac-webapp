import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: `<navbar></navbar>
  <router-outlet></router-outlet>`
})
export class AppComponent {
  title = '能源管理系统';
}
