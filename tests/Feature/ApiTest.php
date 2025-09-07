<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Profesor;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function profesor_se_moze_ulogovati()
    {
        $profesor = Profesor::factory()->create([
            'email' => 'profesor@test.com',
            'lozinka' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'profesor@test.com',
            'password' => 'password123',
            'user_type' => 'profesor'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure(['user', 'token']);
    }

    /** @test */
    public function student_se_moze_ulogovati()
    {
        $student = Student::factory()->create([
            'email' => 'student@test.com',
            'lozinka' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'student@test.com',
            'password' => 'password123',
            'user_type' => 'student'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure(['user', 'token']);
    }

    /** @test */
    public function neuspesno_logovanje_sa_pogresnim_podacima()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'nepostojeci@test.com',
            'password' => 'pogresnalozinka',
            'user_type' => 'profesor'
        ]);

        $response->assertStatus(401);
    }
}
