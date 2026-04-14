<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'task_id',
        'action',
        'description',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function log($userId, $taskId, $action, $description = null)
    {
        return self::create([
            'user_id' => $userId,
            'task_id' => $taskId,
            'action' => $action,
            'description' => $description ?? "Task {$action} successfully",
        ]);
    }
}
