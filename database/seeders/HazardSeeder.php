<?php

namespace Database\Seeders;

use App\Models\Hazard;
use App\Models\HazardType;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HazardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        $hazards = [
            [
                'user_id' => $user->id,
                'hazard_type_id' => 1,
                'description' => 'Water level rising quickly due to heavy rain.',
                'latitude' => 10.3067192,
                'longitude' => 123.8924887,
                'severity' => 4,
                'status' => 'open',
            ],
            [
                'user_id' => $user->id,
                'hazard_type_id' => 4,
                'description' => 'Debris blocking part of the road.',
                'latitude' => 6.75586977,
                'longitude' => 125.05246928,
                'severity' => 3,
                'status' => 'open',
            ],
            [
                'user_id' => $user->id,
                'hazard_type_id' => 3,
                'description' => 'Fire reported near downtown area, responders on site.',
                'latitude' => 7.84320097,
                'longitude' => 125.0427534,
                'severity' => 5,
                'status' => 'resolved',
            ],
        ];

        Hazard::insert($hazards);
    }
}
