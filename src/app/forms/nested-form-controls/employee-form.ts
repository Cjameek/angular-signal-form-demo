import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, Control, apply, submit, Field } from '@angular/forms/signals';
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
  <aside>
    <button type="button" (click)="toggleAddress()">Toggle Address Fields</button>
    <button type="button" (click)="toggleMiddleInitial()">Toggle Middle Initial Field</button>
  </aside>

  <form (submit)="submitEmployee($event)">
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

    <section class="controls">
      <nested-user-controls [parentForm]="employeeForm" />
  
      @if(state().address){
        <nested-address-controls [parentForm]="employeeForm" />
      }
    </section>

    @if(employeeForm().errors().length > 0 && employeeForm().touched()){
      <ul>
        @for(error of employeeForm().errors(); track $index) {
          <li><small class="error">{{ error.message }}</small></li>
        }
      </ul>
    }

    <button [disabled]="employeeForm().invalid()">Submit Form</button>
  </form>

  <pre>
    Value: {{ employeeForm().value() | json }}
    Valid: {{ employeeForm().valid() | json }}
  </pre>

  <div class="loading" [attr.aria-hidden]="!employeeForm().submitting()">
    <strong>Loading...</strong>
  </div>
  `,
  imports: [Control, JsonPipe, NestedUserControls, NestedAddressControls],
})
export class NestedEmployeeForm {
  readonly state = signal<EmployeeFormState>(this.createNewState());

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

  submitEmployee(e: SubmitEvent): void {
    if(this.employeeForm().invalid()) return;

    e.preventDefault();

    // Self submit via submit() fn to trigger the submitting() computed Signal
    submit(this.employeeForm, async (f) => {
      return this.submitNewEmployee(f);
    });
  }

  async submitNewEmployee(employeeForm: Field<EmployeeFormState, string | number>) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Arbitrary loading time

    employeeForm().reset();
    this.resetFormState(this.createNewState());
  }

  private resetFormState(newState: EmployeeFormState): void {
    this.state.set(newState);
  }

  private createNewState(): EmployeeFormState {
    return {
      employeeID: null,
      requireEmail: false,
      user: {
        firstName: '',
        lastName: '',
        email: ''
      }
    }
  }
}
