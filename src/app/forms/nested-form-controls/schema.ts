import { schema, required, pattern, maxLength, email, validate, customError } from "@angular/forms/signals";
import { Address } from "./address-controls";
import { EmployeeFormState } from "./employee-form";
import { User } from "./user-controls";

/**
 * This schema is to be used for the entire employee form
 */
export const employeeFormSchema = schema<EmployeeFormState>((path) => {
  required(path.employeeID, { message: 'Employee ID is required'}),
  pattern(path.employeeID, /^[0-9]*$/, { message: 'Non-numeric characters not allowed.' }),
  maxLength(path.employeeID, 10, { message: "Only 10 characters allowed." }),
  required(path.user.email, { when: ({ valueOf }) => valueOf(path.requireEmail), message: 'Email is required' }),
  validate(path, ({ value }) => 
    value().user.firstName.toUpperCase() == value().user.lastName.toUpperCase() ? [customError({ kind: 'disallowed', message: 'Last name and first name cannot match' })] : []
  )
});

/**
 * This schema is only applied to the 'user' obj property and its children props / controls 
 */
export const userSchema = schema<User>((path) => {
  required(path.firstName, { message: 'First name is required' }),
  maxLength(path.firstName, 150)
  required(path.lastName, { message: 'Last name is required' }),
  maxLength(path.lastName, 150)
  email(path.email, { message: 'Must be valid email format'})
});

/**
 * This schema is only applied to the 'address' obj property and its children props / controls 
 */
export const addressSchema = schema<Address>((path) => {
  required(path.street, { message: "Street is required" }),
  required(path.city, { message: 'City is required' }),
  required(path.state, { message: 'State is required' }),
  required(path.zip, { message: 'Zip is required' }),
  pattern(path.zip, /^[0-9]*$/, { message: 'Only numbers allowed' }),
  maxLength(path.zip, 5, { message: 'Zip cannot be longer than 5 digits'})
});