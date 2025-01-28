<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToStudentTable extends Migration
{
    public function up()
    {
        Schema::table('student', function (Blueprint $table) {
            // dodavanje nove kolone
            $table->date('datum_rodjenja')->nullable()->after('godina_studija');
        });
    }

    public function down()
    {
        Schema::table('student', function (Blueprint $table) {
            // Uklanjanje kolona pri rollback-u
            $table->dropColumn('datum_rodjenja');
        });
    }
}

