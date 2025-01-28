<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTerminTable extends Migration
{
    public function up()
    {
        Schema::create('termin', function (Blueprint $table) {
            $table->id(); // Primarni ključ
            $table->date('datum');
            $table->time('vreme_pocetka');
            $table->time('vreme_zavrsetka');
            $table->string('tip_nastave');
            $table->string('sala');
            $table->unsignedBigInteger('raspored_id'); // Spoljni ključ
            $table->foreign('raspored_id')->references('id')->on('raspored')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('termin');
    }
}
