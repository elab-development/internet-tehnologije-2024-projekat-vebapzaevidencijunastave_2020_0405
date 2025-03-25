<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;

class Raspored extends Authenticatable
{
    use HasApiTokens, HasFactory;
    
    protected $table = 'raspored';

    protected $fillable = [
        'naziv',
        'godina_studija',
        'semestar',
        'skolska_godina',
        'aktivan'
    ];

    /**
     * Many-to-many veza sa predmetima.
     * Ovo je preporučena veza za pristupanje terminima nastave.
     * Sadrži sve potrebne informacije o predmetu, danu, vremenu, sali i tipu nastave.
     */
    public function predmeti()
    {
        return $this->belongsToMany(Predmet::class, 'raspored_predmet')
                   ->withPivot('dan_u_nedelji', 'vreme_pocetka', 'vreme_zavrsetka', 'sala', 'tip_nastave')
                   ->withTimestamps();
    }

    /**
     * @deprecated Koristiti predmeti() metodu umesto ove.
     * Stara veza sa termin tabelom koja je sada zamenjena sa pivot tabelom raspored_predmet.
     */
    public function termini()
    {
        return $this->hasMany(Termin::class, 'raspored_id');
    }
}

