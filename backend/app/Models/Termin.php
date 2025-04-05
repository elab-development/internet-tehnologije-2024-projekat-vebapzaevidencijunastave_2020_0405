<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Termin extends Model
{
    use HasFactory;

    protected $table = 'termini';

    protected $fillable = [
        'predmet_id',
        'datum',
        'vreme_pocetka',
        'vreme_zavrsetka',
        'sala',
        'tip_nastave'
    ];

    public function predmet()
    {
        return $this->belongsTo(Predmet::class);
    }
} 