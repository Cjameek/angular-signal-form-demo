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
      <input id="firstName" type="text" [control]="parentForm().user.firstName" />
      @if(parentForm().user.firstName().errors().length > 0 && parentForm().user.firstName().touched()){
        @for(error of parentForm().user.firstName().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
    
    <fieldset>
      <label for="lastName">Last Name <small>(Required)</small></label>
      <input id="lastName" type="text" [control]="parentForm().user.lastName" />
      @if(parentForm().user.lastName().errors().length > 0 && parentForm().user.lastName().touched()){
        @for(error of parentForm().user.lastName().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>

    @if(parentForm().user.middleInitial){
      <fieldset>
        <label for="middleInitial">Middle Initial</label>
        <input id="middleInitial" type="text" [control]="parentForm().user.middleInitial" />
      </fieldset>
    }

    <fieldset>
      <label for="email">Email @if(emailRequired()){ <small>(Required)</small> }</label>
      <input id="email" type="email" [control]="parentForm().user.email" />
      @if(parentForm().user.email().errors().length > 0 && parentForm().user.email()){
        @for(error of parentForm().user.email().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
  </div>
  `,
  imports: [Control],
})
export class NestedUserControls {
  readonly parentForm = input.required<Field<EmployeeFormState, string | number>>();
  readonly emailRequired = computed(() => this.parentForm().user.email().errorSummary().some(error => error.kind == 'required'));
}
