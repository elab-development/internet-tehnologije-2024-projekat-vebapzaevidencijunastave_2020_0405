<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Raspored;
use App\Models\Predmet;
use Illuminate\Support\Facades\DB;

class RasporedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kreiraj test raspored
        $raspored = Raspored::create([
            'naziv' => 'Raspored za 1. godinu - Letnji semestar 2023/2024',
            'godina_studija' => 1,
            'semestar' => 2,
            'skolska_godina' => '2023/2024',
            'aktivan' => true
        ]);

        // Proveri da li postoje predmeti
        $predmeti = Predmet::count();
        
        if ($predmeti == 0) {
            // Ako ne postoje predmeti, dodaj nekoliko test predmeta
            $matematika = Predmet::create([
                'naziv' => 'Matematika',
                'opis' => 'Osnovi matematike za inženjere',
                'godina_studija' => 1,
                'semestar' => 2,
                'espb' => 6
            ]);
            
            $programiranje = Predmet::create([
                'naziv' => 'Programiranje',
                'opis' => 'Osnove programiranja u C-u',
                'godina_studija' => 1,
                'semestar' => 2,
                'espb' => 8
            ]);
            
            $bazePodataka = Predmet::create([
                'naziv' => 'Baze podataka',
                'opis' => 'Relacione baze podataka i SQL',
                'godina_studija' => 1,
                'semestar' => 2,
                'espb' => 7
            ]);
            
            // Poveži predmete sa rasporedom
            DB::table('raspored_predmet')->insert([
                [
                    'raspored_id' => $raspored->id,
                    'predmet_id' => $matematika->id,
                    'dan_u_nedelji' => 'Ponedeljak',
                    'vreme_pocetka' => '08:00',
                    'vreme_zavrsetka' => '10:00',
                    'sala' => 'A1',
                    'tip_nastave' => 'Predavanje',
                    'created_at' => now(),
                    'updated_at' => now()
                ],
                [
                    'raspored_id' => $raspored->id,
                    'predmet_id' => $programiranje->id,
                    'dan_u_nedelji' => 'Utorak',
                    'vreme_pocetka' => '10:00',
                    'vreme_zavrsetka' => '12:00',
                    'sala' => 'B2',
                    'tip_nastave' => 'Vežbe',
                    'created_at' => now(),
                    'updated_at' => now()
                ],
                [
                    'raspored_id' => $raspored->id,
                    'predmet_id' => $bazePodataka->id,
                    'dan_u_nedelji' => 'Sreda',
                    'vreme_pocetka' => '12:00',
                    'vreme_zavrsetka' => '14:00',
                    'sala' => 'C3',
                    'tip_nastave' => 'Predavanje',
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            ]);
        } else {
            // Ako već postoje predmeti, poveži ih sa rasporedom
            $predmeti = Predmet::take(3)->get();
            
            $dani = ['Ponedeljak', 'Utorak', 'Sreda'];
            $vremena = [
                ['08:00', '10:00'],
                ['10:00', '12:00'],
                ['12:00', '14:00']
            ];
            $sale = ['A1', 'B2', 'C3'];
            $tipovi = ['Predavanje', 'Vežbe', 'Predavanje'];
            
            foreach ($predmeti as $index => $predmet) {
                DB::table('raspored_predmet')->insert([
                    'raspored_id' => $raspored->id,
                    'predmet_id' => $predmet->id,
                    'dan_u_nedelji' => $dani[$index],
                    'vreme_pocetka' => $vremena[$index][0],
                    'vreme_zavrsetka' => $vremena[$index][1],
                    'sala' => $sale[$index],
                    'tip_nastave' => $tipovi[$index],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        $this->command->info('Raspored i predmeti su uspešno kreirani i povezani!');
    }
} 