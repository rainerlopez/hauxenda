import { supabase } from '../lib/supabase';

// Service for handling file uploads to Supabase Storage
export class StorageService {
  private static readonly BUCKET_NAME = 'event-images';

  /**
   * Upload an image file for an event
   * @param eventId - The ID of the event
   * @param imageFile - The image file to upload
   * @returns Promise with upload result
   */
  static async uploadEventImage(eventId: string, imageFile: File): Promise<{
    data: { path: string; fullUrl: string } | null;
    error: string | null;
  }> {
    try {
      // Generate unique filename
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `event-${eventId}-${Date.now()}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw new Error(error.message);
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      return {
        data: {
          path: data.path,
          fullUrl: publicUrl
        },
        error: null
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Upload failed'
      };
    }
  }

  /**
   * Delete an image file from storage
   * @param filePath - The path of the file to delete
   * @returns Promise with deletion result
   */
  static async deleteEventImage(filePath: string): Promise<{
    error: string | null;
  }> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        throw new Error(error.message);
      }

      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Delete failed'
      };
    }
  }

  /**
   * Get public URL for an image
   * @param filePath - The path of the file
   * @returns Public URL string
   */
  static getPublicUrl(filePath: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(filePath);
    
    return publicUrl;
  }

  /**
   * List all files in the event-images bucket
   * @returns Promise with list of files
   */
  static async listEventImages(): Promise<{
    data: any[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', {
          limit: 100,
          offset: 0
        });

      if (error) {
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'List failed'
      };
    }
  }
}
