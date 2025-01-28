<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Raspored extends Model
{
    use HasFactory;

    protected $table = 'raspored';

    protected $fillable = ['predmet_id',
    'godina_studija',
    'semestar',];

    public function predmet()
    {
        return $this->belongsTo(Predmet::class, 'predmet_id');
    }

    public function termini()
    {
        return $this->hasMany(Termin::class, 'raspored_id');
    }
}

