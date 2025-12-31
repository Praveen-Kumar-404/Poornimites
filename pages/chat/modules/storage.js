
import { supabase } from '../../../assets/js/supabase-init.js';

export const StorageService = {
    uploadFile(file, path, onProgress) {
        return new Promise(async (resolve, reject) => {
            try {
                // Remove 'servers/' from start if present in path construction to match bucket structure if needed
                // Supabase storage usually works with buckets. Let's assume bucket is 'chat-attachments'
                // path passed is like: servers/serverid/channels/channelid/filename

                const { data, error } = await supabase.storage
                    .from('chat-attachments')
                    .upload(path, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (error) throw error;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('chat-attachments')
                    .getPublicUrl(path);

                resolve({
                    url: publicUrl,
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
            } catch (error) {
                console.error("Upload failed:", error);
                reject(error);
            }
        });
    }
};
