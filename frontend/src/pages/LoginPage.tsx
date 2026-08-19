import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/store/useAuthStore"

// AD Login validation schema
const adLoginSchema = z.object({
  username: z.string().min(1, { message: "กรุณากรอก Username หรือรหัสพนักงาน" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
  rememberMe: z.boolean().optional(),
})

type ADLoginFormValues = z.infer<typeof adLoginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ADLoginFormValues>({
    resolver: zodResolver(adLoginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    }
  })

  const handleADSubmit = async (data: ADLoginFormValues) => {
    setLoading(true)
    setErrorMsg(null)

    try {
      await login(data.username, data.password)
      // Successful login, redirect to admin responses dashboard
      navigate("/responses")
    } catch (error: any) {

      console.error("Login Error:", error)
      const msg = error.response?.data?.message || error.message || "Invalid credentials. Please try again."
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleMicrosoftLogin = () => {
    setErrorMsg("ฟังก์ชัน Sign in with Microsoft ยังไม่พร้อมใช้งานในระบบนี้")
  }

  return (
    <main className="min-h-screen flex bg-[#F4F7F6] font-sans relative items-center justify-center overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-[#0B3C5D]/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00A651]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Page Alert */}
      {errorMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md p-4 bg-white/90 backdrop-blur-md border border-rose-100 shadow-xl rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-8 fade-in duration-300">
          <div className="bg-rose-50 p-2 rounded-full shrink-0">
            <AlertCircle className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-sm font-semibold text-[#0B3C5D]">{errorMsg}</span>
        </div>
      )}

      {/* Login Cards */}
      <section className="w-full flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-[420px]">
          <img
            src={`${import.meta.env.BASE_URL}Logo.png`}
            alt="logo"
            className="mx-auto mb-6 hover:scale-105 transition-transform duration-500 max-h-[72px] object-contain drop-shadow-sm"
          />

          <Card className="ring-0 shadow-2xl bg-white/80 backdrop-blur-lg overflow-hidden rounded-2xl flex flex-col p-3">
            <CardHeader className="space-y-1 pb-3 pt-4">
              <CardTitle className="text-2xl font-black tracking-tight text-[#0B3C5D] text-center">
                Sign In
              </CardTitle>
              <CardDescription className="text-gray-400 font-medium text-center text-xs">
                Choose your preferred login method below
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
              <div className="w-full space-y-4">
                {/* Active Directory Form */}
                <form onSubmit={handleSubmit(handleADSubmit)} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-xs font-bold text-[#0B3C5D] ml-1">
                      Employee Number
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black group-focus-within:text-[#00A651] transition-colors" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="e.g. 123456"
                        className="pl-10 h-10 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-sm text-[#0B3C5D] font-medium focus:outline-none focus:ring-2 focus:ring-[#00A651]/30 focus:border-[#00A651] shadow-sm transition-all"
                        disabled={loading}
                        {...register("username")}
                      />
                    </div>
                    <div className="h-4 ml-1">
                      {errors.username && (
                        <p className="text-[10px] font-semibold text-rose-500">{errors.username.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1 mr-1">
                      <Label htmlFor="password" className="text-xs font-bold text-[#0B3C5D]">
                        Password
                      </Label>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black group-focus-within:text-[#00A651] transition-colors" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-10 bg-white/60 backdrop-blur-md border border-white/80 rounded-full text-sm text-[#0B3C5D] font-medium focus:outline-none focus:ring-2 focus:ring-[#00A651]/30 focus:border-[#00A651] shadow-sm transition-all"
                        disabled={loading}
                        {...register("password")}
                      />
                    </div>
                    <div className="flex justify-between items-start h-4 ml-1 mr-1 mt-1">
                      <div>
                        {errors.password && (
                          <p className="text-[10px] font-semibold text-rose-500">{errors.password.message}</p>
                        )}
                      </div>
                      <button type="button" onClick={() => setErrorMsg("กรุณาติดต่อ HRIS Team")} className="text-[10px] font-bold text-[#00A651] hover:text-[#008f45] transition-colors bg-transparent border-none p-0 cursor-pointer">
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 mt-2 bg-gradient-to-r from-[#00A651] to-[#008f45] hover:opacity-90 text-white font-bold rounded-full shadow-[0_4px_14px_rgba(0,166,81,0.3)] transition-all cursor-pointer text-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4 text-white" />
                        <span>Signing In...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign In with AD <ArrowRight className="w-4 h-4 opacity-80" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200/60" />
                  </div>
                  <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="bg-[#fcfdfd] px-3 text-gray-400 rounded-full">Or continue with</span>
                  </div>
                </div>

                {/* Microsoft Account SSO */}
                <div className="text-center">
                  <Button
                    type="button"
                    onClick={handleMicrosoftLogin}
                    variant="outline"
                    className="w-full h-10 border border-gray-200/80 bg-white/80 hover:bg-white hover:shadow-sm text-[#0B3C5D] font-bold rounded-full flex items-center justify-center gap-2.5 transition-all cursor-pointer text-sm"
                    disabled={loading}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0H10.8571V10.8571H0V0Z" fill="#F25022" />
                      <path d="M12.1429 0H23V10.8571H12.1429V0Z" fill="#7FBA00" />
                      <path d="M0 12.1429H10.8571V23H0V12.1429Z" fill="#00A1F1" />
                      <path d="M12.1429 12.1429H23V23H12.1429V12.1429Z" fill="#FFB900" />
                    </svg>
                    <span>Sign in with Microsoft</span>
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-white/40 border-t border-white/50 px-6 py-4 flex justify-between items-center text-xs text-gray-500 font-medium">
              <span>Need login assistance?</span>
              <button type="button" onClick={() => setErrorMsg("กรุณาติดต่อ HRIS Team")} className="text-[#00A651] font-bold hover:text-[#008f45] transition-colors bg-transparent border-none p-0 cursor-pointer">
                Contact HRIS
              </button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  )
}
