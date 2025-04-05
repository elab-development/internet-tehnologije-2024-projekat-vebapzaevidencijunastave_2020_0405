<?php

namespace App\Http\Controllers;

use App\Models\Termin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TerminController extends Controller
{
    public function index()
    {
        $termini = Termin::with('predmet')->get();
        return response()->json($termini);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'predmet_id' => 'required|exists:predmeti,id',
            'datum' => 'required|date',
            'vreme_pocetka' => 'required',
            'vreme_zavrsetka' => 'required',
            'sala' => 'required|string',
            'tip_nastave' => 'required|in:Predavanja,Vežbe'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $termin = Termin::create($request->all());
        return response()->json($termin, 201);
    }

    public function destroy($id)
    {
        $termin = Termin::findOrFail($id);
        $termin->delete();
        return response()->json(null, 204);
    }
} 