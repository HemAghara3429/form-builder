<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
