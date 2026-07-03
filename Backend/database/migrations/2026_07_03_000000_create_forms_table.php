<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;



//migration have to method up and down.
//when this file execute the up method will run and create forms table in the database. (php artisan migrate) ===>command
//down method is used to rollback and reverse the changes (php artisan migrate:rollback) ===>command

return new class extends Migration
{
    public function up(): void
    {
         //forms table create in database with the following columns..
         //$table is object of buleprint class which is used to define the structure of the table.
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            $table->string('form_name');
            $table->string('branch');
            $table->string('logo_url')->nullable();
            $table->string('section');
            $table->string('responsible_user');
            $table->string('form_status')->default('unpublished');
            $table->string('submitted_button_name')->default('submit');
            $table->string('default_academic_year');
            $table->text('description')->nullable();
            $table->text('success_message');
            $table->text('confirmation_message');
            $table->json('fields')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forms');
    }
};
