<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prisustvo extends Model
{
    use HasFactory;

    protected $table = 'prisustvo';

    protected $fillable = ['student_id', 'termin_id', 'status_prisustva',];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function termin()
    {
        return $this->belongsTo(Termin::class, 'termin_id');
    }
}
