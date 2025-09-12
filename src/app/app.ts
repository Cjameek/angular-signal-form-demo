import { Component } from '@angular/core';
import { httpResource } from '@angular/common/http';

import { EmployeeFormState, NestedEmployeeForm } from './forms/nested-form-controls/employee-form';

const API_URL = "https://dummyjson.com/c/509a-b344-48ed-b26e";

@Component({
  selector: 'app-root',
  template: `
  <main class="main">
    <h1>Angular Signal Forms</h1>

    <!-- Simulate passing API data down to Signal Form component --> 
    <nested-employee-form [employeeData]="apiRes.value()" />
  </main>`,
  imports: [NestedEmployeeForm],
})
export class App {
  readonly apiRes = httpResource<EmployeeFormState>(() => API_URL);
}
