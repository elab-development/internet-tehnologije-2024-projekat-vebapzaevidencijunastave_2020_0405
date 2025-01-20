<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('prisustvo', function (Blueprint $table) {
            // Placeholder za dodavanje ograničenja
            $table->string('kolona_sa_ogranicenjem')->unique(); // Kasnije promeniti ime kolone i tip ograničenja
        });
    }
    
    public function down()
    {
        Schema::table('prisustvo', function (Blueprint $table) {
            // Uklanjanje ograničenja
            $table->dropUnique(['kolona_sa_ogranicenjem']); // Kasnije prilagoditi ime kolone
        });
    }
    
};
