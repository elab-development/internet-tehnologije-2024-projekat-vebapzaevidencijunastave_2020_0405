<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePredmetTable extends Migration
{
    public function up()
    {
        Schema::create('predmet', function (Blueprint $table) {
            $table->id(); // Primarni ključ
            $table->string('naziv');
            $table->integer('semestar');
            $table->integer('godina_studija');
            $table->unsignedBigInteger('profesor_id'); // Spoljni ključ
            $table->foreign('profesor_id')->references('id')->on('profesor')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('predmet');
    }
}
