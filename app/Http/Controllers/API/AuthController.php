<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AuthController
{
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|min:2|max:255',
                'email' => 'required|email|unique:users|max:255',
                'password' => 'required|min:6|confirmed',
                'password_confirmation' => 'required'
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            Auth::login($user);

            return response()->json([
                'success' => true,
                'user' => $user,
                'message' => 'Registration successful',
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
                'message' => 'Validation failed'
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Please try again.'
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (!Auth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'errors' => [
                        'email' => ['Invalid credentials']
                    ],
                    'message' => 'Login failed'
                ], 422);
            }

            $request->session()->regenerate();

            return response()->json([
                'success' => true,
                'user' => Auth::user(),
                'message' => 'Login successful',
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
                'message' => 'Validation failed'
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Please try again.'
            ], 500);
        }
    }

    public function me(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not authenticated'
                ], 401);
            }
            
            return response()->json([
                'success' => true,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong'
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }
            
            $rules = [];
            $messages = [
                'name.required' => 'Name is required',
                'name.min' => 'Name must be at least 2 characters',
                'name.max' => 'Name cannot exceed 255 characters',
                'email.required' => 'Email is required',
                'email.email' => 'Please enter a valid email address',
                'email.unique' => 'This email is already taken',
                'current_password.required' => 'Current password is required',
                'current_password.current_password' => 'Current password is incorrect',
                'new_password.required' => 'New password is required',
                'new_password.min' => 'New password must be at least 6 characters',
                'new_password.confirmed' => 'Password confirmation does not match',
            ];
            
            // Validate name if provided
            if ($request->has('name')) {
                $rules['name'] = 'required|string|min:2|max:255';
            }
            
            // Validate email if provided and changed
            if ($request->has('email') && $request->email !== $user->email) {
                $rules['email'] = [
                    'required',
                    'email',
                    Rule::unique('users')->ignore($user->id),
                ];
            }
            
            // Validate password if provided
            if ($request->filled('new_password') || $request->filled('current_password')) {
                $rules['current_password'] = 'required|current_password';
                $rules['new_password'] = 'required|min:6|confirmed';
            }
            
            // If no data to update
            if (empty($rules)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No changes to update'
                ], 422);
            }
            
            // Validate the request
            $validated = $request->validate($rules, $messages);
            
            // Update only the fields that were provided
            if ($request->has('name')) {
                $user->name = $validated['name'];
            }
            
            if ($request->has('email') && $request->email !== $user->email) {
                $user->email = $validated['email'];
            }
            
            if ($request->filled('new_password')) {
                $user->password = Hash::make($validated['new_password']);
            }
            
            $user->save();
            
            return response()->json([
                'success' => true,
                'user' => $user,
                'message' => 'Profile updated successfully'
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
                'message' => 'Validation failed'
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Please try again.'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed'
            ], 500);
        }
    }
}