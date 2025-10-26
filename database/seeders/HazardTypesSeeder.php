<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HazardTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();
        DB::table('hazard_types')->insert([
            ['key' => 'flood', 'name' => 'Flood', 'color' => '#1e90ff', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'landslide', 'name' => 'Landslide', 'color' => '#8b4513', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'fire', 'name' => 'Fire', 'color' => '#ff4500', 'created_at' => $now, 'updated_at' => $now],
            ['key' => 'roadblock', 'name' => 'Roadblock', 'color' => '#ffcc00', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }
}
