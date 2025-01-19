<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePredmetsTable extends Migration
{
    public function up()
    {
        Schema::create('predmeti', function (Blueprint $table) {
            $table->id('id_predmet');
            $table->string('naziv_predmeta');
            $table->integer('semestar');
            $table->integer('godina_studija');
            $table->unsignedBigInteger('id_profesor'); // Spoljni ključ
            $table->timestamps();

            // Definisanje spoljnih ključeva
            $table->foreign('id_profesor')->references('id_profesor')->on('profesori')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('predmeti');
    }
}
