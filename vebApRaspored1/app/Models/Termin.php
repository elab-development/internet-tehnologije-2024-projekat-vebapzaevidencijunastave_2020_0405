<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Termin extends Model
{
    use HasFactory;

    // Relacija: Termin pripada jednom rasporedu
    public function raspored()
    {
        return $this->belongsTo(Raspored::class, 'id_raspored');
    }

    // Relacija: Termin ima više prisustava
    public function prisustva()
    {
        return $this->hasMany(Prisustvo::class, 'id_termin');
    }
}
