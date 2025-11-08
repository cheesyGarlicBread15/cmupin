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
            'email' => 'a3.marbuk@gmail.com',
            'password' => bcrypt('password'),
            'phone_number' => '09924782938',
        ]);
        $admin->assignRole('admin');

        $member1 = User::create([
            'name' => 'Daven Alajid',
            'email' => 's.alajid.daven@cmu.edu.ph',
            'password' => bcrypt('password'),
            'phone_number' => '09301539848',
        ]);
        $member1->assignRole('member');

        $member2 = User::create([
            'name' => 'Garlic Pizza',
            'email' => 'garlicpizza15@gmail.com',
            'password' => bcrypt('password'),
            'phone_number' => '09301539848',
        ]);
        $member2->assignRole('member');

        $member3 = User::create([
            'name' => 'Red Line',
            'email' => 'redline2024.blood@gmail.com',
            'password' => bcrypt('password'),
            'phone_number' => '09301539848',
        ]);
        $member3->assignRole('member');
    }
}
