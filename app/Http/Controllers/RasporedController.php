<?php

namespace App\Http\Controllers;

use App\Models\Raspored;
use App\Models\Predmet;
use App\Models\RasporedPredmet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RasporedController extends Controller
{
    public function index()
    {
        return response()->json(Raspored::all(), 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'naziv' => 'required|string|max:255',
            'godina_studija' => 'required|integer|min:1|max:5',
            'semestar' => 'required|integer|min:1|max:8',
            'skolska_godina' => 'required|string|max:255',
            'aktivan' => 'boolean'
        ]);

        // Postavljanje default vrednosti za aktivan ako nije prosleđeno
        if (!isset($validatedData['aktivan'])) {
            $validatedData['aktivan'] = false;
        }

        $raspored = Raspored::create($validatedData);
        return response()->json($raspored, 201);
    }

    public function show($id)
    {
        $raspored = Raspored::find($id);
        if (!$raspored) {
            return response()->json(['message' => 'Raspored nije pronađen'], 404);
        }
        return response()->json($raspored, 200);
    }

    public function update(Request $request, $id)
    {
        $raspored = Raspored::find($id);
        if (!$raspored) {
            return response()->json(['message' => 'Raspored nije pronađen'], 404);
        }

        $validatedData = $request->validate([
            'naziv' => 'string|max:255',
            'godina_studija' => 'integer|min:1|max:5',
            'semestar' => 'integer|min:1|max:8',
            'skolska_godina' => 'string|max:255',
            'aktivan' => 'boolean'
        ]);

        $raspored->update($validatedData);
        return response()->json($raspored, 200);
    }

    public function destroy($id)
    {
        $raspored = Raspored::find($id);
        if (!$raspored) {
            return response()->json(['message' => 'Raspored nije pronađen'], 404);
        }

        $raspored->delete();
        return response()->json(['message' => 'Raspored uspešno obrisan'], 200);
    }
    
    /**
     * Povezuje predmet sa rasporednim i dodaje informacije o terminu
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $rasporedId
     * @return \Illuminate\Http\Response
     */
    public function attachPredmet(Request $request, $rasporedId)
    {
        $request->validate([
            'predmet_id' => 'required|exists:predmet,id',
            'dan_u_nedelji' => 'required|in:Ponedeljak,Utorak,Sreda,Cetvrtak,Petak,Subota',
            'vreme_pocetka' => 'required|date_format:H:i',
            'vreme_zavrsetka' => 'required|date_format:H:i|after:vreme_pocetka',
            'ucionica' => 'required|string',
            'tip_nastave' => 'required|in:Predavanje,Vezbe'
        ]);

        $rasporedPredmet = RasporedPredmet::create([
            'predmet_id' => $request->predmet_id,
            'raspored_id' => $rasporedId,
            'dan_u_nedelji' => $request->dan_u_nedelji,
            'vreme_pocetka' => $request->vreme_pocetka,
            'vreme_zavrsetka' => $request->vreme_zavrsetka,
            'ucionica' => $request->ucionica,
            'tip_nastave' => $request->tip_nastave
        ]);

        return response()->json([
            'message' => 'Predmet je uspešno dodat u raspored.',
            'data' => $rasporedPredmet
        ], 201);
    }
}
