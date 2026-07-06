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

        $submission = FormSubmission::create([
            'form_name'      => $request->input('form_name'),
            'submitted_data' => $request->input('submitted_data'),
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
