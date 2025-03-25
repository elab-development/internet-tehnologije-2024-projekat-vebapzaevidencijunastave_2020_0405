<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('raspored_predmet', function (Blueprint $table) {
            // Prvo kreiramo nove kolone
            $table->string('novo_vreme_pocetka', 5)->nullable();
            $table->string('novo_vreme_zavrsetka', 5)->nullable();
        });

        // Kopiramo podatke iz starih kolona u nove, formatirajući vreme
        DB::statement("UPDATE raspored_predmet SET 
            novo_vreme_pocetka = DATE_FORMAT(vreme_pocetka, '%H:%i'),
            novo_vreme_zavrsetka = DATE_FORMAT(vreme_zavrsetka, '%H:%i')");

        Schema::table('raspored_predmet', function (Blueprint $table) {
            // Brišemo stare kolone
            $table->dropColumn(['vreme_pocetka', 'vreme_zavrsetka']);
            
            // Preimenujemo nove kolone koristeći change
            $table->string('vreme_pocetka', 5)->nullable()->change();
            $table->string('vreme_zavrsetka', 5)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('raspored_predmet', function (Blueprint $table) {
            // Prvo kreiramo nove kolone time tipa
            $table->time('novo_vreme_pocetka')->nullable();
            $table->time('novo_vreme_zavrsetka')->nullable();
        });

        // Kopiramo podatke iz string kolona u time kolone
        DB::statement("UPDATE raspored_predmet SET 
            novo_vreme_pocetka = STR_TO_DATE(vreme_pocetka, '%H:%i'),
            novo_vreme_zavrsetka = STR_TO_DATE(vreme_zavrsetka, '%H:%i')");

        Schema::table('raspored_predmet', function (Blueprint $table) {
            // Brišemo stare kolone
            $table->dropColumn(['vreme_pocetka', 'vreme_zavrsetka']);
            
            // Preimenujemo nove kolone koristeći change
            $table->time('vreme_pocetka')->nullable()->change();
            $table->time('vreme_zavrsetka')->nullable()->change();
        });
    }
};
