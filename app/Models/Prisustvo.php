<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;

class Prisustvo extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'prisustvo';

    protected $fillable = [
        'student_id', 
        'raspored_predmet_id',
        'datum_evidencije',
        'status_prisustva'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    /**
     * @deprecated Koristiti rasporedPredmet() vezu umesto ove.
     */
    public function termin()
    {
        return $this->belongsTo(Termin::class, 'termin_id');
    }
    
    /**
     * Veza sa raspored_predmet tabelom koja sadrži podatke o terminu
     */
    public function rasporedPredmet()
    {
        return $this->belongsTo(RasporedPredmet::class, 'raspored_predmet_id');
    }
    
    /**
     * Dohvata predmet asociran sa prisustvom
     */
    public function predmet()
    {
        return $this->rasporedPredmet->predmet();
    }
}
