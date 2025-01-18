<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentsTable extends Migration
{
    public function up()
    {
        Schema::create('studenti', function (Blueprint $table) {
            $table->id('id_student');
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
        Schema::dropIfExists('studenti');
    }
}
