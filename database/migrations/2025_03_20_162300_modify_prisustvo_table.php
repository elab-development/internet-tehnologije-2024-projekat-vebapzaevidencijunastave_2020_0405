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
        // Prvo dropujemo strane ključeve
        Schema::table('prisustvo', function (Blueprint $table) {
            $table->dropForeign(['termin_id']);
            $table->dropColumn('termin_id');
        });
        
        // Dodajemo nove kolone
        Schema::table('prisustvo', function (Blueprint $table) {
            $table->unsignedBigInteger('raspored_predmet_id')->after('student_id');
            $table->date('datum_evidencije')->after('raspored_predmet_id');
            $table->foreign('raspored_predmet_id')->references('id')->on('raspored_predmet')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prisustvo', function (Blueprint $table) {
            $table->dropForeign(['raspored_predmet_id']);
            $table->dropColumn(['raspored_predmet_id', 'datum_evidencije']);
            $table->unsignedBigInteger('termin_id')->after('student_id');
            $table->foreign('termin_id')->references('id')->on('termin')->onDelete('cascade');
        });
    }
}; 