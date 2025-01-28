<?php

namespace App\Http\Controllers;

use App\Models\Raspored;
use Illuminate\Http\Request;

class RasporedController extends Controller
{
    public function index()
    {
        return response()->json(Raspored::all(), 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'predmet_id' => 'required|exists:predmet,id',
            'godina_studija' => 'required|integer|min:1|max:5',
            'semestar' => 'required|integer|min:1|max:8'
        ]);

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
            'predmet_id' => 'exists:predmet,id',
            'godina_studija' => 'integer|min:1|max:5',
            'semestar' => 'integer|min:1|max:8'
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
}
