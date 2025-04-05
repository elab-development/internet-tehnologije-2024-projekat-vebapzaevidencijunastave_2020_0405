<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Profesor;

class ProfesorMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !($request->user() instanceof Profesor)) {
            return response()->json(['message' => 'Pristup dozvoljen samo profesorima'], 403);
        }

        return $next($request);
    }
} 