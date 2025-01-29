<?php

namespace App\Http\Controllers;

use App\Models\Prisustvo;
use Illuminate\Http\Request;

class PrisustvoController extends Controller
{
    public function index()
    {
        return response()->json(Prisustvo::all(), 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'termin_id' => 'required|exists:termin,id',
            'student_id' => 'required|exists:student,id',
            'status_prisustva' => 'required|boolean',
        ]);

        $prisustvo = Prisustvo::create($validatedData);
        return response()->json($prisustvo, 201);
    }

    public function show($id)
    {
        $prisustvo = Prisustvo::find($id);
        if (!$prisustvo) {
            return response()->json(['message' => 'Prisustvo nije pronađeno'], 404);
        }
        return response()->json($prisustvo, 200);
    }

    public function update(Request $request, $id)
    {
        $prisustvo = Prisustvo::find($id);
        if (!$prisustvo) {
            return response()->json(['message' => 'Prisustvo nije pronađeno'], 404);
        }

        $validatedData = $request->validate([
            'termin_id' => 'exists:termin,id',
            'student_id' => 'exists:student,id',
            'status_prisustva' => 'boolean',
        ]);

        $prisustvo->update($validatedData);
        return response()->json($prisustvo, 200);
    }

    public function destroy($id)
    {
        $prisustvo = Prisustvo::find($id);
        if (!$prisustvo) {
            return response()->json(['message' => 'Prisustvo nije pronađeno'], 404);
        }

        $prisustvo->delete();
        return response()->json(['message' => 'Prisustvo uspešno obrisano'], 200);
    }

    public function countPrisustvoByTermin($id)
{
    $ukupnoPrisutnih = Prisustvo::where('termin_id', $id)->where('status_prisustva', true)->count();
    $ukupnoOdsutnih = Prisustvo::where('termin_id', $id)->where('status_prisustva', false)->count();
 
    return response()->json([
        'termin_id' => $id,
        'ukupno_prisutnih' => $ukupnoPrisutnih,
        'ukupno_odsutnih' => $ukupnoOdsutnih
    ], 200);
}

}



