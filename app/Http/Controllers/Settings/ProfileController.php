<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Member;
use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('profile', [
            'status' => $request->session()->get('status'),
            'error' => $request->session()->get('error'),
        ]);
    }

    /**
     * Update the user's details.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {

            $validated = $request->validated();

            DB::beginTransaction();
            
            Auth::user()->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'contact' => $validated['contact'],
            ]);

            Member::where('id', Auth::user()->member_id)
                ->update([
                    'contact' => $validated['contact'],
                    'date_of_birth' => Carbon::parse($validated['date_of_birth'])->format('Y-m-d'),
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                ]);

            DB::commit();
    
            return to_route('profile.edit')->with('status', 'Profile details updated successfully.');

        } catch (\Exception $e) {
            Log::error('Error updating profile photo: ' . $e->getMessage());
            DB::rollBack();
            return redirect()->back()->with([
                'error' => 'An error occurred while updating the profile photo. Please try again.',
            ]);
            // return back()->with('error', 'An error occurred while updating the profile photo. Please try again.');
        }
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'old_password' => ['required', 'current_password'],
            'new_password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = $request->user();

        if ($request->new_password === $request->old_password) {
            throw ValidationException::withMessages(['new_password' => 'New matches the old password']);
        }

        // $user->update(['password' => bcrypt($request->new_password)]);

        return to_route('profile.edit')->with('status', 'Password updated successfully.');
    }

    /**
     * Update the user's profile avatar.
     */
    public function photo(Request $request): RedirectResponse
    {
        try {

            $request->validate([
                'photo' => ['required', 'image', 'max:2048'],
            ]);
    
            $photoPath = $request->file('photo')->store('member/photos', 'public');
            Member::where('id', $request->user()->member_id)
                ->update(['photo' => $photoPath]);
    
            return to_route('profile.edit')->with('status', 'Profile photo updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating profile photo: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while updating the profile photo. Please try again.');
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
