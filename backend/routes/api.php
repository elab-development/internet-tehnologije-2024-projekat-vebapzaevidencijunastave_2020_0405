<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\PredmetController;
use App\Http\Controllers\TerminController;
use App\Http\Controllers\RasporedController;

// Rute za termine
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/termini', [TerminController::class, 'index']);
    Route::post('/termini', [TerminController::class, 'store']);
    Route::delete('/termini/{id}', [TerminController::class, 'destroy']);
});

// Rute za rasporede
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/rasporedi', [RasporedController::class, 'index']);
    Route::post('/rasporedi', [RasporedController::class, 'store']);
    Route::delete('/rasporedi/{id}', [RasporedController::class, 'destroy']);
    Route::post('/rasporedi/{id}/predmeti', [RasporedController::class, 'addPredmet']);
    Route::delete('/rasporedi/{rasporedId}/predmeti/{predmetId}', [RasporedController::class, 'removePredmet']);
}); 