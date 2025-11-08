<?php

namespace Database\Seeders;

use App\Models\Household;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HouseholdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leader = User::where('email', 's.alajid.daven@cmu.edu.ph')->first();
        $member = User::where('email', 'garlicpizza15@gmail.com')->first();
        $h = Household::create([
            'name' => 'Alajid Residence',
            'address' => 'Purok-8, North Poblacion, Maramag, Bukidnon',
            'lat' => 7.77340201,
            'long' => 125.0066626,
            'status' => 'at_risk',
            'user_id' => $leader ? $leader->id : null,
        ]);
        if ($leader) {
            $leader->household_id = $h->id;
            $leader->syncRoles(['leader']);
            $leader->save();
        }
        if ($member) {
            $member->household_id = $h->id;
            $member->save();
        }
    }
}
