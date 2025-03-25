<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('raspored', function (Blueprint $table) {
            $table->string('skolska_godina')->after('semestar');
            $table->boolean('aktivan')->default(false)->after('skolska_godina');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('raspored', function (Blueprint $table) {
            $table->dropColumn(['skolska_godina', 'aktivan']);
        });
    }
};
