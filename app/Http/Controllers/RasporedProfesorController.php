<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Raspored;
use App\Models\Predmet;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RasporedProfesorController extends Controller
{
    /**
     * Dohvata sve rasporede za prijavljenog studenta
     */
    public function getStudentRaspored()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Korisnik nije autentifikovan'], 401);
        }
        
        $user = Auth::user();
        
        if (!($user instanceof \App\Models\Student)) {
            return response()->json(['message' => 'Pristup dozvoljen samo studentima'], 403);
        }
        
        $student = $user;
        
        // Dohvatamo sve rasporede za studentovu godinu studija
        $rasporedi = Raspored::where('godina_studija', $student->godina_studija)
            ->with(['predmeti' => function($query) {
                $query->orderBy(DB::raw("FIELD(dan_u_nedelji, 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota')"))
                      ->orderBy('raspored_predmet.vreme_pocetka')
                      ->with('profesor');
            }])
            ->get()
            ->map(function($raspored) {
                return [
                    'id' => $raspored->id,
                    'naziv' => $raspored->naziv,
                    'godina_studija' => $raspored->godina_studija,
                    'semestar' => $raspored->semestar,
                    'skolska_godina' => $raspored->skolska_godina,
                    'aktivan' => $raspored->aktivan,
                    'predmeti' => $raspored->predmeti->map(function($predmet) {
                        return [
                            'id' => $predmet->pivot->id,
                            'naziv' => $predmet->naziv,
                            'dan_u_nedelji' => $predmet->pivot->dan_u_nedelji,
                            'vreme_pocetka' => $predmet->pivot->vreme_pocetka,
                            'vreme_zavrsetka' => $predmet->pivot->vreme_zavrsetka,
                            'sala' => $predmet->pivot->sala,
                            'tip_nastave' => $predmet->pivot->tip_nastave,
                            'profesor' => $predmet->profesor ? [
                                'ime' => $predmet->profesor->ime,
                                'prezime' => $predmet->profesor->prezime
                            ] : null
                        ];
                    })
                ];
            });
        
        if ($rasporedi->isEmpty()) {
            return response()->json(['message' => 'Nema rasporeda za vašu godinu studija'], 404);
        }
        
        return response()->json([
            'rasporedi' => $rasporedi
        ]);
    }
    
    /**
     * Dohvata sve rasporede za prijavljenog profesora
     */
    public function getProfesorRaspored()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Korisnik nije autentifikovan'], 401);
        }
        
        $user = Auth::user();
        
        if (!($user instanceof \App\Models\Profesor)) {
            return response()->json(['message' => 'Pristup dozvoljen samo profesorima'], 403);
        }
        
        $profesor = $user;
        
        // Dohvatamo predmete profesora
        $predmeti = Predmet::where('profesor_id', $profesor->id)->pluck('id');
        
        // Dohvatamo sve rasporede koji sadrže predmete ovog profesora
        $rasporedi = Raspored::whereHas('predmeti', function($query) use ($predmeti) {
                $query->whereIn('predmet.id', $predmeti);
            })
            ->with(['predmeti' => function($query) use ($predmeti) {
                $query->whereIn('predmet.id', $predmeti)
                      ->orderBy(DB::raw("FIELD(dan_u_nedelji, 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak')"))
                      ->orderBy('raspored_predmet.vreme_pocetka');
            }])
            ->get()
            ->map(function($raspored) {
                return [
                    'id' => $raspored->id,
                    'naziv' => $raspored->naziv,
                    'godina_studija' => $raspored->godina_studija,
                    'semestar' => $raspored->semestar,
                    'skolska_godina' => $raspored->skolska_godina,
                    'aktivan' => $raspored->aktivan,
                    'predmeti' => $raspored->predmeti->map(function($predmet) {
                        return [
                            'id' => $predmet->pivot->id,
                            'naziv' => $predmet->naziv,
                            'dan_u_nedelji' => $predmet->pivot->dan_u_nedelji,
                            'vreme_pocetka' => $predmet->pivot->vreme_pocetka,
                            'vreme_zavrsetka' => $predmet->pivot->vreme_zavrsetka,
                            'sala' => $predmet->pivot->sala,
                            'tip_nastave' => $predmet->pivot->tip_nastave
                        ];
                    })
                ];
            });
            
        if ($rasporedi->isEmpty()) {
            return response()->json(['message' => 'Nema rasporeda za vaše predmete'], 404);
        }
        
        return response()->json([
            'rasporedi' => $rasporedi
        ]);
    }
}
