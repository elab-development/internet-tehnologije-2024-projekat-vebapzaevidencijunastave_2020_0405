<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTerminsTable extends Migration
{
    public function up()
    {
        Schema::create('termini', function (Blueprint $table) {
            $table->id('id_termin');
            $table->date('datum');
            $table->time('vreme_pocetka');
            $table->time('vreme_zavrsetka');
            $table->string('tip_nastave');
            $table->string('sala');
            $table->unsignedBigInteger('id_raspored'); // Spoljni ključ
            $table->timestamps();

            // Definisanje spoljnih ključeva
            $table->foreign('id_raspored')->references('id_raspored')->on('rasporedi')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('termini');
    }
}
