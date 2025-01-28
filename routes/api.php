<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\PredmetController;
use App\Http\Controllers\RasporedController;
use App\Http\Controllers\TerminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\PrisustvoController;

Route::resource('profesori', ProfesorController::class);
Route::resource('predmeti', PredmetController::class);
Route::resource('rasporedi', RasporedController::class);
Route::resource('termini', TerminController::class);
Route::resource('studenti', StudentController::class);
Route::resource('prisustva', PrisustvoController::class);

