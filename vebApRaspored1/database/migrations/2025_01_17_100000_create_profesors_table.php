<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfesorsTable extends Migration
{
    public function up()
    {
        Schema::create('profesori', function (Blueprint $table) {
            $table->id('id_profesor'); // Primarni ključ
            $table->string('ime');
            $table->string('prezime');
            $table->string('email')->unique();
            $table->string('korisnicko_ime')->unique();
            $table->string('lozinka');
            $table->timestamps(); // Kreira created_at i updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('profesori');
    }
}
