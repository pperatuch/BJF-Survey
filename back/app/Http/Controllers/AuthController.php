<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Services\EhrService;
use App\Services\JwtAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    protected EhrService $ehrService;

    public function __construct(EhrService $ehrService)
    {
        $this->ehrService = $ehrService;
    }

    /**
     * Authenticate Admin User (using admins table with ZERO local personal data storage)
     */
    public function login(Request $request)
    {
        $request->validate([
            'empno' => 'required|string',
            'password' => 'required|string',
        ]);

        $empno = $request->input('empno');
        $password = $request->input('password');

        // 1. Authenticate with external EHR service
        $loginResult = $this->ehrService->login($empno, $password);

        if (! $loginResult['success']) {
            $statusCode = $loginResult['status'] == 401 ? 400 : $loginResult['status'];

            return response()->json([
                'message' => $loginResult['message'],
            ], $statusCode);
        }

        $loginData = $loginResult['data'];
        $externalToken = $loginData['data']['token'] ?? $loginData['token'] ?? null;

        if (! $externalToken) {
            return response()->json([
                'message' => 'Invalid response from authentication server',
            ], 500);
        }

        // 2. Fetch full user profile from EHR /me
        $profile = $this->ehrService->fetchProfile($externalToken);
        if (! $profile) {
            return response()->json([
                'message' => 'Failed to fetch user profile',
            ], 500);
        }

        // Identify employee ID from profile
        $employeeId = $profile['employee_no'] ?? $profile['employee_id'] ?? $profile['emp_id'] ?? $empno;

        $name = $profile['name_en'] ?? $profile['name_th'] ?? null;

        if (! $name) {
            return response()->json([
                'message' => 'ไม่พบข้อมูลโปรไฟล์ของคุณในระบบ (Profile incomplete)',
            ], 403);
        }

        // 3. Find admin record in the 'admins' table
        $admin = Admin::where('employee_id', $employeeId)->first();

        if (! $admin) {
            Log::warning("Unauthorized admin login attempt. Employee ID: {$employeeId}");

            return response()->json([
                'message' => 'ขออภัย คุณไม่มีสิทธิ์เข้าใช้งานระบบผู้ดูแลระบบ (Admin Panel)',
            ], 403);
        }

        // 4. Cache the external EHR token for subsequent profile requests (lasts 1 day)
        Cache::put("ehr_token_{$admin->id}", $externalToken, now()->addDay());

        // 5. Generate stateless JWT Token (Zero database token storage)
        $token = JwtAuthService::generateToken([
            'sub' => $admin->id,
            'employee_id' => $admin->employee_id,
            'role' => $admin->role,
        ], 86400 * 7); // 7 days

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $admin->id,
                'employee_id' => $admin->employee_id,
                'role' => $admin->role,
                // Return EHR info directly in login response (Frontend will display it)
                'name' => $name,
                'email' => $profile['email'] ?? '',
                'position' => $profile['position_title'] ?? '',
                'company' => $profile['company_code'] ?? '',
                'avatar' => $profile['avatar'] ?? '',
            ],
        ]);
    }

    /**
     * Get Current Authenticated Admin profile (fetches personal data dynamically from EHR API)
     */
    public function me(Request $request)
    {
        $admin = $request->user(); // App\Models\Admin

        // Retrieve external EHR token from Cache
        $externalToken = Cache::get("ehr_token_{$admin->id}");
        $profile = null;

        if ($externalToken) {
            // Fetch full profile dynamically from EHR using employee ID and token
            $profile = $this->ehrService->fetchProfileWithToken($externalToken, $admin->employee_id);
        }

        $name = $profile['name_en'] ?? $profile['name_th'] ?? null;

        if (! $name) {
            Cache::forget("ehr_token_{$admin->id}");

            return response()->json([
                'message' => 'ข้อมูลโปรไฟล์ไม่สมบูรณ์ กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $admin->id,
                'employee_id' => $admin->employee_id,
                'role' => $admin->role,
                // Merged dynamic EHR profile details (not stored locally)
                'name' => $name,
                'email' => $profile['email'] ?? '',
                'position' => $profile['position_title'] ?? '',
                'company' => $profile['company_code'] ?? '',
                'avatar' => $profile['avatar'] ?? '',
            ],
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $admin = $request->user();
        if ($admin) {
            Cache::forget("ehr_token_{$admin->id}");
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }
}

