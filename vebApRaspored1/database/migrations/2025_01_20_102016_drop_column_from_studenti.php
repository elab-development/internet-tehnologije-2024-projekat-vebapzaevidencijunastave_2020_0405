<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('studenti', function (Blueprint $table) {
            // Placeholder za brisanje kolone
            $table->dropColumn('kolona_za_brisanje'); // Kasnije promeniti ime kolone
        });
    }
    
    public function down()
    {
        Schema::table('studenti', function (Blueprint $table) {
            // Ponovno dodavanje kolone (ako je potrebno)
            $table->string('kolona_za_brisanje')->nullable(); // Kasnije prilagoditi tip
        });
    }
    
};
