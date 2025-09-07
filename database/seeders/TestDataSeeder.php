<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profesor;
use App\Models\Student;
use App\Models\Admin;
use App\Models\Predmet;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Test admin
        Admin::create([
            'ime' => 'Test',
            'prezime' => 'Admin',
            'email' => 'admin@test.com',
            'lozinka' => Hash::make('password123'),
            'uloga' => 'super_admin',
        ]);

        // Test profesor
        $profesor = Profesor::create([
            'ime' => 'Marko',
            'prezime' => 'Petrović',
            'email' => 'profesor@test.com',
            'korisnicko_ime' => 'm.petrovic',
            'lozinka' => Hash::make('password123'),
        ]);

        // Test student
        Student::create([
            'ime' => 'Petar',
            'prezime' => 'Jovanović',
            'email' => 'student@test.com',
            'broj_indeksa' => '2020/0001',
            'datum_rodjenja' => '2000-05-15',
            'lozinka' => Hash::make('password123'),
        ]);

        // Test predmet
        Predmet::create([
            'naziv' => 'Internet Tehnologije',
            'semestar' => 6,
            'godina_studija' => 3,
            'profesor_id' => $profesor->id,
        ]);
    }
}
