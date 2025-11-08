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

    public function leader()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function members()
    {
        return $this->hasMany(User::class);
    }
    
    public function requests()
    {
        return $this->hasMany(HouseholdRequest::class);
    }
}
