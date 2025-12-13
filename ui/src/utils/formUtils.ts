/**
 * Form Validation Utilities
 * 
 * Common form validation rules used across multiple components.
 * Centralized location for maintaining all form validation rules.
 */

import type { Rule } from "antd/es/form";

/**
 * Basic text field validation rules
 * Requires field to be filled
 */
export const textFieldRules: Rule[] = [
  { required: true, message: "This field is required" },
];

/**
 * Text field validation rules with minimum length requirement
 * Requires field to be filled and have minimum 3 characters
 */
export const textFieldRulesWithMinLength: Rule[] = [
  { required: true, message: "This field is required" },
  { min: 3, message: "Minimum 3 characters required" },
];

/**
 * Number field validation rules
 * Requires field to be filled
 */
export const numberFieldRules: Rule[] = [
  { required: true, message: "This field is required" },
];

/**
 * Select field validation rules
 * Requires an option to be selected
 */
export const selectFieldRules: Rule[] = [
  { required: true, message: "Please select an option" },
];

/**
 * Date field validation rules
 * Requires a date to be selected
 */
export const dateFieldRules: Rule[] = [
  { required: true, message: "Please select a date" },
];
