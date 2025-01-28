<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyVremeColumnsInTerminTable extends Migration
{
    public function up()
    {
        Schema::table('termin', function (Blueprint $table) {
            // Postavljanje kolona vreme_pocetka i vreme_zavrsetka kao nullable
            $table->time('vreme_pocetka')->nullable()->change();
            $table->time('vreme_zavrsetka')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('termin', function (Blueprint $table) {
            // Vraćanje nullable na NOT NULL
            $table->time('vreme_pocetka')->nullable(false)->change();
            $table->time('vreme_zavrsetka')->nullable(false)->change();
        });
    }
}
