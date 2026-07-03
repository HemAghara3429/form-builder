<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;

class FormController extends BaseController
{
    public function store(Request $request)
    {

        $data = $this->mapFields($request);

        $request->merge($data);

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

        $form = Form::create($data);

        return response()->json([
            'message' => 'Form saved successfully!',
            'data'    => $form,
        ], 201);
    }
    private function mapFields(Request $request): array
    {
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
