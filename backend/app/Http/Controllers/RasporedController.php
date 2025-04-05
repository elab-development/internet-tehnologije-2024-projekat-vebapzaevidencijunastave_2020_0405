<?php

namespace App\Http\Controllers;

use App\Models\Raspored;
use App\Models\Predmet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RasporedController extends Controller
{
    public function index()
    {
        $rasporedi = Raspored::with('predmeti')->get();
        return response()->json($rasporedi);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string',
            'godina_studija' => 'required|integer|min:1|max:4',
            'semestar' => 'required|integer|in:1,2',
            'skolska_godina' => 'required|string',
            'aktivan' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $raspored = Raspored::create($request->all());
        return response()->json($raspored, 201);
    }

    public function destroy($id)
    {
        $raspored = Raspored::findOrFail($id);
        $raspored->delete();
        return response()->json(null, 204);
    }

    public function addPredmet(Request $request, $id)
    {
        $raspored = Raspored::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'predmet_id' => 'required|exists:predmeti,id',
            'dan_u_nedelji' => 'required|in:Ponedeljak,Utorak,Sreda,Četvrtak,Petak',
            'vreme_pocetka' => 'required',
            'vreme_zavrsetka' => 'required',
            'sala' => 'required|string',
            'tip_nastave' => 'required|in:Predavanja,Vežbe'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Provera da li predmet odgovara godini studija
        $predmet = Predmet::findOrFail($request->predmet_id);
        if ($predmet->godina_studija !== $raspored->godina_studija) {
            return response()->json([
                'error' => 'Predmet nije sa iste godine studija kao i raspored'
            ], 422);
        }

        $raspored->predmeti()->attach($request->predmet_id, [
            'dan_u_nedelji' => $request->dan_u_nedelji,
            'vreme_pocetka' => $request->vreme_pocetka,
            'vreme_zavrsetka' => $request->vreme_zavrsetka,
            'sala' => $request->sala,
            'tip_nastave' => $request->tip_nastave
        ]);

        return response()->json($raspored->load('predmeti'), 200);
    }

    public function removePredmet($rasporedId, $predmetId)
    {
        $raspored = Raspored::findOrFail($rasporedId);
        $raspored->predmeti()->detach($predmetId);
        return response()->json(null, 204);
    }
} 