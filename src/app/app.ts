import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NestedEmployeeForm } from './forms/nested-form-controls/employee-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NestedEmployeeForm],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-signal-form-demo');
}
