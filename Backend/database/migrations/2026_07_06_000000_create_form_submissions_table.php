<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

//migration for the form_submissions table.
//this table stores user responses submitted from the preview page.
//each row represents one form submission with all field values stored as JSON.

return new class extends Migration
{
    //here create the form_submissions table inside the here create the 4 field.(id,form_name,submitted_data,created_at,updated_at).
    //create method use for the create the table.
    //down method use for the drop the table .
    public function up(): void
    {
        Schema::create('form_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('form_name');
            $table->json('submitted_data');
            $table->timestamps();
        });
    }
    //down method use for the drop the table.
    public function down(): void
    {
        Schema::dropIfExists('form_submissions');
    }
};
