<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\PredmetController;
use App\Http\Controllers\RasporedController;
use App\Http\Controllers\TerminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\PrisustvoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RasporedProfesorController;
 


//rute koje su dostupne samo adminu
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::resource('studenti', StudentController::class);
    Route::resource('profesori', ProfesorController::class);
    Route::resource('predmeti', PredmetController::class);
    Route::resource('rasporedi', RasporedController::class);
    Route::resource('termini', TerminController::class);
    Route::resource('prisustva', PrisustvoController::class);
});
// dodatna tri tipa ruta
Route::get('predmeti/{id}/profesor', [PredmetController::class, 'getProfesor']);
Route::get('studenti', [StudentController::class, 'filterByGodinaStudija']);
Route::get('termini/{id}/prisustvo', [PrisustvoController::class, 'countPrisustvoByTermin']);

// rute koje su dostupne svima
Route::post('student/register', [AuthController::class, 'registerStudent']);
Route::post('student/login', [AuthController::class, 'loginStudent']);
Route::post('profesor/register', [AuthController::class, 'registerProfesor']);
Route::post('profesor/login', [AuthController::class, 'loginProfesor']);
Route::post('admin/register', [AuthController::class, 'registerAdmin']);
Route::post('admin/login', [AuthController::class, 'loginAdmin']);

// rute za profil (zaštićene)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('student/profile', [StudentController::class, 'getProfile']);
    Route::get('profesor/profile', [ProfesorController::class, 'getProfile']);
    Route::get('admin/profile', [AdminController::class, 'getProfile']);
    Route::post('logout', [AuthController::class, 'logout']);
    
    // Nove rute za raspored
    Route::get('student/raspored', [RasporedProfesorController::class, 'getStudentRaspored']);
    Route::get('profesor/raspored', [RasporedProfesorController::class, 'getProfesorRaspored']);
    Route::post('rasporedi/{rasporedId}/predmeti', [RasporedController::class, 'attachPredmet']);

    // Nove rute za prisustvo
    Route::get('student/prisustva', [PrisustvoController::class, 'getStudentPrisustva']);
    Route::get('student/aktivni-termini', [PrisustvoController::class, 'getAktivniTermini']);
    Route::post('student/evidentiraj-prisustvo', [PrisustvoController::class, 'evidentirajPrisustvo']);
    
    // Ruta za prikaz statistike prisustva po terminu (za profesora)
    Route::get('prisustvo/termin/{rasporedPredmetId}/{datum?}', [PrisustvoController::class, 'countPrisustvoByTermin']);
});

