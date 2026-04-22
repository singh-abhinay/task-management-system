<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\API\AuthController;

Route::get('/', function () {
    return Inertia::render('Homepage');
});

Route::middleware(['guest'])->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Login');
    })->name('login');

    Route::get('/register', function () {
        return Inertia::render('Register');
    });
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/tasks', function () {
        return Inertia::render('Tasks/Index');
    })->name('tasks');

    Route::get('/tasks/create', function () {
        return Inertia::render('Tasks/Create');
    })->name('tasks.create');

    Route::get('/profile', function () {
        return Inertia::render('Profile');
    })->name('profile');
});