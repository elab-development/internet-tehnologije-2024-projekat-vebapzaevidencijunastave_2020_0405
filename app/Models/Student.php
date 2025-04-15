<?php
namespace App\Models;
 
use Illuminate\Foundation\Auth\User as Authenticatable; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
class Student extends Authenticatable
{
    use HasApiTokens, HasFactory;
 
    protected $table = 'student';
 
    protected $fillable = [
        'ime',
        'prezime',
        'broj_indeksa',
        'email',
        'lozinka' ,
        'godina_studija',
        'slika'
    ];
 
    protected $hidden = ['lozinka']; 
 
    protected $casts = [
        'lozinka' => 'hashed',
    ];
 
    public function prisustva()
    {
        return $this->hasMany(Prisustvo::class, 'student_id');
    }
}
