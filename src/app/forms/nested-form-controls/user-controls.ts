import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Control, Field } from '@angular/forms/signals';
import { EmployeeFormState } from './employee-form';

export interface User {
  firstName: string,
  lastName: string,
  middleInitial: string,
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
      <input id="firstName" type="text" [control]="field().firstName" />
      @if(field().firstName().errors().length > 0 && field().firstName().touched()){
        @for(error of field().firstName().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
    
    <fieldset>
      <label for="lastName">Last Name <small>(Required)</small></label>
      <input id="lastName" type="text" [control]="field().lastName" />
      @if(field().lastName().errors().length > 0 && field().lastName().touched()){
        @for(error of field().lastName().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>

    @if(!field().middleInitial().hidden()){
      <fieldset>
        <label for="middleInitial">Middle Initial</label>
        <input id="middleInitial" type="text" [control]="field().middleInitial" />
      </fieldset>
    }

    <fieldset>
      <label for="email">Email @if(emailRequired()){ <small>(Required)</small> }</label>
      <input id="email" type="email" [control]="field().email" />
      @if(field().email().errors().length > 0 && field().email()){
        @for(error of field().email().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
  </div>
  `,
  imports: [Control],
})
export class NestedUserControls {
  readonly field = input.required<Field<User, string | number>>();
  readonly emailRequired = computed(() => this.field().email().errorSummary().some(error => error.kind == 'required'));
}
