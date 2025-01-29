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

    protected $fillable = ['naziv', 'semestar','godina_studija', 'profesor_id',];

    public function profesor()
    {
        return $this->belongsTo(Profesor::class, 'profesor_id');
    }

    public function rasporedi()
    {
        return $this->hasMany(Raspored::class, 'predmet_id');
    }
}

