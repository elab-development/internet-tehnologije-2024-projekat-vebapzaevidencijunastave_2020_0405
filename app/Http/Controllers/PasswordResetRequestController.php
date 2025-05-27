<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PasswordResetRequest;
use App\Models\Student;
use App\Models\Profesor;
use Illuminate\Support\Facades\Hash;

class PasswordResetRequestController extends Controller
{
    // Vrati sve zahteve
    public function index()
    {
        return PasswordResetRequest::orderBy('created_at', 'desc')->get();
    }

    // Admin menja lozinku korisniku
    public function resetPassword(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'newPassword' => 'required|string|min:6'
        ]);

        // Prvo probaj kao studenta
        $user = Student::where('broj_indeksa', $request->identifier)->first();
        if (!$user) {
            // Ako nije student, probaj kao profesora
            $user = Profesor::where('korisnicko_ime', $request->identifier)->first();
        }
        if (!$user) {
            return response()->json(['message' => 'Korisnik nije pronađen.'], 404);
        }

        $user->lozinka = Hash::make($request->newPassword);
        $user->save();

        // Obeleži zahtev kao rešen
        PasswordResetRequest::where('identifier', $request->identifier)
            ->where('status', 'pending')
            ->update(['status' => 'resolved']);

        return response()->json(['message' => 'Lozinka je uspešno promenjena.']);
    }
}
