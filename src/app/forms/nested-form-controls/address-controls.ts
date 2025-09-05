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
      <label for="street">Street</label>
      <input id="street" type="text" [control]="parentForm().address.street" />
      @if(parentForm().address.street().errors() && parentForm().address.street()){
        @for(error of parentForm().address.street().errors(); track $index) {
          <small>{{ error.message }}</small>
        }
      }
    </fieldset>
    <fieldset>
      <label for="city">City</label>
      <input id="city" type="text" [control]="parentForm().address.city" />
    </fieldset>
    <fieldset>
      <label for="state">State</label>
      <input id="state" type="text" [control]="parentForm().address.state" />
    </fieldset>
    <fieldset>
      <label for="zip">Zip</label>
      <input id="zip" type="text" [control]="parentForm().address.zip" />
    </fieldset>
  </div>
  `,
  imports: [Control],
})
export class NestedAddressControls {
  readonly parentForm = input.required<Field<EmployeeFormState, string | number>>();
}
