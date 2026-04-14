<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'is_completed',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function sharedWith()
    {
        return $this->belongsToMany(User::class, 'task_user')
            ->withPivot('permission')
            ->withTimestamps();
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_task');
    }

    public function activities()
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function hasAccess($userId)
    {
        return $this->user_id === $userId ||
               $this->sharedWith()->where('user_id', $userId)->exists();
    }

    public function getPermissionForUser($userId)
    {
        if ($this->user_id === $userId) {
            return 'edit';
        }

        $share = $this->sharedWith()->where('user_id', $userId)->first();

        return $share ? $share->pivot->permission : null;
    }
}
