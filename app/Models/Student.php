<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;


class Student extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}

class Student extends Model
{
    use HasFactory;

    protected $table = 'student';

    protected $fillable = [ 'ime',
    'prezime',
    'broj_indeksa',
    'email',
    'godina_studija',];

    public function prisustva()
    {
        return $this->hasMany(Prisustvo::class, 'student_id');
    }
}



