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
     * Dohvata sve današnje termine za studenta
     */
    public function getAktivniTermini()
    {
        $student = auth()->user();
        
        // Prvo dohvatamo današnji dan
        $now = Carbon::now();
        $daniUNedelji = [
            1 => 'Ponedeljak',
            2 => 'Utorak',
            3 => 'Sreda',
            4 => 'Cetvrtak',
            5 => 'Petak',
            6 => 'Subota',
            7 => 'Nedelja'
        ];
        $trenutniDan = $daniUNedelji[$now->dayOfWeek === 0 ? 7 : $now->dayOfWeek];
        
        // Dohvatamo termine za današnji dan i studentovu godinu studija
        $današnjiTermini = RasporedPredmet::with(['predmet', 'raspored'])
            ->whereHas('raspored', function($query) use ($student) {
                $query->where('godina_studija', $student->godina_studija);
            })
            ->where('dan_u_nedelji', $trenutniDan)
            ->orderBy('vreme_pocetka')
            ->get()
            ->map(function($termin) use ($student) {
                // Proveravamo da li je student već evidentirao prisustvo
                $evidentiran = Prisustvo::where('student_id', $student->id)
                    ->where('raspored_predmet_id', $termin->id)
                    ->whereDate('datum_evidencije', Carbon::today())
                    ->exists();
                
                return [
                    'id' => $termin->id,
                    'naziv' => $termin->predmet->naziv,
                    'dan_u_nedelji' => $termin->dan_u_nedelji,
                    'vreme_pocetka' => $termin->vreme_pocetka,
                    'vreme_zavrsetka' => $termin->vreme_zavrsetka,
                    'sala' => $termin->sala,
                    'tip_nastave' => $termin->tip_nastave,
                    'evidentiran' => $evidentiran
                ];
            });

        return response()->json($današnjiTermini);
    }

    /**
     * Evidentira prisustvo studenta na terminu
     */
    public function evidentirajPrisustvo(Request $request)
    {
        try {
            $request->validate([
                'raspored_predmet_id' => 'required|exists:raspored_predmet,id'
            ]);

            $termin = RasporedPredmet::findOrFail($request->raspored_predmet_id);
            $student = auth()->user();

            // Provera vremena termina
            $trenutnoVreme = Carbon::now();
            $terminPocetak = Carbon::createFromTimeString($termin->vreme_pocetka);
            $terminKraj = Carbon::createFromTimeString($termin->vreme_zavrsetka);
            
            // Postavimo isti datum za poređenje
            $terminPocetak->setDate($trenutnoVreme->year, $trenutnoVreme->month, $trenutnoVreme->day);
            $terminKraj->setDate($trenutnoVreme->year, $trenutnoVreme->month, $trenutnoVreme->day);
            
            // Dozvoljen početak je 15 minuta pre početka termina
            $dozvoljenPocetak = $terminPocetak->copy()->subMinutes(15);
            
            // Provera da li je danas taj dan u nedelji
            $trenutniDan = $trenutnoVreme->englishDayOfWeek;
            $daniMapa = [
                'Monday' => 'Ponedeljak',
                'Tuesday' => 'Utorak',
                'Wednesday' => 'Sreda',
                'Thursday' => 'Cetvrtak',
                'Friday' => 'Petak',
                'Saturday' => 'Subota',
                'Sunday' => 'Nedelja'
            ];

            if ($daniMapa[$trenutniDan] !== $termin->dan_u_nedelji) {
                return response()->json([
                    'message' => "Danas nije dan za ovaj termin. Termin je {$termin->dan_u_nedelji}."
                ], 400);
            }

            // Provera vremena
            if ($trenutnoVreme > $terminKraj) {
                return response()->json([
                    'message' => "Termin je već završen. Ne možete evidentirati prisustvo nakon " . $terminKraj->format('H:i') . " časova."
                ], 400);
            }
            
            if ($trenutnoVreme < $dozvoljenPocetak) {
                return response()->json([
                    'message' => "Termin još nije počeo. Prisustvo možete evidentirati od " . $dozvoljenPocetak->format('H:i') . " časova."
                ], 400);
            }

            // Provera da li je student već evidentirao prisustvo
            $postojecePrisustvo = Prisustvo::where('student_id', $student->id)
                ->where('raspored_predmet_id', $termin->id)
                ->whereDate('datum_evidencije', Carbon::today())
                ->exists();

            if ($postojecePrisustvo) {
                return response()->json([
                    'message' => 'Već ste evidentirali prisustvo na ovom terminu danas.'
                ], 400);
            }

            // Kreiranje novog prisustva
            $prisustvo = Prisustvo::create([
                'student_id' => $student->id,
                'raspored_predmet_id' => $termin->id,
                'datum_evidencije' => Carbon::today(),
                'status_prisustva' => true // Postavljamo na true jer student sam evidentira svoje prisustvo
            ]);

            return response()->json([
                'message' => 'Prisustvo je uspešno evidentirano.',
                'data' => $prisustvo
            ], 201);
            
        } catch (\Exception $e) {
            \Log::error('Greška pri evidentiranju prisustva: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Došlo je do greške pri evidentiranju prisustva.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}



