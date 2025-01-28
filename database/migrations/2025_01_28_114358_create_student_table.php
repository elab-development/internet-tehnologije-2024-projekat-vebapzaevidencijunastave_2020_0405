<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentTable extends Migration
{
    public function up()
    {
        Schema::create('student', function (Blueprint $table) {
            $table->id(); // Primarni ključ
            $table->string('ime');
            $table->string('prezime');
            $table->string('broj_indeksa')->unique();
            $table->string('email')->unique();
            $table->integer('godina_studija');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('student');
    }
}
