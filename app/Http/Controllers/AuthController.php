<?php
 
namespace App\Http\Controllers;
 
use App\Models\Student;
use App\Models\Admin;
use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
 
class AuthController extends Controller
{
    // 📌 REGISTRACIJA STUDENTA
    public function registerStudent(Request $request)
    {
        $validatedData = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'broj_indeksa' => 'required|string|unique:student,broj_indeksa|max:20',
            'email' => 'required|email|unique:student,email',
            'godina_studija' => 'required|integer|min:1|max:5',
            'lozinka' => 'required|string|min:6',
        ]);
 
        $student = Student::create([
            'ime' => $validatedData['ime'],
            'prezime' => $validatedData['prezime'],
            'broj_indeksa' => $validatedData['broj_indeksa'],
            'email' => $validatedData['email'],
            'godina_studija' => $validatedData['godina_studija'],
            'lozinka' => Hash::make($validatedData['lozinka']),
        ]);
 
        $token = $student->createToken('authToken')->plainTextToken;
 
        return response()->json([
            'user' => $student,
            'token' => $token,
            'role' => 'student'
        ], 201);
    }
 
    // 📌 LOGIN STUDENTA
    public function loginStudent(Request $request)
    {
        $validatedData = $request->validate([
            'broj_indeksa' => 'required|string',
            'lozinka' => 'required|string'
        ]);
 
        $student = Student::where('broj_indeksa', $validatedData['broj_indeksa'])->first();
 
        if (!$student || !Hash::check($validatedData['lozinka'], $student->lozinka)) {
            return response()->json(['message' => 'Neispravan broj indeksa ili lozinka'], 401);
        }
 
        $token = $student->createToken('authToken')->plainTextToken;
 
        return response()->json([
            'user' => $student,
            'token' => $token,
            'role' => 'student'
        ], 200);
    }
 
    // 📌 LOGIN PROFESORA
    public function loginProfesor(Request $request)
    {
        $validatedData = $request->validate([
            'korisnicko_ime' => 'required|string',
            'lozinka' => 'required|string'
        ]);
 
        $profesor = Profesor::where('korisnicko_ime', $validatedData['korisnicko_ime'])->first();
 
        if (!$profesor || !Hash::check($validatedData['lozinka'], $profesor->lozinka)) {
            return response()->json(['message' => 'Neispravno korisničko ime ili lozinka'], 401);
        }
 
        $token = $profesor->createToken('authToken')->plainTextToken;
 
        return response()->json([
            'user' => $profesor,
            'token' => $token,
            'role' => 'profesor'
        ], 200);
    }

    public function registerAdmin(Request $request)
    {
        $validatedData = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'email' => 'required|email|unique:admin,email',
            'korisnicko_ime' => 'required|string|unique:admin,korisnicko_ime|max:255',
            'lozinka' => 'required|string|min:6',
        ]);
    
        $admin = Admin::create([
            'ime' => $validatedData['ime'],
            'prezime' => $validatedData['prezime'],
            'email' => $validatedData['email'],
            'korisnicko_ime' => $validatedData['korisnicko_ime'],
            'lozinka' => bcrypt($validatedData['lozinka']), // Hash lozinke
        ]);
    
        return response()->json([
            'message' => 'Admin uspešno kreiran',
            'admin' => $admin
        ], 201);
    }
    
    public function registerProfesor(Request $request)
    {
        $validatedData = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'email' => 'required|email|unique:admin,email',
            'korisnicko_ime' => 'required|string|unique:admin,korisnicko_ime|max:255',
            'lozinka' => 'required|string|min:6',
        ]);
    
        $profesor = Profesor::create([
            'ime' => $validatedData['ime'],
            'prezime' => $validatedData['prezime'],
            'email' => $validatedData['email'],
            'korisnicko_ime' => $validatedData['korisnicko_ime'],
            'lozinka' => bcrypt($validatedData['lozinka']), // Hash lozinke
        ]);
    
        return response()->json([
            'message' => 'Profesor uspešno kreiran',
            'profesor' => $profesor
        ], 201);
    }
    

    public function loginAdmin(Request $request)
{
    $validatedData = $request->validate([
        'korisnicko_ime' => 'required|string',
        'lozinka' => 'required|string'
    ]);
 
    $admin = Admin::where('korisnicko_ime', $validatedData['korisnicko_ime'])->first();
 
    if (!$admin || !Hash::check($validatedData['lozinka'], $admin->lozinka)) {
        return response()->json(['message' => 'Neispravno korisničko ime ili lozinka'], 401);
    }
 
    $token = $admin->createToken('authToken')->plainTextToken;
 
    return response()->json([
        'user' => $admin,
        'token' => $token,
        'role' => 'admin'
    ], 200);
}
 
    
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Uspešno ste se odjavili'], 200);
    }
}