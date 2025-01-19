<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('profesori', function (Blueprint $table) {
            $table->string('nova_kolona')->nullable(); // Možeš promeniti tip i ime kasnije
        });
    }
    
    public function down()
    {
        Schema::table('profesori', function (Blueprint $table) {
            $table->dropColumn('nova_kolona');
        });
    }
    
};
