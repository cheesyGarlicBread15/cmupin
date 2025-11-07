<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HazardType extends Model
{
    protected $fillable = ['key', 'name', 'color'];
}
