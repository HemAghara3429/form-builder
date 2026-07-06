<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

//FormSubmission model represents the form_submissions table in the database.
//It stores user responses submitted from the preview page.
//submitted_data is cast to array so Laravel auto-handles JSON encode/decode.

class FormSubmission extends Model
{
    protected $fillable = [
        'form_name',
        'submitted_data',
    ];

    protected $casts = [
        'submitted_data' => 'array',
    ];
}
