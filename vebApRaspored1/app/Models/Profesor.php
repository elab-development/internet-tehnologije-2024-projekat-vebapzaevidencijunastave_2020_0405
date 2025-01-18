<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profesor extends Model
{
    use HasFactory;

    // Relacija: Profesor ima više predmeta
    public function predmeti()
    {
        return $this->hasMany(Predmet::class, 'id_profesor');
    }
}
