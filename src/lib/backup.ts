import { supabase } from './supabase';
import { encryptData, decryptData } from './encryption';

export const createBackup = async (userId: string, data: any) => {
  try {
    const encryptedData = encryptData(JSON.stringify(data));
    
    const { error } = await supabase
      .from('curriculum_backups')
      .insert({
        user_id: userId,
        data: encryptedData,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Backup creation failed:', error);
    return false;
  }
};

export const restoreFromBackup = async (userId: string, backupId: string) => {
  try {
    const { data, error } = await supabase
      .from('curriculum_backups')
      .select('data')
      .eq('user_id', userId)
      .eq('id', backupId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Backup not found');

    const decryptedData = decryptData(data.data);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Backup restoration failed:', error);
    throw error;
  }
};