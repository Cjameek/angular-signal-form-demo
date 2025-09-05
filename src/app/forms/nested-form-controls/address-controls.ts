import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Control, Field } from '@angular/forms/signals';
import { EmployeeFormState } from './employee-form';

export interface Address {
  street: string,
  street2?: string,
  city: string,
  state: string,
  zip: string
}

@Component({
  selector: 'nested-address-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div>
    <p><strong>Address Information</strong></p>
    <fieldset>
      <label for="street">Street <small>(Required)</small></label>
      <input id="street" type="text" [control]="parentForm().address.street" />
      @if(parentForm().address.street().errors().length > 0 && parentForm().address.street().touched()){
        @for(error of parentForm().address.street().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
    <fieldset>
      <label for="city">City <small>(Required)</small></label>
      <input id="city" type="text" [control]="parentForm().address.city" />
      @if(parentForm().address.city().errors().length > 0 && parentForm().address.city().touched()){
        @for(error of parentForm().address.city().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
    <fieldset>
      <label for="state">State <small>(Required)</small></label>
      <input id="state" type="text" [control]="parentForm().address.state" />
      @if(parentForm().address.state().errors().length > 0 && parentForm().address.state().touched()){
        @for(error of parentForm().address.state().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
    <fieldset>
      <label for="zip">Zip <small>(Required)</small></label>
      <input id="zip" type="text" [control]="parentForm().address.zip" />
      @if(parentForm().address.zip().errors().length > 0 && parentForm().address.zip().touched()){
        @for(error of parentForm().address.zip().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
  </div>
  `,
  imports: [Control],
})
export class NestedAddressControls {
  readonly parentForm = input.required<Field<EmployeeFormState, string | number>>();
}
