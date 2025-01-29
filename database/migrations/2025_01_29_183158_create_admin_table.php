<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
 
return new class extends Migration {
    public function up()
    {
        Schema::create('admin', function (Blueprint $table) { 
            $table->id();
            $table->string('ime');
            $table->string('prezime');
            $table->string('email')->unique();
            $table->string('korisnicko_ime')->unique();
            $table->string('lozinka');
            $table->timestamps();
        });
    }
 
    public function down()
    {
        Schema::dropIfExists('admin'); 
    }
};
