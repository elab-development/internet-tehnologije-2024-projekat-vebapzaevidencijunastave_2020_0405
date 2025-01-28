<?php

namespace App\Http\Controllers;

use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfesorController extends Controller
{
    // Vraća listu svih profesora
    public function index()
    {
        return response()->json(Profesor::all(), 200);
    }

    // Kreira novog profesora
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'email' => 'required|email|unique:profesor,email',
            'korisnicko_ime' => 'required|string|unique:profesor,korisnicko_ime|max:255',
            'lozinka' => 'required|string|min:6',
        ]);

        // Hashovanje lozinke pre upisa u bazu
        $validatedData['lozinka'] = Hash::make($validatedData['lozinka']);

        $profesor = Profesor::create($validatedData);
        return response()->json($profesor, 201);
    }

    // Prikazuje određenog profesora po ID-u
    public function show($id)
    {
        $profesor = Profesor::find($id);
        if (!$profesor) {
            return response()->json(['message' => 'Profesor nije pronađen'], 404);
        }
        return response()->json($profesor, 200);
    }

    // Ažurira profesora
    public function update(Request $request, $id)
    {
        $profesor = Profesor::find($id);
        if (!$profesor) {
            return response()->json(['message' => 'Profesor nije pronađen'], 404);
        }

        $validatedData = $request->validate([
            'ime' => 'string|max:255',
            'prezime' => 'string|max:255',
            'email' => 'email|unique:profesor,email,' . $id,
            'korisnicko_ime' => 'string|unique:profesor,korisnicko_ime,' . $id,
            'lozinka' => 'nullable|string|min:6',
        ]);

        // Ako korisnik menja lozinku, hashuj je pre čuvanja
        if (!empty($validatedData['lozinka'])) {
            $validatedData['lozinka'] = Hash::make($validatedData['lozinka']);
        } else {
            unset($validatedData['lozinka']); // Ako nije promenjena, ne diramo je
        }

        $profesor->update($validatedData);
        return response()->json($profesor, 200);
    }

    // Briše profesora
    public function destroy($id)
    {
        $profesor = Profesor::find($id);
        if (!$profesor) {
            return response()->json(['message' => 'Profesor nije pronađen'], 404);
        }

        $profesor->delete();
        return response()->json(['message' => 'Profesor uspešno obrisan'], 200);
    }
}

