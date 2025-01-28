<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUniqueConstraintToNazivInPredmetTable extends Migration
{
    public function up()
    {
        Schema::table('predmet', function (Blueprint $table) {
            // Dodavanje UNIQUE ograničenja na kolonu naziv
            $table->unique('naziv');
        });
    }

    public function down()
    {
        Schema::table('predmet', function (Blueprint $table) {
            // Uklanjanje UNIQUE ograničenja sa kolone naziv
            $table->dropUnique(['naziv']);
        });
    }
}
