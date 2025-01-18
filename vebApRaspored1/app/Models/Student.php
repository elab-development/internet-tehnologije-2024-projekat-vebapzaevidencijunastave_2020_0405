<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    // Relacija: Student ima više prisustava
    public function prisustva()
    {
        return $this->hasMany(Prisustvo::class, 'id_student');
    }
}

