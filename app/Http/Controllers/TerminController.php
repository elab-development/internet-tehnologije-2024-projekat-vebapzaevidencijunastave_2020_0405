<?php

namespace App\Http\Controllers;

use App\Models\Termin;
use Illuminate\Http\Request;

class TerminController extends Controller
{
    public function index()
    {
        return response()->json(Termin::all(), 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'datum' => 'required|date',
            'vreme_pocetka' => 'nullable|date_format:H:i:s',
            'vreme_zavrsetka' => 'nullable|date_format:H:i:s',
            'tip_nastave' => 'required|string|max:255',
            'sala' => 'required|string|max:255',
            'raspored_id' => 'required|exists:raspored,id'
        ]);

        $termin = Termin::create($validatedData);
        return response()->json($termin, 201);
    }

    public function show($id)
    {
        $termin = Termin::find($id);
        if (!$termin) {
            return response()->json(['message' => 'Termin nije pronađen'], 404);
        }
        return response()->json($termin, 200);
    }

    public function update(Request $request, $id)
    {
        $termin = Termin::find($id);
        if (!$termin) {
            return response()->json(['message' => 'Termin nije pronađen'], 404);
        }

        $validatedData = $request->validate([
            'datum' => 'date',
            'vreme_pocetka' => 'nullable|date_format:H:i:s',
            'vreme_zavrsetka' => 'nullable|date_format:H:i:s',
            'tip_nastave' => 'string|max:255',
            'sala' => 'string|max:255',
            'raspored_id' => 'exists:raspored,id'
        ]);

        $termin->update($validatedData);
        return response()->json($termin, 200);
    }

    public function destroy($id)
    {
        $termin = Termin::find($id);
        if (!$termin) {
            return response()->json(['message' => 'Termin nije pronađen'], 404);
        }

        $termin->delete();
        return response()->json(['message' => 'Termin uspešno obrisan'], 200);
    }
}
