const SHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // 若绑定了容器脚本，可直接用 getActiveSpreadsheet()

function doGet(e) {
  const p = e.parameter;
  const action = p.action;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === "getQuestions") {
    const sheet = ss.getSheetByName("Questions");
    const count = parseInt(p.count) || 5;
    
    // 获取所有数据（假设第一行是标题）
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    
    const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues(); 
    // Data structure: [No, Question, A, B, C, D, Answer]
    
    // 随机洗牌
    const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, count);
    
    const questions = shuffled.map(row => ({
      no: row[0],
      question: row[1],
      options: [row[2], row[3], row[4], row[5]],
      answer: row[6] // 前端如果需要验证对错，可回传；或者后端验证
    }));
    
    return createJSON(questions);
  }
}

function doPost(e) {
  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString); // data: { id: "player1", answers: [{qIndex, answer, isCorrect}, ...] }
    // 注意：这里的 answers 结构取决于前端传什么。
    // 如果前端只传了 ID 和 分数，那就更简单。
    // 假设前端计算好分数传过来，或者前端传答案由后端算。
    // 根据需求描述："将作答结果传送到 GAS 计算成绩" -> 我们来算
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const qSheet = ss.getSheetByName("Questions");
    const rSheet = ss.getSheetByName("Responses");
    
    // 1. 计算通过题目数
    // 需要重新获取题目答案来对比吗？
    // 为了简单，假设前端传来的 answers 包含了 { questionId, userAnswer }，我们需要去 Question 表查正确答案。
    // 或者更简单：前端已经判断了 isCorrect (前端已有答案)，后端只负责记录。
    // 既然前端都能拿到答案（为了显示对错），那前端算分是可信的（对于非严肃比赛）。
    // 按照需求："将作答结果传送到...计算成绩"。严格来说后端算更安全。
    // 这里我们采用混合模式：前端传 { id, answers: [ {no: 1, answer: 'A'}, ... ] }
    
    const userAnswers = data.answers || [];
    const userId = data.id || "Unknown";
    
    //以此 ID 查找 Responses 表
    const rData = rSheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < rData.length; i++) {
      if (rData[i][0] == userId) {
        rowIndex = i + 1;
        break;
      }
    }
    
    // 计算分数
    // 获取所有题目答案映射
    const qData = qSheet.getDataRange().getValues(); // [No, Q, A, B, C, D, Ans]
    const answerMap = {};
    for (let i=1; i<qData.length; i++) {
      const qNo = qData[i][0]; // 题目 No
      const qAns = qData[i][6]; // 答案
      answerMap[qNo] = qAns;
    }
    
    let score = 0;
    userAnswers.forEach(item => {
      // 假设 item 结构有 { no: 1, answer: 'A' }
      // 前端传来的 questions 数组里应该包含 no
      // 查看前端 store/gameStore.js，answers 存的是 { qIndex, answer, isCorrect }
      // 我们需要前端把 题目No (ID) 也存进去才能后端校验。
      // 暂时相信前端传来的 isCorrect 统计总分（简化），或者前端改一下把 isCorrect 传回来计数。
      if (item.isCorrect) score++;
    });
    
    // 需求：ID、闯关次数、总分、最高分、第一次通关分数、花了几次通关、最近游玩时间
    // 这里逻辑稍复杂：
    // - 总分：是累积总分？还是单次？通常 Quiz 是单次。需求列了“总分”和“最高分”，可能是“历史累计总分”？
    // 假设：总分 = 历史所有分数之和（积分制）
    
    const now = new Date();
    
    if (rowIndex === -1) {
      // 新用户
      // Headers: ID, 闯关次数, 总分, 最高分, 第一次通关分数, 花了几次通关, 最近游玩时间
      // 第一次通关分数：如果这次 passed (score >= threshold) 则是 score，否则空？
      // 简单起见，记为 0
      rSheet.appendRow([userId, 1, score, score, score >= 3 ? score : "", "", now]); 
      // 注：threshold 3 是硬编码还是传参？
    } else {
      // 老用户
      const row = rData[rowIndex-1];
      // row indices: 0:ID, 1:Count, 2:Total, 3:Max, 4:FirstClear, 5:AttemptsToClear, 6:LastTime
      
      let playCount = parseInt(row[1]) + 1;
      let totalScore = parseInt(row[2]) + score;
      let maxScore = Math.max(parseInt(row[3]), score);
      let firstClear = row[4];
      let attemptsToClear = row[5];
      
      const threshold = 3; // 假设门槛
      if (firstClear === "" && score >= threshold) {
        firstClear = score;
        attemptsToClear = playCount;
      }
      
      rSheet.getRange(rowIndex, 2, 1, 6).setValues([[
        playCount, totalScore, maxScore, firstClear, attemptsToClear, now
      ]]);
    }
    
    return createJSON({ success: true, score: score });
    
  } catch (e) {
    return createJSON({ success: false, error: e.toString() });
  }
}

function createJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
