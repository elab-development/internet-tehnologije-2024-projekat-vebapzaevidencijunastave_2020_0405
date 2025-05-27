<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\PasswordResetRequest;

class ForgotPasswordController extends Controller
{
    public function notifyAdmin(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string'
        ]);

        PasswordResetRequest::create([
            'identifier' => $request->identifier,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Zahtev je sačuvan i prosleđen administratoru.']);
    }
} 