<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrisustvosTable extends Migration
{
    public function up()
    {
        Schema::create('prisustvo', function (Blueprint $table) {
            $table->id('id_prisustvo');
            $table->unsignedBigInteger('id_student'); // Spoljni ključ
            $table->unsignedBigInteger('id_termin'); // Spoljni ključ
            $table->boolean('status_prisustva');
            $table->timestamps();

            // Definisanje spoljnih ključeva
            $table->foreign('id_student')->references('id_student')->on('studenti')->onDelete('cascade');
            $table->foreign('id_termin')->references('id_termin')->on('termini')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('prisustvo');
    }
}
