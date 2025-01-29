<?php
 
namespace App\Models;
 
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
 
class Admin extends Authenticatable
{
    use HasApiTokens, HasFactory;
 
    protected $table = 'admin'; 
 
    protected $fillable = [
        'ime', 
        'prezime', 
        'email', 
        'korisnicko_ime', 
        'lozinka'
    ];
 
    protected $hidden = ['lozinka'];
 
    protected $casts = [
        'lozinka' => 'hashed',
    ];
}