<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('rasporedi', function (Blueprint $table) {
            $table->id();
            $table->string('naziv');
            $table->integer('godina_studija');
            $table->integer('semestar');
            $table->string('skolska_godina');
            $table->boolean('aktivan')->default(false);
            $table->timestamps();
        });

        Schema::create('raspored_predmet', function (Blueprint $table) {
            $table->id();
            $table->foreignId('raspored_id')->constrained()->onDelete('cascade');
            $table->foreignId('predmet_id')->constrained()->onDelete('cascade');
            $table->enum('dan_u_nedelji', ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak']);
            $table->time('vreme_pocetka');
            $table->time('vreme_zavrsetka');
            $table->string('sala');
            $table->enum('tip_nastave', ['Predavanja', 'Vežbe']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('raspored_predmet');
        Schema::dropIfExists('rasporedi');
    }
}; 