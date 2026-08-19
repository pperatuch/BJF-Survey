<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use App\Services\JwtAuthService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuthenticate
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = null;
        $header = $request->header('Authorization', '');
        if (str_starts_with($header, 'Bearer ')) {
            $token = substr($header, 7);
        } elseif ($request->query('token')) {
            $token = $request->query('token');
        }

        if (!$token) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $payload = JwtAuthService::verifyToken($token);


        if (!$payload || !isset($payload['sub'])) {
            return response()->json([
                'message' => 'Token ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่',
            ], 401);
        }

        $admin = Admin::find($payload['sub']);
        if (!$admin) {
            return response()->json([
                'message' => 'ไม่พบข้อมูลผู้ดูแลระบบ',
            ], 401);
        }

        // Bind authenticated admin model to request
        $request->setUserResolver(fn () => $admin);

        return $next($request);
    }
}
