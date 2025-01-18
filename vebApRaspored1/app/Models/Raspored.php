<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Raspored extends Model
{
    use HasFactory;

    // Relacija: Raspored pripada jednom predmetu
    public function predmet()
    {
        return $this->belongsTo(Predmet::class, 'id_predmet');
    }

    // Relacija: Raspored ima više termina
    public function termini()
    {
        return $this->hasMany(Termin::class, 'id_raspored');
    }
}
