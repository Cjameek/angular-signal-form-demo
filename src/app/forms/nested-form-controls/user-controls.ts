import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Control, Field } from '@angular/forms/signals';
import { EmployeeFormState } from './employee-form';

export interface User {
  firstName: string,
  lastName: string,
  middleInitial?: string,
  email: string
}

@Component({
  selector: 'nested-user-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div>
    <p><strong>User Information</strong></p>

    <fieldset>
      <label for="firstName">First Name <small>(Required)</small></label>
      <input id="firstName" type="text" [control]="form().user.firstName" />
      @if(form().user.firstName().errors().length > 0 && form().user.firstName().touched()){
        @for(error of form().user.firstName().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
    
    <fieldset>
      <label for="lastName">Last Name <small>(Required)</small></label>
      <input id="lastName" type="text" [control]="form().user.lastName" />
      @if(form().user.lastName().errors().length > 0 && form().user.lastName().touched()){
        @for(error of form().user.lastName().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>

    @if(form().user.middleInitial){
      <fieldset>
        <label for="middleInitial">Middle Initial</label>
        <input id="middleInitial" type="text" [control]="form().user.middleInitial" />
      </fieldset>
    }

    <fieldset>
      <label for="email">Email @if(emailRequired()){ <small>(Required)</small> }</label>
      <input id="email" type="email" [control]="form().user.email" />
      @if(form().user.email().errors().length > 0 && form().user.email()){
        @for(error of form().user.email().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
  </div>
  `,
  imports: [Control],
})
export class NestedUserControls {
  readonly form = input.required<Field<EmployeeFormState, string | number>>();
  readonly emailRequired = computed(() => this.form().user.email().errorSummary().some(error => error.kind == 'required'));
}
