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
            // Prvo uklanjamo strani ključ
            $table->dropForeign(['predmet_id']);
            // Zatim uklanjamo kolonu
            $table->dropColumn('predmet_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('raspored', function (Blueprint $table) {
            // Vraćamo kolonu i strani ključ
            $table->unsignedBigInteger('predmet_id')->nullable();
            $table->foreign('predmet_id')->references('id')->on('predmet')->onDelete('set null');
        });
    }
};
