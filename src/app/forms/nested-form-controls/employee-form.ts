import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, Control, schema, required, pattern, maxLength, validate, customError } from '@angular/forms/signals';
import { User, NestedUserControls } from './user-controls';
import { Address, NestedAddressControls } from './address-controls';

export interface EmployeeFormState {
  employeeID: string | null,
  requireEmail: boolean,
  user: User,
  address?: Address,
}

const employeeFormSchema = schema<EmployeeFormState>((path) => {
  required(path.user.firstName, { message: 'First name is required' }),
  maxLength(path.user.firstName, 150)
  required(path.user.lastName, { message: 'Last name is required' }),
  maxLength(path.user.lastName, 150)
  required(path.user.email, { when: ({ valueOf }) => valueOf(path.requireEmail), message: 'Email is required' }),
  pattern(path.user.email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Must be valid email format'}),
  required(path.address.street, { message: "Street is required" }),
  validate(path, ({ value }) => 
    value().user.firstName == value().user.lastName ? [customError({ kind: 'disallowed', message: 'Last name and first name cannot match' })] : []
  )
});

@Component({
  selector: 'nested-employee-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form>
    <fieldset>
      <label for="employeeID">Employee ID #</label>
      <input id="employeeID" type="text" [control]="employeeForm.employeeID" />
    </fieldset>

    <div>
      <label for="requireEmail">Require email?</label>
      <input id="requireEmail" type="checkbox" [control]="employeeForm.requireEmail" />
    </div>

    <nested-user-controls [parentForm]="employeeForm" />

    @if(state().address){
      <nested-address-controls [parentForm]="employeeForm" />
    }

    @if(employeeForm().errors().length > 0 && employeeForm().touched()){
      @for(error of employeeForm().errors(); track $index) {
        <small class="error">{{ error.message }}</small>
      }
    }

    <pre>
      Value: {{ employeeForm().value() | json }}

      Valid: {{ employeeForm().valid() | json }}

      Errors: {{ employeeForm().errors() | json }}
    </pre>

    <div>
      <button type="button" (click)="toggleAddress()">Toggle Address Fields</button>
      <button type="button" (click)="toggleMiddleInitial()">Toggle Middle Initial Field</button>
    </div>
  </form>
  `,
  imports: [Control, JsonPipe, NestedUserControls, NestedAddressControls],
})
export class NestedEmployeeForm {
  readonly state = signal<EmployeeFormState>({
    employeeID: null,
    requireEmail: false,
    user: {
      firstName: '',
      lastName: '',
      email: ''
    }
  });

  employeeForm = form(this.state, employeeFormSchema);

  toggleMiddleInitial(): void {
    if('middleInitial' in this.state().user){
      const {middleInitial, ...newUser} = this.state().user as User;

      const updatedState = {
        ...this.state(),
        user: newUser
      } as EmployeeFormState;

      this.state.set(updatedState);
    } else {
      const newUser = {
        ...this.state().user,
        middleInitial: ''
      } as User;

      const updatedState = {
        ...this.state(),
        user: newUser
      } as EmployeeFormState;
      
      this.state.set(updatedState);
    }
  }

  toggleAddress(): void {
    if('address' in this.state()){
      const { address, ...updatedState } = this.state() as EmployeeFormState;

      this.state.set(updatedState);
    } else {
      const updatedState = {
        ...this.state(),
        address: {
          street: '',
          city: '',
          state: '',
          zip: ''
        }
      } as EmployeeFormState;
      
      this.state.set(updatedState);
    }
  }
}
