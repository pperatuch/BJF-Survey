<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // ตรวจสอบว่าผู้ใช้งานเข้าสู่ระบบแล้ว และมี Role เป็นแอดมิน
        if (! $user || ! in_array($user->role, ['admin', 'super_admin'])) {
            return response()->json([
                'message' => 'ขออภัย คุณไม่มีสิทธิ์เข้าถึงส่วนงานนี้',
            ], 403);
        }

        return $next($request);
    }
}
