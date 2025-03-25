<?php

namespace App\Http\Controllers;

use App\Models\Prisustvo;
use App\Models\RasporedPredmet;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PrisustvoController extends Controller
{
    private $daniUNedelji = [
        'Monday' => 'Ponedeljak',
        'Tuesday' => 'Utorak',
        'Wednesday' => 'Sreda',
        'Thursday' => 'Četvrtak',
        'Friday' => 'Petak',
        'Saturday' => 'Subota',
        'Sunday' => 'Nedelja'
    ];

    public function index()
    {
        return response()->json(Prisustvo::with(['student', 'rasporedPredmet.predmet'])->get(), 200);
    }

    /**
     * Kreira novo prisustvo za određeni termin
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'raspored_predmet_id' => 'required|exists:raspored_predmet,id',
            'student_id' => 'required|exists:student,id',
            'status_prisustva' => 'required|boolean',
            'datum_evidencije' => 'required|date'
        ]);

        // Proveravamo da li već postoji prisustvo za ovog studenta na ovom terminu i datumu
        $postojecePrisustvo = Prisustvo::where('student_id', $validatedData['student_id'])
            ->where('raspored_predmet_id', $validatedData['raspored_predmet_id'])
            ->where('datum_evidencije', $validatedData['datum_evidencije'])
            ->first();
            
        if ($postojecePrisustvo) {
            return response()->json(['message' => 'Prisustvo za ovaj termin i datum već postoji'], 409);
        }

        $prisustvo = Prisustvo::create($validatedData);
        return response()->json($prisustvo, 201);
    }

    /**
     * Prikazuje detalje prisustva
     */
    public function show($id)
    {
        $prisustvo = Prisustvo::with(['student', 'rasporedPredmet.predmet'])->find($id);
        if (!$prisustvo) {
            return response()->json(['message' => 'Prisustvo nije pronađeno'], 404);
        }
        return response()->json($prisustvo, 200);
    }

    /**
     * Ažurira postojeće prisustvo
     */
    public function update(Request $request, $id)
    {
        $prisustvo = Prisustvo::find($id);
        if (!$prisustvo) {
            return response()->json(['message' => 'Prisustvo nije pronađeno'], 404);
        }

        $validatedData = $request->validate([
            'raspored_predmet_id' => 'exists:raspored_predmet,id',
            'student_id' => 'exists:student,id',
            'status_prisustva' => 'boolean',
            'datum_evidencije' => 'date'
        ]);

        $prisustvo->update($validatedData);
        return response()->json($prisustvo, 200);
    }

    /**
     * Briše prisustvo
     */
    public function destroy($id)
    {
        $prisustvo = Prisustvo::find($id);
        if (!$prisustvo) {
            return response()->json(['message' => 'Prisustvo nije pronađeno'], 404);
        }

        $prisustvo->delete();
        return response()->json(['message' => 'Prisustvo uspešno obrisano'], 200);
    }

    /**
     * Vraća broj prisustava/odsustava za termin
     */
    public function countPrisustvoByTermin($rasporedPredmetId, $datum = null)
    {
        // Ako datum nije prosleđen, koristi današnji datum
        if (!$datum) {
            $datum = Carbon::today()->format('Y-m-d');
        }
        
        $ukupnoPrisutnih = Prisustvo::where('raspored_predmet_id', $rasporedPredmetId)
            ->where('datum_evidencije', $datum)
            ->where('status_prisustva', true)
            ->count();
            
        $ukupnoOdsutnih = Prisustvo::where('raspored_predmet_id', $rasporedPredmetId)
            ->where('datum_evidencije', $datum)
            ->where('status_prisustva', false)
            ->count();
 
    return response()->json([
            'raspored_predmet_id' => $rasporedPredmetId,
            'datum' => $datum,
        'ukupno_prisutnih' => $ukupnoPrisutnih,
        'ukupno_odsutnih' => $ukupnoOdsutnih
    ], 200);
}

    /**
     * Dohvata prisustva za ulogovanog studenta
     */
    public function getStudentPrisustva()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Korisnik nije autentifikovan'], 401);
        }
        
        $user = Auth::user();
        
        if (!($user instanceof Student)) {
            return response()->json(['message' => 'Pristup dozvoljen samo studentima'], 403);
        }
        
        $prisustva = Prisustvo::where('student_id', $user->id)
            ->with(['rasporedPredmet.predmet'])
            ->orderBy('datum_evidencije', 'desc')
            ->get();
            
        // Organizujemo prisustva po predmetima
        $predmeti = [];
        foreach ($prisustva as $prisustvo) {
            $predmet = $prisustvo->rasporedPredmet->predmet;
            $predmetId = $predmet->id;
            
            if (!isset($predmeti[$predmetId])) {
                $predmeti[$predmetId] = [
                    'predmet' => $predmet,
                    'prisustva' => []
                ];
            }
            
            $predmeti[$predmetId]['prisustva'][] = [
                'id' => $prisustvo->id,
                'datum' => $prisustvo->datum_evidencije,
                'status' => $prisustvo->status_prisustva,
                'termin' => [
                    'dan' => $prisustvo->rasporedPredmet->dan_u_nedelji,
                    'vreme' => $prisustvo->rasporedPredmet->vreme_pocetka . ' - ' . $prisustvo->rasporedPredmet->vreme_zavrsetka,
                    'sala' => $prisustvo->rasporedPredmet->sala,
                    'tip_nastave' => $prisustvo->rasporedPredmet->tip_nastave
                ]
            ];
        }
        
        return response()->json(array_values($predmeti));
    }
    
    /**
     * Evidentira prisustvo trenutno ulogovanog studenta na aktivnom terminu
     */
    public function evidentirajPrisustvo(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Korisnik nije autentifikovan'], 401);
        }
        
        $user = Auth::user();
        
        if (!($user instanceof Student)) {
            return response()->json(['message' => 'Pristup dozvoljen samo studentima'], 403);
        }
        
        $validatedData = $request->validate([
            'raspored_predmet_id' => 'required|exists:raspored_predmet,id',
        ]);
        
        // Provera da li je termin aktivan
        $rasporedPredmet = RasporedPredmet::find($validatedData['raspored_predmet_id']);
        if (!$rasporedPredmet->isAktivan()) {
            return response()->json(['message' => 'Termin trenutno nije aktivan'], 400);
        }
        
        // Provera da li student već ima evidentirano prisustvo za današnji dan
        $danas = Carbon::today()->format('Y-m-d');
        $postojecePrisustvo = Prisustvo::where('student_id', $user->id)
            ->where('raspored_predmet_id', $validatedData['raspored_predmet_id'])
            ->where('datum_evidencije', $danas)
            ->first();
            
        if ($postojecePrisustvo) {
            return response()->json(['message' => 'Prisustvo već evidentirano za ovaj termin'], 409);
        }
        
        // Kreiranje novog prisustva
        $prisustvo = Prisustvo::create([
            'student_id' => $user->id,
            'raspored_predmet_id' => $validatedData['raspored_predmet_id'],
            'datum_evidencije' => $danas,
            'status_prisustva' => true // Podrazumevano je prisutan
        ]);
        
        return response()->json([
            'message' => 'Prisustvo uspešno evidentirano',
            'prisustvo' => $prisustvo
        ], 201);
    }
    
    /**
     * Dohvata aktivne termine za današnji dan - termine na kojima student može da se evidentira
     */
    public function getAktivniTermini()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Korisnik nije autentifikovan'], 401);
        }
        
        $user = Auth::user();
        
        if (!($user instanceof Student)) {
            return response()->json(['message' => 'Pristup dozvoljen samo studentima'], 403);
        }
        
        // Dohvatamo današnji dan na srpskom
        $danUNedelji = $this->daniUNedelji[Carbon::now()->format('l')];
        
        // Dohvatamo aktivne termine za danas
        $aktivniTermini = RasporedPredmet::where('dan_u_nedelji', $danUNedelji)
            ->whereHas('raspored', function($query) use ($user) {
                $query->where('godina_studija', $user->godina_studija)
                    ->where('aktivan', true);
            })
            ->with(['predmet', 'raspored'])
            ->get()
            ->filter(function($termin) {
                return $termin->isAktivan();
            });
        
        // Obeležavamo termine na kojima je student već evidentiran
        $danas = Carbon::today()->format('Y-m-d');
        $evidentiraniTermini = Prisustvo::where('student_id', $user->id)
            ->where('datum_evidencije', $danas)
            ->pluck('raspored_predmet_id')
            ->toArray();
            
        $formattedTermini = $aktivniTermini->map(function($termin) use ($evidentiraniTermini) {
            return [
                'id' => $termin->id,
                'predmet' => $termin->predmet->naziv,
                'vreme_pocetka' => $termin->vreme_pocetka,
                'vreme_zavrsetka' => $termin->vreme_zavrsetka,
                'sala' => $termin->sala,
                'tip_nastave' => $termin->tip_nastave,
                'vec_evidentiran' => in_array($termin->id, $evidentiraniTermini)
            ];
        });
        
        return response()->json($formattedTermini);
    }
}



