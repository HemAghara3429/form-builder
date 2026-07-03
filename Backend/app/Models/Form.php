<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'form_name',
        'branch',
        'logo_url',
        'section',
        'responsible_user',
        'form_status',
        'submitted_button_name',
        'default_academic_year',
        'description',
        'success_message',
        'confirmation_message',
        'fields',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fields' => 'array',
    ];
}
