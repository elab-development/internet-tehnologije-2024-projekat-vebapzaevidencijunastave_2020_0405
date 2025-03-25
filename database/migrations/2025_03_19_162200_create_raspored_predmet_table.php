<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('raspored_predmet', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('raspored_id');
            $table->unsignedBigInteger('predmet_id');
            $table->string('dan_u_nedelji'); // 'Ponedeljak', 'Utorak', itd.
            $table->time('vreme_pocetka');
            $table->time('vreme_zavrsetka');
            $table->string('sala');
            $table->string('tip_nastave'); // 'Predavanje', 'Vežbe', itd.
            $table->timestamps();

            // Dodavanje stranih ključeva
            $table->foreign('raspored_id')->references('id')->on('raspored')->onDelete('cascade');
            $table->foreign('predmet_id')->references('id')->on('predmet')->onDelete('cascade');
            
            // Dodavanje indeksa za brži pristup
            $table->index(['raspored_id', 'predmet_id']);
            $table->index('dan_u_nedelji');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('raspored_predmet');
    }
};
