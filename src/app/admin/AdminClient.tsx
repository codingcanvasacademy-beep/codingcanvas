"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type Teacher = { id: string; role: string; created_at: string; email: string };
type Invite = { email: string; created_at: string };
type ClassRequest = { id: string; parent_name: string; child_name: string; email: string; phone: string; status: string; created_at: string };
type Faq = { id: string; question: string; answer: string; created_at: string };

export default function AdminPortal() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [requests, setRequests] = useState<ClassRequest[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInjecting, setIsInjecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const loadDashboardData = useCallback(async () => {
    // 1. Fetch Teachers (via RPC)
    const { data: teacherData } = await supabase.rpc("admin_get_teachers");
    setTeachers(teacherData || []);

    // 2. Fetch Invites
    const { data: inviteData } = await supabase.from("teacher_invites").select("*");
    setInvites(inviteData || []);

    // 3. Fetch Free Class Requests
    const { data: requestData } = await supabase
      .from("free_class_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests(requestData || []);

    // 4. Fetch AI FAQs
    const { data: faqData } = await supabase
      .from("ai_faqs")
      .select("*")
      .order("created_at", { ascending: true });
    setFaqs(faqData || []);
  }, [supabase]);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const isAdminOnlyEnv = process.env.NEXT_PUBLIC_IS_ADMIN_ONLY === "true";

      if (!user) {
        if (isAdminOnlyEnv) {
          setIsAdmin(true);
          setIsDemoMode(true);
          setRequests([
            { id: "1", parent_name: "Demo Parent", child_name: "Demo Kid", email: "demo@example.com", phone: "1234567890", status: "pending", created_at: new Date().toISOString() }
          ]);
          setTeachers([
            { id: "t1", role: "teacher", email: "demo_teacher@codingcanvas.com", created_at: new Date().toISOString() }
          ]);
          return;
        }
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
        setIsDemoMode(false);
        loadDashboardData();
      } else {
        if (isAdminOnlyEnv) {
          setIsAdmin(true);
          setIsDemoMode(true);
        } else {
          router.push("/blocks");
        }
      }
    };
    checkAdminAccess();
  }, [router, supabase, loadDashboardData]);

  const handleInviteTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setIsInjecting(true);
    setErrorMsg("");

    const { error } = await supabase
      .from("teacher_invites")
      .insert([{ email: inviteEmail }]);

    setIsInjecting(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setInviteEmail("");
      loadDashboardData();
    }
  };

  const handleForceLogout = async (teacherId: string) => {
    const confirmLogout = window.confirm("Are you sure you want to force log out this teacher? They will be immediately disconnected.");
    if (!confirmLogout) return;

    const { error } = await supabase.rpc("admin_force_logout", { target_user_id: teacherId });
    if (error) {
      alert("Failed to force logout: " + error.message);
    } else {
      alert("Teacher forcefully logged out.");
    }
  };

  const handleDeleteInvite = async (email: string) => {
    const { error } = await supabase.from("teacher_invites").delete().eq("email", email);
    if (error) {
      alert("Failed to delete invite: " + error.message);
    } else {
      loadDashboardData();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleHostClass = async (requestId: string) => {
    await supabase.from("free_class_requests").update({ status: "contacted" }).eq("id", requestId);
    router.push(`/meeting?room=${requestId}&name=Head_Admin`);
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.trim() || !newA.trim()) return;
    setIsAddingFaq(true);
    const { error } = await supabase.from("ai_faqs").insert([{ question: newQ.trim(), answer: newA.trim() }]);
    setIsAddingFaq(false);
    if (error) {
      alert("Failed to add FAQ: " + error.message);
    } else {
      setNewQ("");
      setNewA("");
      loadDashboardData();
    }
  };

  const handleDeleteFaq = async (id: string) => {
    const { error } = await supabase.from("ai_faqs").delete().eq("id", id);
    if (!error) loadDashboardData();
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-cc-surface-base flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cc-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cc-surface-base p-6 md:p-12 font-sans text-cc-secondary">
      {isDemoMode && (
        <div className="w-full max-w-6xl mx-auto mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
             <span className="text-2xl">⚠️</span>
             <div>
               <p className="font-bold text-amber-900">Demo Mode Enabled</p>
               <p className="text-sm text-amber-700">You are seeing a preview. Sign in to manage real student requests and teachers.</p>
             </div>
          </div>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-2.5 rounded-xl bg-amber-200 text-amber-900 font-bold hover:bg-amber-300 transition-all text-sm"
          >
            Authenticate Now
          </button>
        </div>
      )}

      {/* Admin Header */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">God-Mode Portal</h1>
          <p className="text-gray-500 mt-2">{isDemoMode ? "Live Preview / Admin Tools" : "Head Admin Control Center"}</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="mt-4 md:mt-0 px-6 py-2 rounded-xl bg-white border border-gray-200 shadow-sm text-sm font-bold hover:bg-gray-50 transition-colors"
        >
          Sign Out Admin
        </button>
      </div>

      {/* Quick Utilities */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button 
          onClick={() => router.push('/blocks')}
          className="flex flex-col text-left p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center mb-3">
             <span className="text-xl">🧩</span>
          </div>
          <h3 className="text-xl font-bold text-[#006492]">Test Sandbox</h3>
          <p className="text-sm text-gray-500 font-medium">Verify the drag-and-drop mechanics and live compiler</p>
        </button>

        <button 
          onClick={() => router.push('/meeting?room=admin_lobby&name=Head_Admin')}
          className="flex flex-col text-left p-6 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-3xl shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100/50 flex items-center justify-center mb-3">
             <span className="text-xl">📹</span>
          </div>
          <h3 className="text-xl font-bold text-purple-800">Launch Quick Meeting</h3>
          <p className="text-sm text-gray-500 font-medium">Open the admin lobby virtual classroom</p>
        </button>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Teacher Management */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          
          {/* Invite Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-cc-primary/5 border border-cc-primary/10">
            <h2 className="text-xl font-bold mb-4">Grant Teacher Access</h2>
            <form onSubmit={handleInviteTeacher} className="flex flex-col gap-4">
              {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
              <input
                type="email"
                required
                placeholder="teacher@codingcanvas.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cc-primary focus:outline-none transition-colors"
              />
              <button 
                type="submit"
                disabled={isInjecting || !inviteEmail}
                className="w-full py-3 rounded-xl font-bold text-white bg-cc-primary hover:brightness-105 transition-all shadow-md"
              >
                {isInjecting ? "Authorizing..." : "Authorize Email"}
              </button>
            </form>
          </div>

          {/* Active Invites List */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Pending Invites</h2>
            {invites.length === 0 ? (
              <p className="text-gray-400 text-sm">No pending teacher auths.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {invites.map((inv) => (
                  <div key={inv.email} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium">{inv.email}</span>
                    <button 
                      onClick={() => handleDeleteInvite(inv.email)}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Teachers List */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Active Teachers</h2>
            {teachers.length === 0 ? (
              <p className="text-gray-400 text-sm">No teachers onboarded yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {teachers.map((t) => (
                  <div key={t.id} className="flex flex-col p-4 bg-gray-50 rounded-xl relative group">
                    <span className="text-sm font-bold text-cc-secondary">{t.email}</span>
                    <span className="text-xs text-gray-500">Joined: {new Date(t.created_at).toLocaleDateString()}</span>
                    
                    <div className="absolute top-0 right-0 h-full flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleForceLogout(t.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                      >
                        Force Logout
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Free Class Requests */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Free Class Requests</h2>
              <span className="px-3 py-1 bg-cc-primary-container text-cc-primary rounded-full text-sm font-bold">
                {requests.length} Total
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <div className="w-16 h-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center text-2xl">🌍</div>
                <p>No free class requests pending.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                      <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Parent Name</th>
                      <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Child Name</th>
                      <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Contact</th>
                      <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                      <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(req.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-cc-secondary whitespace-nowrap">
                          {req.parent_name}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 whitespace-nowrap">
                          {req.child_name}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          <div className="flex flex-col">
                            <span className="whitespace-nowrap">{req.email}</span>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{req.phone}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            req.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                            req.status === 'contacted' ? 'bg-blue-100 text-blue-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {req.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-right">
                          <button 
                            onClick={() => handleHostClass(req.id)}
                            className="px-4 py-2 bg-cc-primary text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-sm"
                          >
                            Host Class
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* AI Knowledge Settings */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-8">
            <h2 className="text-2xl font-bold mb-4">Custom AI Knowledge</h2>
            <p className="text-sm text-gray-500 mb-6">Train the AI Support Chat with expected host-provided Q&A so it knows exactly how to respond using your logic.</p>
            
            <form onSubmit={handleAddFaq} className="flex flex-col gap-4 bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100">
              <input
                type="text"
                required
                placeholder="Question (e.g. When do spring classes start?)"
                value={newQ}
                onChange={(e) => setNewQ(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cc-primary focus:outline-none transition-colors text-sm"
              />
              <textarea
                required
                placeholder="Exact Answer from Host (e.g. They begin March 10th!)"
                value={newA}
                onChange={(e) => setNewA(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cc-primary focus:outline-none transition-colors text-sm min-h-[80px]"
              />
              <button 
                type="submit"
                disabled={isAddingFaq || !newQ || !newA}
                className="self-end px-6 py-2 rounded-xl font-bold text-white bg-cc-primary hover:brightness-105 transition-all shadow-sm disabled:opacity-50"
              >
                {isAddingFaq ? "Injecting..." : "Inject Q&A into AI"}
              </button>
            </form>

            {/* List injected FAQs */}
            {faqs.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Injections</h3>
                {faqs.map((faq) => (
                  <div key={faq.id} className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl relative group">
                    <p className="text-sm font-bold text-cc-secondary mb-1">Q: {faq.question}</p>
                    <p className="text-sm text-gray-600">A: {faq.answer}</p>
                    <button 
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all font-bold text-xs"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
