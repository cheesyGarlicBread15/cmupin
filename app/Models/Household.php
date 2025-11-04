<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Household extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'lat',
        'long',
        'status',
        'user_id'
    ];

    protected $casts = [
        'lat' => 'decimal:8',
        'long' => 'decimal:8',
    ];
}
