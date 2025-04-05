<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Raspored extends Model
{
    use HasFactory;

    protected $table = 'rasporedi';

    protected $fillable = [
        'naziv',
        'godina_studija',
        'semestar',
        'skolska_godina',
        'aktivan'
    ];

    protected $casts = [
        'aktivan' => 'boolean'
    ];

    public function predmeti()
    {
        return $this->belongsToMany(Predmet::class, 'raspored_predmet')
            ->withPivot(['dan_u_nedelji', 'vreme_pocetka', 'vreme_zavrsetka', 'sala', 'tip_nastave']);
    }
} 