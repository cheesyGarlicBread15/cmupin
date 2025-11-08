<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('household_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('household_id')->nullable(); // null for "create" requests
            $table->enum('type', ['create', 'join']);
            $table->enum('status', ['pending', 'approved', 'denied'])->default('pending');
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'household_id']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('household_requests');
    }
};
