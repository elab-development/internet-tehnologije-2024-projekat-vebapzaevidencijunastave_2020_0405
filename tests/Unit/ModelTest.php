<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Profesor;
use App\Models\Student;
use App\Models\RasporedPredmet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class ModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function profesor_moze_imati_vise_predmeta()
    {
        $profesor = Profesor::factory()->create();
        $predmet1 = Predmet::factory()->create(['profesor_id' => $profesor->id]);
        $predmet2 = Predmet::factory()->create(['profesor_id' => $profesor->id]);

        $this->assertCount(2, $profesor->predmeti);
    }

    /** @test */
    public function student_lozinka_se_hesira()
    {
        $student = Student::factory()->create(['lozinka' => 'password123']);
        
        $this->assertNotEquals('password123', $student->lozinka);
        $this->assertTrue(password_verify('password123', $student->lozinka));
    }

    /** @test */
    public function termin_je_aktivan_kada_je_danas_i_u_vremenu()
    {
        Carbon::setTestNow(Carbon::create(2024, 1, 15, 11, 0, 0)); // ponedeljak 11:00
        
        $termin = RasporedPredmet::factory()->create([
            'dan_u_nedelji' => 'ponedeljak',
            'vreme_pocetka' => '10:00',
            'vreme_zavrsetka' => '12:00'
        ]);

        $this->assertTrue($termin->isAktivan());
    }
}
