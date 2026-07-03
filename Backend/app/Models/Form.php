<?php

namespace App\Models;

//A Model is the bridge between your Laravel application and the database.
//model represent a table in database.
//easy to create, read, update, and delete records in the database using Eloquent ORM.

use Illuminate\Database\Eloquent\Model; //model import for the create the database structure

//Laravel automatically converts the model name to the table name using its naming convention.
//form class convert into forms table in the database using Eloquent ORM.
//Eloquent ORM is Laravel's built-in Object Relational Mapping (ORM) system.
//It allows you to interact with your database using PHP objects and models instead of writing raw SQL queries
class Form extends Model
{

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
    protected $casts = [
        'fields' => 'array',
    ];
}
