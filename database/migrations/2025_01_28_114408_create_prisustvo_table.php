<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrisustvoTable extends Migration
{
    public function up()
    {
        Schema::create('prisustvo', function (Blueprint $table) {
            $table->id(); // Primarni ključ
            $table->unsignedBigInteger('student_id'); // Spoljni ključ
            $table->unsignedBigInteger('termin_id'); // Spoljni ključ
            $table->boolean('status_prisustva')->default(true);
            $table->foreign('student_id')->references('id')->on('student')->onDelete('cascade');
            $table->foreign('termin_id')->references('id')->on('termin')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('prisustvo');
    }
}
