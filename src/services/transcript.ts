import { YoutubeTranscript } from 'youtube-transcript';


export const getTranscript = async (videoId: string): Promise<string | null> => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)

    if (transcript && transcript.length > 0) {
      const text = transcript.map(item => item.text).join(' ')
      return text
    }

    return null
  } catch (error) {
    return null
  }
}