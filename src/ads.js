import { Capacitor } from '@capacitor/core';
import { AdMob, AdmobConsentStatus } from '@capacitor-community/admob';

// ====== AYARLAR ======
// TEST=true iken Google'ın TEST reklamları gösterilir (geliştirirken hep böyle kalsın).
// Gerçek reklama geçmek için false yap. Kendi reklamına ASLA tıklama (hesap kapanabilir).
const TEST = true;
const REAL_INTERSTITIAL = 'ca-app-pub-1026492731881827/9301356002'; // AdMob'daki "geçiş (interstitial)" reklam birimin
const TEST_INTERSTITIAL = 'ca-app-pub-3940256099942544/1033173712'; // Google'ın resmi test kimliği
const EVERY = 2; // her kaç oyunda bir reklam gösterilsin
// =====================

const adId = TEST ? TEST_INTERSTITIAL : REAL_INTERSTITIAL;
let inited = false, games = 0;

async function prep() { try { await AdMob.prepareInterstitial({ adId }); } catch (e) {} }

async function init() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.initialize();
    try {
      const c = await AdMob.requestConsentInfo();
      if (c.isConsentFormAvailable && c.status === AdmobConsentStatus.REQUIRED) await AdMob.showConsentForm();
    } catch (e) {}
    inited = true;
    prep();
  } catch (e) {}
}

async function show() {
  if (!inited) return;
  try { await AdMob.showInterstitial(); } catch (e) {}
  prep();
}

window.KacakAds = {
  native: Capacitor.isNativePlatform(),
  onGameOver() { games++; if (games % EVERY === 0) setTimeout(show, 900); }
};
init();
