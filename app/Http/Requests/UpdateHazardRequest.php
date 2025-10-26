<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHazardRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user() != null;
    }

    public function rules()
    {
        return [
            'title' => 'sometimes|string|max:120',
            'description' => 'sometimes|nullable|string|max:2000',
            'severity' => 'sometimes|integer|min:1|max:5',
            'status' => 'sometimes|in:open,resolved',
            'media' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
        ];
    }
}
