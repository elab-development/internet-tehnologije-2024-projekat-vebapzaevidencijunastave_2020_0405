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
            // Dodavanje novih polja
            $table->string('naziv')->after('id')->nullable();
            $table->string('skolska_godina')->after('semestar')->nullable();
            $table->boolean('aktivan')->after('skolska_godina')->default(false);
            
            // Uklanjanje stranog ključa
            $table->dropForeign(['predmet_id']);
            
            // Uklanjanje kolone
            $table->dropColumn('predmet_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('raspored', function (Blueprint $table) {
            // Vraćanje kolone
            $table->unsignedBigInteger('predmet_id')->after('id')->nullable();
            
            // Vraćanje stranog ključa
            $table->foreign('predmet_id')->references('id')->on('predmet')->onDelete('cascade');
            
            // Uklanjanje dodatih polja
            $table->dropColumn(['naziv', 'skolska_godina', 'aktivan']);
        });
    }
};
