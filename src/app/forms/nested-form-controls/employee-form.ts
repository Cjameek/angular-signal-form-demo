import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, Control, apply } from '@angular/forms/signals';
import { User, NestedUserControls } from './user-controls';
import { Address, NestedAddressControls } from './address-controls';
import { employeeFormSchema, userSchema, addressSchema } from './schema';

export interface EmployeeFormState {
  employeeID: string | null,
  requireEmail: boolean,
  user: User,
  address?: Address,
}

@Component({
  selector: 'nested-employee-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form>

    <fieldset>
      <label for="employeeID">Employee ID # <small>(Required)</small></label>
      <input id="employeeID" type="text" [control]="employeeForm.employeeID" inputmode="numeric" pattern="[0-9]*" />
      @if(employeeForm.employeeID().errors().length > 0 && employeeForm.employeeID().touched()){
        @for(error of employeeForm.employeeID().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>

    <div>
      <label for="requireEmail">Require email?</label>
      <input id="requireEmail" type="checkbox" [control]="employeeForm.requireEmail" />
    </div>

    <div class="controls">
      <nested-user-controls [parentForm]="employeeForm" />
  
      @if(state().address){
        <nested-address-controls [parentForm]="employeeForm" />
      }
    </div>

    @if(employeeForm().errors().length > 0 && employeeForm().touched()){
      <p>
        @for(error of employeeForm().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      </p>
    }

    <div>
      <button type="button" (click)="toggleAddress()">Toggle Address Fields</button>
      <button type="button" (click)="toggleMiddleInitial()">Toggle Middle Initial Field</button>
    </div>

    <pre>
      Value: {{ employeeForm().value() | json }}
    </pre>
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

  readonly employeeForm = form(this.state, (profile) => {
    apply(profile, employeeFormSchema),
    apply(profile.user, userSchema),
    apply(profile.address, addressSchema)
  });

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
