<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveGodinaStudijaFromStudentTable extends Migration
{
    public function up()
    {
        Schema::table('student', function (Blueprint $table) {
            // Brisanje kolone godina_studija
            $table->dropColumn('godina_studija');
        });
    }

    public function down()
    {
        Schema::table('student', function (Blueprint $table) {
            // Ponovno dodavanje kolone godina_studija u slučaju rollback-a
            $table->integer('godina_studija')->nullable();
        });
    }
}
