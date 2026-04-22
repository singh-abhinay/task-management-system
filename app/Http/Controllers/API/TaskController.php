<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get per_page from request, default to 10
        $perPage = (int) $request->get('per_page', 10);

        // Get task IDs from both own tasks and shared tasks
        $ownTaskIds = Task::where('user_id', $user->id)->pluck('id');

        $sharedTaskIds = Task::whereHas('sharedWith', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->pluck('id');

        // Merge unique task IDs
        $taskIds = $ownTaskIds->merge($sharedTaskIds)->unique();

        // Build query with filters
        $query = Task::whereIn('id', $taskIds);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        // Apply completion status filter
        if ($request->has('is_completed') && $request->is_completed !== null && $request->is_completed !== '') {
            $query->where('is_completed', $request->is_completed);
        }

        // Order by created_at descending and paginate
        $tasks = $query->orderByDesc('created_at')->paginate($perPage);

        // Add permission to each task
        $tasks->getCollection()->transform(function ($task) use ($user) {
            $task->permission = $task->getPermissionForUser($user->id);
            return $task;
        });

        // Return the paginator directly - Laravel will handle the JSON structure
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'categories' => 'array|exists:categories,id',
        ]);

        $task = Task::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'is_completed' => false,
        ]);

        if ($request->has('categories')) {
            $task->categories()->sync($request->categories);
        }

        ActivityLog::log(
            $request->user()->id,
            $task->id,
            'created',
            "Task '{$task->title}' created"
        );

        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        $user = $request->user();
        $permission = $task->getPermissionForUser($user->id);

        if ($permission !== 'edit') {
            return response()->json([
                'message' => 'You dont have permission to edit this task',
            ], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'boolean',
            'categories' => 'array|exists:categories,id',
        ]);

        $task->update($request->only(['title', 'description', 'is_completed']));

        if ($request->has('categories')) {
            $task->categories()->sync($request->categories);
        }

        ActivityLog::log(
            $user->id,
            $task->id,
            'updated',
            "Task '{$task->title}' updated"
        );

        return response()->json($task);
    }

    public function share(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Only task owner can share',
            ], 403);
        }

        $request->validate([
            'email' => 'required|email|exists:users,email',
            'permission' => 'required|in:view,edit',
        ]);

        $userToShare = User::where('email', $request->email)->first();

        if ($task->sharedWith()->where('user_id', $userToShare->id)->exists()) {
            return response()->json([
                'message' => 'Task already shared with this user',
            ], 400);
        }

        $task->sharedWith()->attach($userToShare->id, [
            'permission' => $request->permission,
        ]);

        ActivityLog::log(
            $request->user()->id,
            $task->id,
            'shared',
            "Task shared with {$userToShare->email} with {$request->permission} permission"
        );

        return response()->json([
            'message' => 'Task shared successfully',
        ]);
    }

    public function activity(Task $task)
    {
        $activities = $task->activities()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($activities);
    }

    public function destroy(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Only task owner can delete',
            ], 403);
        }

        ActivityLog::log(
            $request->user()->id,
            $task->id,
            'deleted',
            "Task '{$task->title}' deleted"
        );

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully',
        ]);
    }
}
