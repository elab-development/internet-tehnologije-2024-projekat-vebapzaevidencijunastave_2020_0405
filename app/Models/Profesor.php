<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profesor extends Model
{
    use HasFactory;

    protected $table = 'profesor';

    protected $fillable = ['ime', 'prezime', 'email','korisnicko_ime',
        'lozinka',];

    public function predmeti()
    {
        return $this->hasMany(Predmet::class, 'profesor_id');
    }
}

