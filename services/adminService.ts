
import { supabase } from "../lib/supabase";
import { Job, User } from "../types";

// Fungsi untuk mendapatkan statistik global
export const getAdminStats = async () => {
  const { count: userCount, error: userError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: jobCount, error: jobError } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true });

  const { count: appCount, error: appError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true });

  if (userError || jobError || appError) {
    console.error("Error fetching stats", userError, jobError, appError);
    // Return dummy data in case of error (for demo if DB is empty)
    return { users: 150, jobs: 45, applications: 320 }; 
  }

  return {
    users: userCount || 0,
    jobs: jobCount || 0,
    applications: appCount || 0
  };
};

// Fungsi untuk mengambil semua user
export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(p => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      avatarUrl: p.avatar_url,
      companyName: p.company_name,
      location: p.location
  }));
};

// Fungsi untuk mengambil semua lowongan (untuk moderasi)
export const getAllJobsForAdmin = async (): Promise<Job[]> => {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }
    
    // Mapping DB structure to TS Interface
    return data.map((j: any) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        type: j.type,
        salaryRange: j.salary_range,
        description: j.description,
        requirements: j.requirements || [],
        postedAt: new Date(j.posted_at).toLocaleDateString(), // Format date simpler
        logoUrl: j.logo_url,
        category: j.category,
        minExperience: j.min_experience
    }));
};

// Fungsi untuk menghapus lowongan (Takedown)
export const deleteJobAsAdmin = async (jobId: string) => {
    const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);
    
    if (error) throw new Error(error.message);
};

// Fungsi untuk suspend user (Simulasi update metadata/flag)
// Note: Di real production biasanya ada kolom 'status' di table profiles
export const suspendUser = async (userId: string) => {
    // Demo: Kita update nama jadi [SUSPENDED]
    const { error } = await supabase
        .from('profiles')
        .update({ name: '[SUSPENDED] User' })
        .eq('id', userId);
    
    if (error) throw new Error(error.message);
};
