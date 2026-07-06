<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class FormController extends BaseController
{
    //submit form data from the preview page.
    //this method receives user-entered values and saves them to the form_submissions table.
    public function submitForm(Request $request)
    {
        $request->validate([
            'form_name'      => 'required|string|max:255',
            'submitted_data' => 'required|array',
        ]);

        $formName = $request->input('form_name');
        $submittedData = $request->input('submitted_data');

        // Look up the form definition by form name
        $form = Form::where('form_name', $formName)->latest()->first();

        if ($form) {
            $fields = $form->fields; // This is casted to array in Form.php
            
            if (is_array($fields)) {
                $errors = [];
                
                foreach ($fields as $field) {
                    $fieldId = $field['id'] ?? '';
                    $label = $field['label'] ?? '';
                    $type = $field['type'] ?? '';
                    $required = $field['required'] ?? false;
                    $placeholder = $field['placeholder'] ?? '';
                    
                    // Match key in submitted_data
                    // In preview panel: const key = field.label?.trim() || field.placeholder?.trim() || field.id;
                    $key = trim($label);
                    if (empty($key) && !empty($placeholder)) {
                        $key = trim($placeholder);
                    }
                    if (empty($key)) {
                        $key = $fieldId;
                    }

                    $value = isset($submittedData[$key]) ? $submittedData[$key] : null;

                    // Required check
                    if ($required) {
                        $isEmpty = false;
                        if ($value === null || $value === '') {
                            $isEmpty = true;
                        } else if (is_array($value) && empty($value)) {
                            $isEmpty = true;
                        } else if ($value === false || $value === 'false') {
                            $isEmpty = true;
                        }
                        
                        if ($isEmpty) {
                            $errors[$key] = "The field '{$key}' is required.";
                            continue;
                        }
                    }

                    // Perform validations if value is present and not empty
                    if ($value !== null && $value !== '' && $value !== false && !(is_array($value) && empty($value))) {
                        $rules = isset($field['validationRules']) ? $field['validationRules'] : null;
                        
                        if (is_array($rules)) {
                            // 1. Text Field Validations (single_line or paragraph)
                            if ($type === 'single_line' || $type === 'paragraph') {
                                $strVal = (string)$value;
                                
                                if (isset($rules['minLength']) && strlen($strVal) < (int)$rules['minLength']) {
                                    $errors[$key] = "The field '{$key}' must be at least {$rules['minLength']} characters.";
                                }
                                if (isset($rules['maxLength']) && strlen($strVal) > (int)$rules['maxLength']) {
                                    $errors[$key] = "The field '{$key}' must not exceed {$rules['maxLength']} characters.";
                                }
                                
                                if (isset($rules['patternType']) && $rules['patternType'] !== 'none') {
                                    $patternType = $rules['patternType'];
                                    if ($patternType === 'email' && !filter_var($strVal, FILTER_VALIDATE_EMAIL)) {
                                        $errors[$key] = "The field '{$key}' must be a valid email address.";
                                    } elseif ($patternType === 'url' && !filter_var($strVal, FILTER_VALIDATE_URL)) {
                                        $errors[$key] = "The field '{$key}' must be a valid URL.";
                                    } elseif ($patternType === 'phone' && !preg_match('/^\+?[0-9\s\-()]{7,15}$/', $strVal)) {
                                        $errors[$key] = "The field '{$key}' must be a valid phone number.";
                                    } elseif ($patternType === 'custom' && !empty($rules['customRegex'])) {
                                        $pattern = $rules['customRegex'];
                                        // Auto wrap delimiter if not present
                                        if (substr($pattern, 0, 1) !== '/' || substr($pattern, -1) !== '/') {
                                            $pattern = '/' . str_replace('/', '\/', $pattern) . '/';
                                        }
                                        if (@preg_match($pattern, $strVal) === 0) {
                                            $errors[$key] = !empty($rules['customErrorMessage']) 
                                                ? $rules['customErrorMessage'] 
                                                : "The field '{$key}' format is invalid.";
                                        }
                                    }
                                }
                            }
                            
                            // 2. File Upload Validations
                            if ($type === 'upload_file') {
                                $fileName = is_string($value) ? $value : (isset($value['name']) ? $value['name'] : '');
                                if (!empty($fileName)) {
                                    if (isset($rules['allowedExtensions']) && !empty($rules['allowedExtensions'])) {
                                        $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                                        $allowed = array_map('trim', array_map('strtolower', explode(',', $rules['allowedExtensions'])));
                                        if (!in_array($ext, $allowed)) {
                                            $errors[$key] = "Allowed extensions for '{$key}' are: " . implode(', ', $allowed);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (!empty($errors)) {
                    return response()->json([
                        'message' => 'Validation failed',
                        'errors'  => $errors,
                    ], 422);
                }
            }
        }

        $submission = FormSubmission::create([
            'form_name'      => $formName,
            'submitted_data' => $submittedData,
        ]);

        return response()->json([
            'message' => 'Form submitted successfully!',
            'data'    => $submission,
        ], 201);
    }

    public function store(Request $request)
    {

        $data = $this->mapFields($request);

        $request->merge($data);

        //laravel validation code .
        //all filed are must be require also here define the datatype and max length of the field.
        //$request contains all data sent by the client.
        $request->validate([
            'form_name'             => 'required|string|max:255',
            'branch'                => 'required|string|max:255',
            'logo_url'              => 'nullable|string|max:500',
            'section'               => 'required|string|max:255',
            'responsible_user'      => 'required|string|max:255',
            'form_status'           => 'required|in:unpublished,published',
            'submitted_button_name' => 'required|string|max:255',
            'default_academic_year' => 'required|string|max:255',
            'description'           => 'nullable|string',
            'success_message'       => 'required|string',
            'confirmation_message'  => 'required|string',
            'fields'                => 'nullable|array',
        ]);

        //new record insert into the database .(create method is used to create a new record in the database using the Form model.)
        //get the all record.(get method is used to retrieve all records from the database using the Form model.)
        //find a record by id.(find method is used to retrieve a specific record from the database using the Form model and the provided ID.)
        //findorfail a record by id.(findOrFail method is used to retrieve a specific record from the database using the Form model and the provided ID. If the record is not found, it will throw a ModelNotFoundException.)
        //first method is used to retrieve the first record from the database using the Form model
        //where method is used to filter records based on a specific condition using the Form model.
        //save method is used to save the data into the database using the Form model.
        //update method is used to update the existing record in the database using the Form model.
        //delete method is used to delete the existing record from the database using the Form model.
        $form = Form::create($data);

        //send the response in message and data in json format with 201 status code.
        return response()->json([
            'message' => 'Form saved successfully!',
            'data'    => $form,
        ], 201);
    }
    private function mapFields(Request $request): array
    {


    //left side:
      //form_name:database column name

    //right side:
        //formName:camel case name from the request payload angular send
        //form_name:snake case name from the request payload

        $map = [
            'form_name'             => ['formName',            'form_name'],
            'branch'                => ['branch',              'branch'],
            'logo_url'              => ['logoUrl',             'logo_url'],
            'section'               => ['section',             'section'],
            'responsible_user'      => ['responsibleUser',     'responsible_user'],
            'form_status'           => ['formStatus',          'form_status'],
            'submitted_button_name' => ['submittedButtonName', 'submitted_button_name'],
            'default_academic_year' => ['defaultAcademicYear', 'default_academic_year'],
            'description'           => ['description',         'description'],
            'success_message'       => ['successMessage',      'success_message'],
            'confirmation_message'  => ['confirmationMessage', 'confirmation_message'],
            'fields'                => ['fields',              'fields'],
        ];

        $data = [];

        foreach ($map as $dbKey => [$camel, $snake]) {
            if ($request->has($camel)) {
                $data[$dbKey] = $request->input($camel);
            } elseif ($request->has($snake)) {
                $data[$dbKey] = $request->input($snake);
            }
        }

        return $data;
    }
}
