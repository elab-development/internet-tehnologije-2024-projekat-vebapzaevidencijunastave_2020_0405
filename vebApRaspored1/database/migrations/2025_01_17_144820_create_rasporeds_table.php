<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRasporedsTable extends Migration
{
    public function up()
    {
        Schema::create('rasporedi', function (Blueprint $table) {
            $table->id('id_raspored');
            $table->unsignedBigInteger('id_predmet'); // Spoljni ključ
            $table->integer('godina_studija');
            $table->integer('semestar');
            $table->timestamps();

            // Definisanje spoljnih ključeva
            $table->foreign('id_predmet')->references('id_predmet')->on('predmeti')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('rasporedi');
    }
}

