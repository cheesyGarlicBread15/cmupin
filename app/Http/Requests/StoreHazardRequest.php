<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHazardRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user() != null;
    }

    public function rules()
    {
        return [
            'title' => 'nullable|string|max:120',
            'description' => 'nullable|string|max:2000',
            'hazard_type_id' => 'required|exists:hazard_types,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'severity' => 'required|integer|min:1|max:5',
            'media' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
        ];
    }
}
