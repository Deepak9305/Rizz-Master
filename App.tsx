
import React, { useState, useRef, useEffect } from 'react';
import { generateRizz, generateBio } from './services/rizzService';
import { InputMode, RizzResponse, BioResponse, SavedItem, UserProfile } from './types';
import { supabase } from './services/supabaseClient';
import { Native } from './services/nativeFeatures'; 
import { Capacitor } from '@capacitor/core';
import { AdMob, RewardAdPluginEvents, AdMobRewardItem } from '@capacitor-community/admob';

import Logo from './components/Logo'; // New Import
import RizzCard from './components/RizzCard';
import LoginPage from './components/LoginPage';
import Footer from './components/Footer';
import PremiumModal from './components/PremiumModal';
import SavedModal from './components/SavedModal';
import SplashScreen from './components/SplashScreen';
import SettingsModal from './components/SettingsModal';
import ReportModal from './components/ReportModal'; // New Import

// --- ADMOB CONFIGURATION ---
const ADMOB_REWARDED_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX'; 

const DAILY_CREDITS = 5;
const REWARD_CREDITS = 3;

const App: React.FC = () => {
  // UI State
  const [showSplash, setShowSplash] = useState(true);

  // Auth State
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);

  // App State
  const [mode, setMode] = useState<InputMode>(InputMode.CHAT);
  const [inputText, setInputText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RizzResponse | BioResponse | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals & Flags
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false); // New Flag
  const [reportContent, setReportContent] = useState<string | undefined>(undefined); // New State
  
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isSessionBlocked, setIsSessionBlocked] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  // 1. Initialize Native Features & Session
  useEffect(() => {
    Native.initialize();
    
    if (Capacitor.isNativePlatform()) {
       AdMob.initialize({ requestTrackingAuthorization: true }).catch(err => console.error('AdMob init failed', err));
    }

    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadUserData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserData(session.user.id);
      } else {
        setProfile(null);
        setSavedItems([]);
        setDbError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Broadcast Channel
  useEffect(() => {
    const channel = new BroadcastChannel('rizz_session_sync');
    channel.postMessage({ type: 'NEW_SESSION_STARTED' });
    channel.onmessage = (event) => {
      if (event.data.type === 'NEW_SESSION_STARTED') setIsSessionBlocked(true);
    };
    return () => channel.close();
  }, []);

  // 3. Load User Data
  const loadUserData = async (userId: string) => {
    if (!supabase) {
        const storedProfile = localStorage.getItem('guest_profile');
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
        } else {
            const newProfile = { id: 'guest', email: 'guest@rizzmaster.ai', credits: DAILY_CREDITS, is_premium: false, last_daily_reset: new Date().toISOString().split('T')[0] };
            setProfile(newProfile);
            localStorage.setItem('guest_profile', JSON.stringify(newProfile));
        }
        const storedItems = localStorage.getItem('guest_saved_items');
        setSavedItems(storedItems ? JSON.parse(storedItems) : []);
        return;
    }

    setDbError(null);
    let { data: profileData, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (error) {
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase.from('profiles').insert([{ id: userId, email: session?.user.email }]).select().single();
        if (!createError) profileData = newProfile;
        else { console.error("Error creating profile:", createError); setDbError("Failed to create user profile."); }
      } else {
        console.error("Error loading profile:", error);
        setDbError(`Database Error: ${error.message}`);
      }
    } else if (profileData) {
      const today = new Date().toISOString().split('T')[0];
      if (profileData.last_daily_reset !== today) {
        const { data: updated } = await supabase.from('profiles').update({ credits: DAILY_CREDITS, last_daily_reset: today }).eq('id', userId).select().single();
        if (updated) profileData = updated;
      }
    }
    setProfile(profileData);

    const { data: savedData, error: savedError } = await supabase.from('saved_items').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (!savedError && savedData) setSavedItems(savedData);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null); setProfile(null); setResult(null); setInputText(''); setImage(null); setInputError(null); setShowSettingsModal(false);
  };

  const handleDeleteAccount = async () => {
    if (!profile) return;
    if (!supabase) { localStorage.removeItem('guest_profile'); localStorage.removeItem('guest_saved_items'); window.location.reload(); return; }
    try {
        setLoading(true);
        await supabase.from('saved_items').delete().eq('user_id', profile.id);
        await supabase.from('profiles').delete().eq('id', profile.id);
        await handleLogout();
        alert("Your account data has been deleted.");
    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete account.");
        setLoading(false);
    }
  };

  const handleGuestLogin = () => {
      Native.hapticSuccess();
      const guestUser = { id: 'guest', email: 'guest@rizzmaster.ai' };
      setSession({ user: guestUser });
      loadUserData(guestUser.id);
  };

  const updateCredits = async (newAmount: number) => {
    if (!profile) return;
    const updatedProfile = { ...profile, credits: newAmount };
    setProfile(updatedProfile);
    if (supabase) await supabase.from('profiles').update({ credits: newAmount }).eq('id', profile.id);
    else localStorage.setItem('guest_profile', JSON.stringify(updatedProfile));
  };

  const handleUpgrade = async () => {
    if (!profile) return;
    Native.hapticSuccess();
    const updatedProfile = { ...profile, is_premium: true };
    setProfile(updatedProfile);
    setShowPremiumModal(false);
    alert('Welcome to the Elite Club! 👑');
    if (supabase) await supabase.from('profiles').update({ is_premium: true }).eq('id', profile.id);
    else localStorage.setItem('guest_profile', JSON.stringify(updatedProfile));
  };

  const toggleSave = async (content: string, type: 'tease' | 'smooth' | 'chaotic' | 'bio') => {
    Native.hapticMedium();
    if (!profile) return;
    const exists = savedItems.find(item => item.content === content);
    if (exists) {
      if (supabase) await supabase.from('saved_items').delete().eq('id', exists.id);
      const newItems = savedItems.filter(item => item.id !== exists.id);
      setSavedItems(newItems);
      if (!supabase) localStorage.setItem('guest_saved_items', JSON.stringify(newItems));
    } else {
      const newItem: SavedItem = { id: crypto.randomUUID(), user_id: profile.id, content, type, created_at: new Date().toISOString() };
      if (supabase) {
        const { data } = await supabase.from('saved_items').insert([{ user_id: profile.id, content, type }]).select().single();
        if (data) newItem.id = data.id;
      }
      const newItems = [newItem, ...savedItems];
      setSavedItems(newItems);
      if (!supabase) localStorage.setItem('guest_saved_items', JSON.stringify(newItems));
    }
  };

  const handleDeleteSaved = async (id: string) => {
    Native.hapticLight();
    if (supabase) await supabase.from('saved_items').delete().eq('id', id);
    const newItems = savedItems.filter(item => item.id !== id);
    setSavedItems(newItems);
    if (!supabase) localStorage.setItem('guest_saved_items', JSON.stringify(newItems));
  };

  // --- New Handler for Reporting ---
  const handleReport = (content?: string) => {
    Native.hapticLight();
    setReportContent(content);
    setShowReportModal(true);
  };

  const handleReclaimSession = () => {
    setIsSessionBlocked(false);
    const channel = new BroadcastChannel('rizz_session_sync');
    channel.postMessage({ type: 'NEW_SESSION_STARTED' });
    channel.close();
  };

  const handleShare = async (content: string) => {
    Native.hapticLight();
    Native.share('Rizz Master Reply', content);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Native.hapticLight();
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      if (inputError) setInputError(null);
    }
  };

  const handleGenerate = async () => {
    if (!profile) return;
    if (mode === InputMode.CHAT && !inputText.trim() && !image) { setInputError("Give me some context!"); Native.hapticLight(); return; }
    if (mode === InputMode.BIO && !inputText.trim()) { setInputError("I can't write a bio for a ghost!"); Native.hapticLight(); return; }
    setInputError(null);

    const cost = (mode === InputMode.CHAT && image) ? 2 : 1;
    if (!profile.is_premium && profile.credits < cost) {
      if (profile.credits > 0) alert(`Cost: ${cost} credits. You have ${profile.credits}.`);
      setShowPremiumModal(true);
      return;
    }

    Native.hapticMedium();
    setLoading(true);
    try {
      if (!profile.is_premium) {
        updateCredits(profile.credits - cost);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (mode === InputMode.CHAT) {
        const res = await generateRizz(inputText, image || undefined);
        setResult(res);
      } else {
        const res = await generateBio(inputText);
        setResult(res);
      }
      Native.hapticSuccess();
      
      const newCount = interactionCount + 1;
      setInteractionCount(newCount);
      if (newCount % 3 === 0) {
        Native.requestReview();
      }

    } catch (error) {
      console.error(error);
      alert('Error generating. Try again.');
      if (!profile.is_premium) updateCredits(profile.credits + cost);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchAd = async () => {
    setShowPremiumModal(false);
    if (Capacitor.isNativePlatform()) {
        try {
            setLoading(true); 
            await AdMob.prepareRewardVideoAd({ adId: ADMOB_REWARDED_ID });
            const onReward = AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
                updateCredits((profile?.credits || 0) + REWARD_CREDITS);
                Native.hapticSuccess();
                alert(`+${REWARD_CREDITS} Credits Added!`);
                onReward.remove();
            });
            await AdMob.showRewardVideoAd();
            setLoading(false);
        } catch (error) {
            console.error('AdMob Error', error);
            setLoading(false);
            alert("Ads not available right now. Try again later.");
        }
    } else {
        const confirmSim = window.confirm("You are in Web Mode. Simulate watching an Ad?");
        if (confirmSim) {
            updateCredits((profile?.credits || 0) + REWARD_CREDITS);
            alert(`+${REWARD_CREDITS} Credits Added (Simulated)!`);
        }
    }
  };

  const isSaved = (content: string) => savedItems.some(item => item.content === content);
  const clear = () => { Native.hapticLight(); setInputText(''); setImage(null); setResult(null); setInputError(null); };
  const currentCost = (mode === InputMode.CHAT && image) ? 2 : 1;

  // --- Rendering ---
  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;
  if (isSessionBlocked) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Session Paused. <button onClick={handleReclaimSession} className="ml-2 underline">Reclaim</button></div>;
  if (!session) return <LoginPage onGuestLogin={handleGuestLogin} />;
  if (!profile) return <div className="min-h-screen bg-black" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-12 pb-24 relative min-h-[100dvh] flex flex-col">
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} onUpgrade={handleUpgrade} />}
      {showSettingsModal && <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} userEmail={profile.email} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />}
      {showReportModal && <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} contentToReport={reportContent} />}
      <SavedModal isOpen={showSavedModal} onClose={() => setShowSavedModal(false)} savedItems={savedItems} onDelete={handleDeleteSaved} onShare={handleShare} />

      {/* Nav */}
      <nav className="flex justify-between items-center mb-8 md:mb-12">
        <button onClick={() => { Native.hapticLight(); setShowSettingsModal(true); }} className="px-3 py-1.5 text-xs text-white/40 hover:text-white border border-transparent hover:border-white/10 rounded-lg transition-all flex items-center gap-2">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             <span className="hidden md:inline">Settings</span>
        </button>
        <div className="flex items-center gap-2">
           <button onClick={() => { Native.hapticLight(); setShowSavedModal(true); }} className="p-2 md:px-4 md:py-2 bg-white/5 hover:bg-white/10 rounded-full flex items-center gap-1.5 transition-all">
              <span className="text-pink-500">♥</span><span className="hidden md:inline text-xs font-bold">Saved</span>
           </button>
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md ${profile.is_premium ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10'}`}>
              <span className="text-yellow-400 font-bold text-xs">{profile.is_premium ? '👑 VIP' : `${profile.credits} ⚡`}</span>
           </div>
        </div>
      </nav>

      {/* Header - NOW USING LOGO */}
      <header className="mb-8">
        <Logo />
        <p className="text-center text-white/60 text-sm mt-3">Your world-class wingman.</p>
      </header>

      {/* Mode Switcher */}
      <div className="flex p-1 bg-white/5 rounded-full mb-8 relative border border-white/10 max-w-md mx-auto w-full">
        <button onClick={() => { setMode(InputMode.CHAT); clear(); }} className={`flex-1 py-3 rounded-full font-medium text-sm transition-all relative z-10 ${mode === InputMode.CHAT ? 'text-white' : 'text-white/50'}`}>Chat Reply</button>
        <button onClick={() => { setMode(InputMode.BIO); clear(); }} className={`flex-1 py-3 rounded-full font-medium text-sm transition-all relative z-10 ${mode === InputMode.BIO ? 'text-white' : 'text-white/50'}`}>Profile Bio</button>
        <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full rizz-gradient transition-all ${mode === InputMode.CHAT ? 'left-1' : 'left-[calc(50%+4px)]'}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Input */}
        <section className="glass rounded-3xl p-5 md:p-6 border border-white/10 lg:sticky lg:top-8">
          <textarea
            value={inputText}
            onChange={(e) => { setInputText(e.target.value); if (inputError) setInputError(null); }}
            placeholder={mode === InputMode.CHAT ? "Paste the chat here..." : "Hobbies, job, interests..."}
            className="w-full h-32 md:h-40 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-pink-500/50 outline-none resize-none"
          />
          
          {mode === InputMode.CHAT && (
            <div className="my-4">
               <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-pink-500/50 transition-all ${image ? 'p-2' : 'p-6'}`}>
                 {image ? <img src={image} className="w-full max-h-32 object-contain" /> : <div className="text-center text-white/50 text-sm">📸 Add Screenshot</div>}
                 <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
               </div>
            </div>
          )}

          {inputError && <div className="mb-4 text-red-400 text-sm text-center">{inputError}</div>}
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-base shadow-xl transition-all disabled:opacity-50 ${profile.is_premium ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-black" : "rizz-gradient text-white"}`}
          >
            {loading ? "Cooking..." : (profile.is_premium ? "Generate (VIP)" : `Generate (${currentCost}⚡)`)}
          </button>

          {!profile.is_premium && (
            <div className="grid grid-cols-2 gap-3 mt-3">
             <button onClick={handleWatchAd} className="bg-white/10 border border-white/10 py-3 rounded-2xl font-bold text-xs hover:bg-white/20">📺 Watch Ad (+{REWARD_CREDITS})</button>
             <button onClick={() => { Native.hapticLight(); setShowPremiumModal(true); }} className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black py-3 rounded-2xl font-bold text-xs hover:brightness-110">👑 Go Unlimited</button>
            </div>
          )}
        </section>

        {/* Output */}
        <section className="flex flex-col gap-4 min-h-[300px]">
           {!result && !loading && <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-white/20"><p>Results appear here.</p></div>}
           {result && 'tease' in result && (
              <>
              <div className="glass p-5 rounded-3xl border border-white/10 flex justify-between items-center">
                 <div><div className="text-xs text-white/40 font-bold uppercase">Vibe Check</div><div className="text-white/80 text-sm mt-1">{result.analysis}</div></div>
                 <div className="text-3xl font-black text-white">{result.loveScore}%</div>
              </div>
              <RizzCard label="Tease" content={result.tease} icon="😏" color="from-purple-500 to-indigo-500" isSaved={isSaved(result.tease)} onSave={() => toggleSave(result.tease, 'tease')} onShare={() => handleShare(result.tease)} onReport={() => handleReport(result.tease)} />
              <RizzCard label="Smooth" content={result.smooth} icon="🪄" color="from-blue-500 to-cyan-500" isSaved={isSaved(result.smooth)} onSave={() => toggleSave(result.smooth, 'smooth')} onShare={() => handleShare(result.smooth)} onReport={() => handleReport(result.smooth)} />
              <RizzCard label="Chaotic" content={result.chaotic} icon="🤡" color="from-orange-500 to-red-500" isSaved={isSaved(result.chaotic)} onSave={() => toggleSave(result.chaotic, 'chaotic')} onShare={() => handleShare(result.chaotic)} onReport={() => handleReport(result.chaotic)} />
              </>
           )}
           {result && 'bio' in result && (
             <div className="glass p-6 rounded-3xl border border-white/10">
                <h3 className="text-xs font-bold uppercase text-white/50 mb-4">Bio Result</h3>
                <p className="text-lg font-medium mb-6">"{result.bio}"</p>
                <div className="flex gap-2">
                    <button onClick={() => { Native.hapticMedium(); navigator.clipboard.writeText(result.bio); alert('Copied!'); }} className="flex-1 py-3 bg-white/10 rounded-xl font-bold text-sm">Copy Bio</button>
                    <button onClick={() => handleReport(result.bio)} className="px-4 bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 rounded-xl transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-8a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg></button>
                </div>
             </div>
           )}
        </section>
      </div>
      <Footer className="mt-12" />
    </div>
  );
};

export default App;
