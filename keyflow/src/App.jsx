import { useState, useEffect } from 'react';
import { api } from './api';
import { Trash2, Users, ShieldCheck, UserPlus, LogIn } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('login'); // login, admin
  const [isSignup, setIsSignup] = useState(false); // สลับหน้า Login/Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);

  // ฟังก์ชันจัดการตอนกดปุ่ม (ทั้ง Signup และ Login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSignup) {
      // --- ส่วนของ Signup ---
      const res = await api.signup({ email, password });
      if (res.message) {
        alert('สมัครสมาชิกสำเร็จ! ลองเข้าสู่ระบบดูครับ');
        setIsSignup(false); // สมัครเสร็จให้เด้งกลับไปหน้า Login
      } else {
        alert('สมัครสมาชิกไม่สำเร็จ: ' + (res.error || 'ลองใหม่อีกครั้ง'));
      }
    } else {
      // --- ส่วนของ Login ---
      const res = await api.login({ email, password });
      if (res.token) {
        const allUsers = await api.getUsers();
        setUsers(allUsers);
        setView('admin');
      } else {
        alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    }
  };

  const handleDelete = async (id) => {
    if(confirm('ต้องการลบผู้ใช้นี้ใช่ไหม?')) {
      await api.deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        {view === 'login' ? (
          /* --- หน้า Login / Signup --- */
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-sm mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="text-blue-600"/> 
              {isSignup ? 'Create Account' : 'SysAuth Login'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-3 rounded-lg border border-slate-300 outline-blue-500" 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full p-3 rounded-lg border border-slate-300 outline-blue-500" 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center gap-2 transition-all">
                {isSignup ? <><UserPlus size={18}/> สมัครสมาชิก</> : <><LogIn size={18}/> เข้าสู่ระบบ</>}
              </button>
            </form>

            {/* ปุ่มสลับโหมด Signup / Login */}
            <p className="text-center mt-6 text-sm text-slate-500">
              {isSignup ? "มีบัญชีอยู่แล้ว?" : "ยังไม่มีบัญชี?"} 
              <span 
                onClick={() => setIsSignup(!isSignup)} 
                className="text-blue-600 cursor-pointer ml-1 font-semibold hover:underline"
              >
                {isSignup ? "เข้าสู่ระบบที่นี่" : "สร้างบัญชีใหม่ที่นี่"}
              </span>
            </p>
          </div>
        ) : (
          /* --- หน้า Admin (Dashboard) --- */
          <div className="space-y-6 animate-in fade-in duration-500">
            <header className="relative z-50 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="text-blue-600" /> Admin Management
              </h2>
              <button 
                onClick={() => setView('login')} 
                className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </header>

            <div className="grid gap-4">
              {users.length > 0 ? users.map(user => (
                <div key={user._id} className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center hover:shadow-md transition-all">
                  <div>
                    <p className="font-semibold text-lg text-slate-800">{user.email}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded uppercase font-bold tracking-wider border border-blue-100">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(user._id)} 
                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Delete User"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )) : (
                <p className="text-center text-slate-400 py-10">ยังไม่มีข้อมูลผู้ใช้งานในระบบ</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}