/**
 * 获取当前活动标签页的URL
 * @returns 返回当前标签页URL或者null
 */
export const getCurrentTabUrl = async (): Promise<string | null> => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tabs.length === 0 || !tabs[0].url) {
      return null;
    }

    return tabs[0].url;
  } catch (error) {
    console.error("获取当前标签URL时出错:", error);
    return null;
  }
};

/**
 * 获取当前活动标签页的标题
 * @returns 返回当前标签页标题或者null
 */
export const getCurrentTabTitle = async (): Promise<string | null> => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tabs.length === 0 || !tabs[0].title) {
      return null;
    }

    return tabs[0].title;
  } catch (error) {
    console.error("获取当前标签标题时出错:", error);
    return null;
  }
};

/**
 * 检查当前页面是否为YouTube视频页面
 */
export const isYouTubeVideoPage = async (): Promise<boolean> => {
  const url = await getCurrentTabUrl();

  if (!url) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    return (
      (urlObj.hostname === "www.youtube.com" ||
       urlObj.hostname === "youtube.com") &&
      urlObj.pathname.includes("/watch")
    );
  } catch {
    return false;
  }
};

/**
 * 从YouTube URL中提取视频ID
 */
export const extractVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);

    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.substring(1);
    }

    if ((urlObj.hostname === "www.youtube.com" ||
         urlObj.hostname === "youtube.com") &&
        urlObj.pathname.includes("/watch")) {
      return urlObj.searchParams.get("v");
    }

    return null;
  } catch {
    return null;
  }
};