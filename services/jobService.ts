
import { supabase } from "../lib/supabase";
import { Job, JobAlert, SavedJob } from "../types";

// ... (kode lama fetchJobs dll tetap ada, tambahkan yang di bawah ini)

// Bookmark Jobs
export const toggleSaveJob = async (userId: string, jobId: string) => {
    // Cek apakah sudah disave
    const { data: existing } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('user_id', userId)
        .eq('job_id', jobId)
        .single();

    if (existing) {
        // Unsave
        await supabase.from('saved_jobs').delete().eq('id', existing.id);
        return false; // Saved status: false
    } else {
        // Save
        await supabase.from('saved_jobs').insert({ user_id: userId, job_id: jobId });
        return true; // Saved status: true
    }
};

export const getSavedJobs = async (userId: string): Promise<SavedJob[]> => {
    const { data, error } = await supabase
        .from('saved_jobs')
        .select('*, job:jobs(*)') // Join dengan table jobs
        .eq('user_id', userId);

    if (error) {
        console.error("Error fetching saved jobs:", error);
        return [];
    }

    // Mapping response
    return data.map((item: any) => ({
        id: item.id,
        jobId: item.job_id,
        createdAt: item.created_at,
        job: {
            ...item.job,
            postedAt: new Date(item.job.posted_at).toLocaleDateString(),
            isSaved: true
        }
    }));
};

// Job Alerts
export const createJobAlert = async (userId: string, criteria: { keywords: string; location: string }) => {
    const { error } = await supabase
        .from('job_alerts')
        .insert({ 
            user_id: userId, 
            keywords: criteria.keywords, 
            location: criteria.location 
        });
    
    if (error) throw new Error(error.message);
};

export const getJobAlerts = async (userId: string): Promise<JobAlert[]> => {
    const { data, error } = await supabase
        .from('job_alerts')
        .select('*')
        .eq('user_id', userId);
        
    if (error) return [];

    return data.map((a: any) => ({
        id: a.id,
        keywords: a.keywords,
        location: a.location,
        createdAt: new Date(a.created_at).toLocaleDateString()
    }));
};

export const deleteJobAlert = async (alertId: string) => {
    await supabase.from('job_alerts').delete().eq('id', alertId);
}
