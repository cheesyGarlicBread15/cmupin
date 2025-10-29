<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin'),
            'phone_number' => '09924782938',
        ]);

        $member1 = User::create([
            'name' => 'Daven Alajid',
            'email' => 's.alajid.daven@cmu.edu.ph',
            'password' => bcrypt('member'),
            'phone_number' => '09301539848',
        ]);

        $admin->assignRole('admin');
    }
}
