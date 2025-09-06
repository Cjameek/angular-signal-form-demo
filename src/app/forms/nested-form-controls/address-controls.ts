import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Control, Field, FieldState } from '@angular/forms/signals';
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
      <input id="street" type="text" [control]="field().street" />
      @if(field().street().errors().length > 0 && field().street().touched()){
        @for(error of field().street().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
    <fieldset>
      <label for="city">City <small>(Required)</small></label>
      <input id="city" type="text" [control]="field().city" />
      @if(field().city().errors().length > 0 && field().city().touched()){
        @for(error of field().city().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
    <fieldset>
      <label for="state">State <small>(Required)</small></label>
      <input id="state" type="text" [control]="field().state" />
      @if(field().state().errors().length > 0 && field().state().touched()){
        @for(error of field().state().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
    <fieldset>
      <label for="zip">Zip <small>(Required)</small></label>
      <input id="zip" type="text" [control]="field().zip" />
      @if(field().zip().errors().length > 0 && field().zip().touched()){
        @for(error of field().zip().errors(); track $index) {
          <small class="error">{{ error.message }}</small>
        }
      }
    </fieldset>
  </div>
  `,
  imports: [Control],
})
export class NestedAddressControls {
  readonly field = input.required<Field<Address, string>>();
}
