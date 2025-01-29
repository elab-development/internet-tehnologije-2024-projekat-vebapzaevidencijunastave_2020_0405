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
 

Route::resource('profesori', ProfesorController::class);
Route::resource('predmeti', PredmetController::class);
Route::resource('rasporedi', RasporedController::class);
Route::resource('termini', TerminController::class);
Route::resource('studenti', StudentController::class);
Route::resource('prisustva', PrisustvoController::class);

Route::get('predmeti/{id}/profesor', [PredmetController::class, 'getProfesor']);
Route::get('studenti', [StudentController::class, 'filterByGodinaStudija']);
Route::get('termini/{id}/prisustvo', [PrisustvoController::class, 'countPrisustvoByTermin']);

Route::post('student/register', [AuthController::class, 'registerStudent']);
Route::post('student/login', [AuthController::class, 'loginStudent']);
Route::post('profesor/login', [AuthController::class, 'loginProfesor']);
 
Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);