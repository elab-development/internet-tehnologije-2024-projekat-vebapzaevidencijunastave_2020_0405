<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;

class Termin extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'termin';

    protected $fillable = ['datum',
    'vreme_pocetka',
    'vreme_zavrsetka',
    'tip_nastave',
    'sala',
    'raspored_id',];

    public function raspored()
    {
        return $this->belongsTo(Raspored::class, 'raspored_id');
    }

    public function prisustva()
    {
        return $this->hasMany(Prisustvo::class, 'termin_id');
    }
}

