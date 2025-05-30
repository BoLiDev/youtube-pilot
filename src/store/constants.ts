export const summaryPrompt = `
请提供一个简洁的总结, 捕捉内容的主要观点和关键点:
1.请以第三人称的方式撰写简明扼要的总结, 包含主要内容、关键信息和要点
2.总结应该是客观的, 不应超过200个字
3.请以Markdown格式输出内容, 使用适当的标题、列表和格式来提高可读性。
4.请以中文输出内容
5. 不要以对话方式回答，例如以好的或者当然开头，必须直接输出总结内容
`

export const notesPrompt = `
请提供结构化的笔记, 包括:
1. 内容概述 (简短介绍主题和目的)
2. 关键要点 (列出讨论的主要观点, 使用编号列表)
3. 重要细节 (提供重要的细节、例子或引用)
4. 总结和见解 (总结主要价值和任何重要的见解)
5. 请以中文输出内容
6. 请以Markdown格式输出内容, 使用适当的标题、列表和格式来提高可读性。
7. 不要以对话方式回答，例如以好的或者当然开头，必须直接输出笔记内容
`
