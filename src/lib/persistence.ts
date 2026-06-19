/*
  Mock 영속화 레이어 (D-003 / D-009).
  지금은 localStorage 백엔드지만, 화면/상태 머신은 이 인터페이스만 소비한다.
  나중에 서버/DB로 교체할 때 이 파일의 구현만 갈아끼우면 된다(메서드는 async로 둠).
*/

import type { Collection, TasteProfile } from "@/types";

export interface PersistenceStore {
  /** 온보딩 완료 여부 (런치 게이트). */
  getOnboarded(): Promise<boolean>;
  setOnboarded(value: boolean): Promise<void>;
  /** 취향 프로필(F1 산출물). 없으면 null → 콜드스타트(빈 프로필)로 처리. */
  getTasteProfile(): Promise<TasteProfile | null>;
  setTasteProfile(profile: TasteProfile): Promise<void>;
  /** 찜한 상품 id 목록(전역 saved 상태). 없으면 빈 배열. */
  getSavedIds(): Promise<string[]>;
  setSavedIds(ids: string[]): Promise<void>;
  /** 찜 컬렉션 목록(사용자가 만든 묶음). 없으면 빈 배열. */
  getCollections(): Promise<Collection[]>;
  setCollections(collections: Collection[]): Promise<void>;
}

const ONBOARDED_KEY = "moodyfit_onboarded";
const TASTE_KEY = "moodyfit_taste_profile";
const SAVED_KEY = "moodyfit_saved_ids";
const COLLECTIONS_KEY = "moodyfit_collections";

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
  async getSavedIds() {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(SAVED_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  },
  async setSavedIds(ids) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
    } catch {
      /* 쓰기 실패 무시 */
    }
  },
  async getCollections() {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(COLLECTIONS_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? (parsed as Collection[]) : [];
    } catch {
      return [];
    }
  },
  async setCollections(collections) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    } catch {
      /* 쓰기 실패 무시 */
    }
  },
};

/** 앱이 사용하는 단일 영속화 인스턴스. 교체 지점. */
export const persistence: PersistenceStore = localStorageStore;
