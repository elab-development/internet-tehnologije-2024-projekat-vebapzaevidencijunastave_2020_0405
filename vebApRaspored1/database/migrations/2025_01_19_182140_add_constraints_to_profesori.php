<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('profesori', function (Blueprint $table) {
            // Placeholder za postavljanje ograničenja na kolonu
            $table->string('kolona_koju_zelis')->nullable()->unique(); // Ograničenja se kasnije mogu menjati
        });
    }
    
    public function down()
    {
        Schema::table('profesori', function (Blueprint $table) {
            // Uklanjanje ograničenja
            $table->string('kolona_koju_zelis')->nullable()->change(); // Možeš kasnije menjati ograničenja
        });
    }
    
};
