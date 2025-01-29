<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;



class Profesor extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'profesor';

    protected $fillable = ['ime', 'prezime', 'email','korisnicko_ime',
        'lozinka',];

    public function predmeti()
    {
        return $this->hasMany(Predmet::class, 'profesor_id');
    }
}

