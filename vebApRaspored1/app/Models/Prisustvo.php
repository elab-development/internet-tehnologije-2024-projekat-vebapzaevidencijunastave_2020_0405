<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prisustvo extends Model
{
    use HasFactory;

    // Relacija: Prisustvo pripada jednom studentu
    public function student()
    {
        return $this->belongsTo(Student::class, 'id_student');
    }

    // Relacija: Prisustvo pripada jednom terminu
    public function termin()
    {
        return $this->belongsTo(Termin::class, 'id_termin');
    }
}

