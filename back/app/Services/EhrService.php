<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EhrService
{
    protected string $baseUrl;

    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.ehr.url');
        $this->apiKey = config('services.ehr.key', '');
    }

    /**
     * Authenticate with external EHR API
     */
    public function login(string $empno, string $password): array
    {
        try {
            $response = Http::withHeaders([
                'X-API-Key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])
                ->when(app()->environment('local'), fn ($h) => $h->withoutVerifying())
                ->post("{$this->baseUrl}/api/v1/auth/login", [
                    'empno' => $empno,
                    'password' => $password,
                ]);

            if ($response->failed()) {
                Log::warning("EHR Login failed for user: {$empno}. Status: {$response->status()}");

                return [
                    'success' => false,
                    'message' => $response->json('message') ?? $response->json('error.message.th') ?? 'Authentication failed',
                    'status' => $response->status(),
                ];
            }

            return [
                'success' => true,
                'data' => $response->json(),
            ];
        } catch (\Exception $e) {
            Log::error('EHR Login Exception: '.$e->getMessage());

            return [
                'success' => false,
                'message' => 'Cannot connect to EHR server',
                'status' => 500,
            ];
        }
    }

    /**
     * Get user profile details using the external EHR token
     */
    public function fetchProfile(string $externalToken): ?array
    {
        try {
            $response = Http::withHeaders([
                'X-API-Key' => $this->apiKey,
                'Authorization' => "Bearer {$externalToken}",
                'Content-Type' => 'application/json',
            ])
                ->when(app()->environment('local'), fn ($h) => $h->withoutVerifying())
                ->post("{$this->baseUrl}/api/v1/auth/me", []);

            if ($response->successful()) {
                $data = $response->json();

                return $data['data'] ?? $data;
            }

            Log::warning("EHR Fetch Profile failed. Status: {$response->status()}");

            return null;
        } catch (\Exception $e) {
            Log::error('EHR Fetch Profile Exception: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Get employee data by empno from EHR API using Bearer Token
     */
    public function fetchProfileWithToken(string $externalToken, string $empNo): ?array
    {
        try {
            $response = Http::withHeaders([
                'X-API-Key' => $this->apiKey,
                'Authorization' => "Bearer {$externalToken}",
                'Content-Type' => 'application/json',
            ])
                ->when(app()->environment('local'), fn ($h) => $h->withoutVerifying())
                ->post("{$this->baseUrl}/api/v1/employees/profile", [
                    'empno' => $empNo,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                return $data['data'] ?? $data;
            }

            Log::warning("EHR Profile lookup failed for {$empNo}. Status: {$response->status()}");

            return null;
        } catch (\Exception $e) {
            Log::error('EHR Profile lookup Exception: '.$e->getMessage());

            return null;
        }
    }
}
