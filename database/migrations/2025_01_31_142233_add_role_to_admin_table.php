<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up()
    {
        Schema::table('admin', function (Blueprint $table) {
            $table->string('role')->default('admin'); // Podrazumevano svaki admin ima 'admin' ulogu
        });
    }
    


    public function down()
    {
        Schema::table('admin', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
    
};
