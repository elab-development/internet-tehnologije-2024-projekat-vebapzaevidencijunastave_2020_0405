<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('termini', function (Blueprint $table) {
        // Placeholder za izmenu postojeće kolone
        $table->string('kolona_koju_menjamo')->change(); // Kasnije promeniti ime kolone i tip
    });
}

public function down()
{
    Schema::table('termini', function (Blueprint $table) {
        // Vraćanje na prethodni tip
        $table->string('kolona_koju_menjamo')->nullable()->change(); // Kasnije prilagoditi
    });
}

};
