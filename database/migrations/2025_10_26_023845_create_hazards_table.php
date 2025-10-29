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
        Schema::create('hazards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('hazard_type_id')->constrained('hazard_types')->onDelete('restrict');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->tinyInteger('severity')->default(3); // 1-5
            $table->enum('status', ['open', 'resolved'])->default('open');
            $table->string('media_path')->nullable();
            $table->timestamps();

            $table->index(['latitude','longitude']);
            $table->index('status');
            $table->index('severity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hazards');
    }
};
