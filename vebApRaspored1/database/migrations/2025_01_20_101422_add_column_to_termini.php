<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('termini', function (Blueprint $table) {
            // Placeholder za dodavanje nove kolone
            $table->string('nova_kolona')->nullable(); // Kasnije promeniti ime kolone i tip
        });
    }
    
    public function down()
    {
        Schema::table('termini', function (Blueprint $table) {
            // Uklanjanje kolone
            $table->dropColumn('nova_kolona');
        });
    }
    
};
