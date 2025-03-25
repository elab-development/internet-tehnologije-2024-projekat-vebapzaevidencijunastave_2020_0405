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
        Schema::table('raspored', function (Blueprint $table) {
            // Dodajemo kolonu naziv
            $table->string('naziv')->after('id');
            
            // Uklanjamo strani ključ i predmet_id kolonu ako postoji
            if (Schema::hasColumn('raspored', 'predmet_id')) {
                $table->dropForeign(['predmet_id']);
                $table->dropColumn('predmet_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('raspored', function (Blueprint $table) {
            // Uklanjamo naziv kolonu
            $table->dropColumn('naziv');
            
            // Vraćamo predmet_id kolonu i strani ključ
            $table->unsignedBigInteger('predmet_id')->nullable();
            $table->foreign('predmet_id')->references('id')->on('predmet')->onDelete('set null');
        });
    }
};
