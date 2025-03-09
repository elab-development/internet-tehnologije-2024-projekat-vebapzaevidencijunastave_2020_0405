<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::all(), 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'broj_indeksa' => 'required|string|unique:student,broj_indeksa|max:20',
            'email' => 'required|email|unique:student,email',
            'lozinka' => 'required|string|min:6',
            'godina_studija' => 'required|integer|min:1|max:5',
        ]);

        $validatedData['lozinka'] = Hash::make($validatedData['lozinka']);
        
        $student = Student::create($validatedData);
        return response()->json([
            'message' => 'Student uspešno kreiran',
            'student' => $student
        ], 201);
    }

    public function show($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student nije pronađen'], 404);
        }
        return response()->json($student, 200);
    }

    public function update(Request $request, $id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student nije pronađen'], 404);
        }

        $validatedData = $request->validate([
            'ime' => 'string|max:255',
            'prezime' => 'string|max:255',
            'broj_indeksa' => 'string|unique:student,broj_indeksa,' . $id,
            'email' => 'email|unique:student,email,' . $id,
            'godina_studija' => 'integer|min:1|max:5',
        ]);

        $student->update($validatedData);
        return response()->json($student, 200);
    }

    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student nije pronađen'], 404);
        }

        $student->delete();
        return response()->json(['message' => 'Student uspešno obrisan'], 200);
    }


    //filtriranje studenata po zadatoj godini
    public function filterByGodinaStudija(Request $request)
{
    $godina = $request->query('godina'); // Uzimanje query parametra
    if (!$godina) {
        return response()->json(Student::all(), 200);
    }
 
    $studenti = Student::where('godina_studija', $godina)->get();
    return response()->json($studenti, 200);
}

public function getProfile(Request $request)
{
    $student = $request->user();
    return response()->json($student);
}
}
