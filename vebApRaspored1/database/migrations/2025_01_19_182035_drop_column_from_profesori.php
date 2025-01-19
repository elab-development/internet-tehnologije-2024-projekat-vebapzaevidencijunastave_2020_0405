<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('profesori', function (Blueprint $table) {
            $table->dropColumn('kolona_koju_brisemo'); // Kolonu možeš kasnije definisati
        });
    }
    
    public function down()
    {
        Schema::table('profesori', function (Blueprint $table) {
            $table->string('kolona_koju_brisemo')->nullable(); // Vraćaš obrisanu kolonu
        });
    }
    
};
