<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile/details', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('profile/photo', [ProfileController::class, 'photo'])->name('profile.photo');
    Route::put('profile/password', [PasswordController::class, 'update'])->name('profile.update');
});
