<?php

namespace App\Http\Controllers;

use App\Models\Predmet;
use Illuminate\Http\Request;

class PredmetController extends Controller
{
    public function index()
    {
        return response()->json(Predmet::all(), 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'naziv' => 'required|string|max:255|unique:predmet,naziv',
            'semestar' => 'required|integer|min:1|max:8',
            'godina_studija' => 'required|integer|min:1|max:5',
            'profesor_id' => 'required|exists:profesor,id'
        ]);

        $predmet = Predmet::create($validatedData);
        return response()->json($predmet, 201);
    }

    public function show($id)
    {
        $predmet = Predmet::find($id);
        if (!$predmet) {
            return response()->json(['message' => 'Predmet nije pronađen'], 404);
        }
        return response()->json($predmet, 200);
    }

    public function update(Request $request, $id)
    {
        $predmet = Predmet::find($id);
        if (!$predmet) {
            return response()->json(['message' => 'Predmet nije pronađen'], 404);
        }

        $validatedData = $request->validate([
            'naziv' => 'string|max:255|unique:predmet,naziv,' . $id,
            'semestar' => 'integer|min:1|max:8',
            'godina_studija' => 'integer|min:1|max:5',
            'profesor_id' => 'exists:profesor,id'
        ]);

        $predmet->update($validatedData);
        return response()->json($predmet, 200);
    }

    public function destroy($id)
    {
        $predmet = Predmet::find($id);
        if (!$predmet) {
            return response()->json(['message' => 'Predmet nije pronađen'], 404);
        }

        $predmet->delete();
        return response()->json(['message' => 'Predmet uspešno obrisan'], 200);
    }
}
