import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { form, Control, apply, submit, Field, hidden } from '@angular/forms/signals';
import { User, NestedUserControls } from './user-controls';
import { Address, NestedAddressControls } from './address-controls';
import { employeeFormSchema, userSchema, addressSchema } from './schema';

export interface EmployeeFormState {
  employeeID: string,
  requireEmail: boolean,
  user: User,
  address: Address,
}

@Component({
  selector: 'nested-employee-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <aside class="buttons">
    <button type="button" (click)="hideAddress.set(!hideAddress())">Toggle Address Fields</button>
    <button type="button" (click)="hideMiddleInitial.set(!hideMiddleInitial())">Toggle Middle Initial Field</button>
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
      <nested-user-controls [field]="employeeForm.user" />
  
      @if(!employeeForm.address().hidden()){
        <nested-address-controls [field]="employeeForm.address" />
      }
    </section>

    @if(employeeForm().errors().length > 0 && employeeForm().touched()){
      <ul>
        @for(error of employeeForm().errors(); track $index) {
          <li><small class="error" [class]="'kind-' + error.kind">{{ error.message }}</small></li>
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
  readonly hideAddress = model<boolean>(true);
  readonly hideMiddleInitial = model<boolean>(true);

  readonly employeeForm = form(this.state, (path) => {
    apply(path, employeeFormSchema),
    apply(path.user, userSchema),
    apply(path.address, addressSchema),
    hidden(path.address, () => {
      return this.hideAddress();
    }),
    hidden(path.user.middleInitial, () => {
      return this.hideMiddleInitial();
    })
  });

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
      employeeID: '',
      requireEmail: false,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        middleInitial: ''
      },
      address: {
        street: '',
        city: '',
        state: '',
        zip: ''
      }
    }
  }
}
