<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Carbon\Carbon;

class RasporedPredmet extends Model
{
    use HasFactory;

    protected $table = 'raspored_predmet';
    
    protected $fillable = [
        'raspored_id',
        'predmet_id',
        'dan_u_nedelji',
        'vreme_pocetka',
        'vreme_zavrsetka',
        'sala',
        'tip_nastave'
    ];
    
    /**
     * Relacija prema rasporedu
     */
    public function raspored()
    {
        return $this->belongsTo(Raspored::class, 'raspored_id');
    }
    
    /**
     * Relacija prema predmetu
     */
    public function predmet()
    {
        return $this->belongsTo(Predmet::class, 'predmet_id');
    }
    
    /**
     * Relacija prema prisustvima
     */
    public function prisustva()
    {
        return $this->hasMany(Prisustvo::class, 'raspored_predmet_id');
    }
    
    /**
     * Proverava da li je termin aktivan (da li je trenutni dan u nedelji isti kao i dan termina
     * i da li je trenutno vreme između početka i kraja termina)
     */
    public function isAktivan()
    {
        $trenutnoVreme = now()->format('H:i');
        $trenutniDan = now()->englishDayOfWeek;
        
        $daniMapa = [
            'Monday' => 'Ponedeljak',
            'Tuesday' => 'Utorak',
            'Wednesday' => 'Sreda',
            'Thursday' => 'Cetvrtak',
            'Friday' => 'Petak',
            'Saturday' => 'Subota',
            'Sunday' => 'Nedelja'
        ];

        return $daniMapa[$trenutniDan] === $this->dan_u_nedelji &&
               $trenutnoVreme >= $this->vreme_pocetka &&
               $trenutnoVreme <= $this->vreme_zavrsetka;
    }
    
    /**
     * Dohvata sve aktivne termine (termine koji se održavaju danas)
     */
    public static function aktivniTermini()
    {
        $trenutnoVreme = now()->format('H:i');
        $trenutniDan = now()->englishDayOfWeek;
        
        $daniMapa = [
            'Monday' => 'Ponedeljak',
            'Tuesday' => 'Utorak',
            'Wednesday' => 'Sreda',
            'Thursday' => 'Cetvrtak',
            'Friday' => 'Petak',
            'Saturday' => 'Subota',
            'Sunday' => 'Nedelja'
        ];

        return self::where('dan_u_nedelji', $daniMapa[$trenutniDan])
            ->where('vreme_pocetka', '<=', $trenutnoVreme)
            ->where('vreme_zavrsetka', '>=', $trenutnoVreme)
            ->get();
    }
    
    /**
     * Dohvata sve današnje termine
     */
    public static function današnjiTermini()
    {
        $now = Carbon::now();
        $daniUNedelji = [
            1 => 'Ponedeljak',
            2 => 'Utorak',
            3 => 'Sreda',
            4 => 'Četvrtak',
            5 => 'Petak',
            6 => 'Subota',
            7 => 'Nedelja'
        ];
        
        $trenutniDan = $daniUNedelji[$now->dayOfWeek === 0 ? 7 : $now->dayOfWeek];
        
        return self::where('dan_u_nedelji', $trenutniDan)
                  ->with(['predmet', 'raspored'])
                  ->orderBy('vreme_pocetka')
                  ->get();
    }
} 