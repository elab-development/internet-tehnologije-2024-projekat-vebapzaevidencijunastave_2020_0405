<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Predmet extends Model
{
    use HasFactory;

    // Relacija: Predmet pripada jednom profesoru
    public function profesor()
    {
        return $this->belongsTo(Profesor::class, 'id_profesor');
    }

    // Relacija: Predmet ima više rasporeda
    public function rasporedi()
    {
        return $this->hasMany(Raspored::class, 'id_predmet');
    }
}

