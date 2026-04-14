<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name', 'email', 'password',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function ownTasks()
    {
        return $this->hasMany(Task::class, 'user_id');
    }

    public function sharedTasks()
    {
        return $this->belongsToMany(Task::class, 'task_user')
            ->withPivot('permission')
            ->withTimestamps();
    }

    public function allAccessibleTasks()
    {
        $ownTasks = $this->ownTasks;
        $sharedTasks = $this->sharedTasks;

        return $ownTasks->concat($sharedTasks);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function activities()
    {
        return $this->hasMany(ActivityLog::class);
    }
}
