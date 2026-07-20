import { isSupabaseConfigured, supabase } from "@/supabase/client";

export interface TrialAccount {
  id: string;
  email: string;
  password: string;
  expiry: string;
  disabled: boolean;
  created_at: string;
}

export interface TrialAccountInput {
  email: string;
  password: string;
  expiry: string;
  disabled?: boolean;
}

const LOCAL_STORAGE_KEY = "platformTrialAccounts";
const LOCAL_ONLY = import.meta.env.VITE_USE_LOCAL_TRIAL_ACCOUNTS === "true";

function shouldUseSupabase() {
  return Boolean(isSupabaseConfigured && supabase && !LOCAL_ONLY);
}

function createInitialAccount(): TrialAccount {
  return {
    id: "local-test-account",
    email: "test1@example.com",
    password: "123456",
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    disabled: false,
    created_at: new Date().toISOString(),
  };
}

function normalizeAccount(account: any): TrialAccount {
  return {
    id: String(account.id),
    email: String(account.email),
    password: String(account.password),
    expiry: String(account.expiry),
    disabled: Boolean(account.disabled),
    created_at: String(account.created_at || new Date().toISOString()),
  };
}

function readLocalAccounts(): TrialAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(normalizeAccount);
    }
  } catch (error) {
    console.warn("Failed to read local trial accounts:", error);
  }

  const initial = [createInitialAccount()];
  writeLocalAccounts(initial);
  return initial;
}

function writeLocalAccounts(accounts: TrialAccount[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(accounts));
}

function fallbackToLocal<T>(operation: () => T): T {
  console.info("Using local trial account storage. Configure Supabase env vars for shared cloud data.");
  return operation();
}

export function getTrialAccountStorageMode(): "supabase" | "local" {
  return shouldUseSupabase() ? "supabase" : "local";
}

export async function listTrialAccounts(): Promise<TrialAccount[]> {
  if (shouldUseSupabase() && supabase) {
    try {
      const { data, error } = await supabase
        .from("trial_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) return data.map(normalizeAccount);
    } catch (error) {
      console.warn("Supabase trial account list failed; falling back to local storage:", error);
    }
  }

  return fallbackToLocal(readLocalAccounts);
}

export async function createTrialAccount(input: TrialAccountInput): Promise<TrialAccount> {
  if (shouldUseSupabase() && supabase) {
    try {
      const { data, error } = await supabase
        .from("trial_accounts")
        .insert({
          email: input.email,
          password: input.password,
          expiry: input.expiry,
          disabled: input.disabled ?? false,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) return normalizeAccount(data);
    } catch (error) {
      console.warn("Supabase trial account create failed; falling back to local storage:", error);
    }
  }

  return fallbackToLocal(() => {
    const accounts = readLocalAccounts();
    if (accounts.some((account) => account.email === input.email)) {
      throw new Error("该邮箱已存在");
    }

    const account: TrialAccount = {
      id: `local-${Date.now()}`,
      email: input.email,
      password: input.password,
      expiry: input.expiry,
      disabled: input.disabled ?? false,
      created_at: new Date().toISOString(),
    };

    const updated = [account, ...accounts];
    writeLocalAccounts(updated);
    return account;
  });
}

export async function deleteTrialAccount(id: string): Promise<void> {
  if (shouldUseSupabase() && supabase) {
    try {
      const { error } = await supabase.from("trial_accounts").delete().eq("id", id);
      if (error) throw error;
      return;
    } catch (error) {
      console.warn("Supabase trial account delete failed; falling back to local storage:", error);
    }
  }

  fallbackToLocal(() => {
    writeLocalAccounts(readLocalAccounts().filter((account) => account.id !== id));
  });
}

export async function setTrialAccountDisabled(account: TrialAccount, disabled: boolean): Promise<TrialAccount> {
  if (shouldUseSupabase() && supabase) {
    try {
      const { error } = await supabase
        .from("trial_accounts")
        .update({ disabled })
        .eq("id", account.id);

      if (error) throw error;
      return { ...account, disabled };
    } catch (error) {
      console.warn("Supabase trial account update failed; falling back to local storage:", error);
    }
  }

  return fallbackToLocal(() => {
    const updatedAccount = { ...account, disabled };
    const accounts = readLocalAccounts().map((item) => (item.id === account.id ? updatedAccount : item));
    writeLocalAccounts(accounts);
    return updatedAccount;
  });
}

export async function setTrialAccountExpiry(account: TrialAccount, expiry: string): Promise<TrialAccount> {
  if (shouldUseSupabase() && supabase) {
    try {
      const { error } = await supabase
        .from("trial_accounts")
        .update({ expiry })
        .eq("id", account.id);

      if (error) throw error;
      return { ...account, expiry };
    } catch (error) {
      console.warn("Supabase trial account expiry update failed; falling back to local storage:", error);
    }
  }

  return fallbackToLocal(() => {
    const updatedAccount = { ...account, expiry };
    const accounts = readLocalAccounts().map((item) => (item.id === account.id ? updatedAccount : item));
    writeLocalAccounts(accounts);
    return updatedAccount;
  });
}
