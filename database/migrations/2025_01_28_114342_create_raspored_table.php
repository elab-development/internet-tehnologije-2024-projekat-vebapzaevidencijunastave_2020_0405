<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRasporedTable extends Migration
{
    public function up()
    {
        Schema::create('raspored', function (Blueprint $table) {
            $table->id(); // Primarni ključ
            $table->unsignedBigInteger('predmet_id'); // Spoljni ključ
            $table->integer('godina_studija');
            $table->integer('semestar');
            $table->foreign('predmet_id')->references('id')->on('predmet')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('raspored');
    }
}
