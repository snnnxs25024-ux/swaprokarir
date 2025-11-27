
import { supabase } from "../lib/supabase";
import { User, UserRole } from "../types";

// Helper untuk memparsing user dari Metadata jika Database gagal
const getUserFromMetadata = (authData: any): User => {
    const metadata = authData.user?.user_metadata || {};
    console.warn("Menggunakan data fallback dari Metadata Auth (Database Profile tidak tersedia/rusak).");
    
    return {
        id: authData.user.id,
        email: authData.user.email || '',
        name: metadata.name || authData.user.email?.split('@')[0] || 'User',
        role: metadata.role || 'candidate',
        avatarUrl: metadata.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`,
        companyName: metadata.companyName,
        // Data kosong default
        education: [],
        experience: [],
        skills: []
    };
};

// Helper untuk mapping dari DB snake_case ke App camelCase
const mapProfileToUser = (profile: any): User => {
    return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        avatarUrl: profile.avatar_url,
        companyName: profile.company_name,
        age: profile.age,
        phoneNumber: profile.phone_number,
        location: profile.location,
        summary: profile.summary,
        
        // New Fields Mapped
        birthPlace: profile.birth_place,
        birthDate: profile.birth_date,
        religion: profile.religion,
        address: profile.address,

        socialLinks: profile.social_links || undefined,
        education: profile.education || [],
        experience: profile.experience || [],
        skills: profile.skills || []
    };
};

export const login = async (email: string, password: string): Promise<User> => {
  // 1. Login ke Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) throw new Error("Gagal mendapatkan data user.");

  // 2. Coba ambil detail profil dari tabel 'profiles'
  try {
      // Gunakan function is_admin() untuk bypass RLS jika perlu, atau select biasa
      // Kita select biasa dulu, asumsi user login bisa baca profilnya sendiri
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      // HANDLE DATABASE CONFIGURATION ERRORS (Like Infinite Recursion 42P17)
      if (profileError && profileError.code === '42P17') {
          console.warn("Database Error: Infinite Recursion pada RLS Policy terdeteksi. Beralih ke Mode Fallback.");
          return getUserFromMetadata(authData);
      }

      // --- SELF HEALING MECHANISM (Attempt 1: UPSERT to DB) ---
      if (!profile) {
          console.log("Profil DB tidak ditemukan/sinkron. Melakukan Auto-Fix (Upsert)...");
          
          const metadata = authData.user.user_metadata || {};
          const newProfilePayload = {
              id: authData.user.id,
              email: email,
              name: metadata.name || email.split('@')[0], 
              role: metadata.role || 'candidate',
              avatar_url: metadata.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
              company_name: metadata.companyName || null,
              created_at: new Date().toISOString()
          };

          const { data: newProfile, error: upsertError } = await supabase
              .from('profiles')
              .upsert(newProfilePayload) // Upsert aman jika data sudah dibuat oleh Trigger
              .select()
              .single();

          if (upsertError) {
              if (upsertError.code !== '42P17') {
                   console.error("Gagal Auto-Fix Profil:", JSON.stringify(upsertError, null, 2));
              }
              // JANGAN THROW ERROR. Lanjut ke Ultimate Fallback agar user tetap bisa masuk.
          } else {
              console.log("Auto-Fix berhasil.");
              profile = newProfile;
          }
      }

      // Jika berhasil dapat profile dari DB
      if (profile) {
          return mapProfileToUser(profile);
      }
  } catch (err) {
      console.error("Error tak terduga saat fetch profile:", err);
  }

  // --- ULTIMATE FALLBACK ---
  return getUserFromMetadata(authData);
};

export const register = async (email: string, password: string, metadata: any): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });

  if (error) throw new Error(error.message);
  
  if (data.user) {
     return getUserFromMetadata({ user: data.user });
  }
  throw new Error("Registrasi gagal. Silakan coba lagi.");
};

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (profile) {
            return mapProfileToUser(profile);
        }
    } catch (err) {
        // Silent error
    }

    return getUserFromMetadata({ user: user });
};

// Fungsi Upload Avatar
export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
};

// Fungsi Update Profil Lengkap
export const updateProfile = async (user: User) => {
    const profilePayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatarUrl,
        company_name: user.companyName,
        age: user.age,
        phone_number: user.phoneNumber,
        location: user.location,
        summary: user.summary,
        
        // New Fields
        birth_place: user.birthPlace,
        birth_date: user.birthDate,
        religion: user.religion,
        address: user.address,
        
        // JSON Fields
        social_links: user.socialLinks,
        education: user.education,
        experience: user.experience,
        skills: user.skills
    };

    // Upsert: Update jika ada, Insert jika belum ada
    const { error } = await supabase
        .from('profiles')
        .upsert(profilePayload);

    if (error) throw new Error(error.message);
    return user;
};