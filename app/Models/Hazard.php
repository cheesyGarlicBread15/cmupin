<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hazard extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'hazard_type_id',
        'title',
        'description',
        'latitude',
        'longitude',
        'severity',
        'status',
        'media_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hazardType()
    {
        return $this->belongsTo(HazardType::class, 'hazard_type_id');
    }
}
