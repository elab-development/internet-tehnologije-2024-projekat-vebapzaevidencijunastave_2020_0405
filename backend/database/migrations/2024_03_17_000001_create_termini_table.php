<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('termini', function (Blueprint $table) {
            $table->id();
            $table->foreignId('predmet_id')->constrained('predmeti')->onDelete('cascade');
            $table->date('datum');
            $table->time('vreme_pocetka');
            $table->time('vreme_zavrsetka');
            $table->string('sala');
            $table->enum('tip_nastave', ['Predavanja', 'Vežbe']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('termini');
    }
}; 