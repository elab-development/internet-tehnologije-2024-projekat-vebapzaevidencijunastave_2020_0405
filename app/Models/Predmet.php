<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;

class Predmet extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'predmet';

    protected $fillable = ['naziv', 'semestar', 'godina_studija', 'profesor_id'];

    public function profesor()
    {
        return $this->belongsTo(Profesor::class, 'profesor_id');
    }

    // Many-to-many veza sa rasporedima
    public function rasporedi()
    {
        return $this->belongsToMany(Raspored::class, 'raspored_predmet')
                   ->withPivot('dan_u_nedelji', 'vreme_pocetka', 'vreme_zavrsetka', 'sala', 'tip_nastave')
                   ->withTimestamps();
    }
}

