/*
  Mock 영속화 레이어 (D-003 / D-009).
  지금은 localStorage 백엔드지만, 화면/상태 머신은 이 인터페이스만 소비한다.
  나중에 서버/DB로 교체할 때 이 파일의 구현만 갈아끼우면 된다(메서드는 async로 둠).
*/

import type { TasteProfile } from "@/types";

export interface PersistenceStore {
  /** 온보딩 완료 여부 (런치 게이트). */
  getOnboarded(): Promise<boolean>;
  setOnboarded(value: boolean): Promise<void>;
  /** 취향 프로필(F1 산출물). 없으면 null → 콜드스타트(빈 프로필)로 처리. */
  getTasteProfile(): Promise<TasteProfile | null>;
  setTasteProfile(profile: TasteProfile): Promise<void>;
}

const ONBOARDED_KEY = "moodyfit_onboarded";
const TASTE_KEY = "moodyfit_taste_profile";

/** 클라이언트 전용. SSR/비브라우저 환경에서는 안전하게 기본값을 반환한다. */
const localStorageStore: PersistenceStore = {
  async getOnboarded() {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(ONBOARDED_KEY) === "true";
    } catch {
      return false;
    }
  },
  async setOnboarded(value) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ONBOARDED_KEY, value ? "true" : "false");
    } catch {
      /* private 모드 등에서 쓰기 실패는 무시 */
    }
  },
  async getTasteProfile() {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(TASTE_KEY);
      return raw ? (JSON.parse(raw) as TasteProfile) : null;
    } catch {
      return null; // 파싱 실패도 콜드스타트로 폴백(앱이 깨지지 않게)
    }
  },
  async setTasteProfile(profile) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(TASTE_KEY, JSON.stringify(profile));
    } catch {
      /* 쓰기 실패 무시 */
    }
  },
};

/** 앱이 사용하는 단일 영속화 인스턴스. 교체 지점. */
export const persistence: PersistenceStore = localStorageStore;
