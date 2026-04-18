/**
 * FBTI 快速测试脚本 - 简化版
 * 
 * 使用方法:
 * 1. 打开测试页面 http://8.152.155.189/quiz
 * 2. 按 F12 打开开发者工具
 * 3. 切换到 Console 标签
 * 4. 复制粘贴此脚本并回车
 */

(function() {
  console.log('🎬 FBTI 快速测试开始...');
  
  let count = 0;
  const maxQuestions = 60;
  
  function clickNext() {
    if (count >= maxQuestions) {
      console.log('✅ 完成!');
      return;
    }
    
    // 获取所有按钮
    const allButtons = document.querySelectorAll('button');
    
    // 找到选项按钮(包含文本的按钮)
    const optionButtons = [];
    allButtons.forEach(btn => {
      const text = btn.textContent.trim();
      // 排除导航按钮
      if (text && 
          !text.includes('上一题') && 
          !text.includes('下一题') && 
          !text.includes('返回主页') &&
          !text.includes('确认') &&
          !text.includes('取消') &&
          !text.includes('确定') &&
          btn.offsetParent !== null) {
        optionButtons.push(btn);
      }
    });
    
    if (optionButtons.length === 0) {
      console.log('⚠️ 没找到选项,可能已完成');
      return;
    }
    
    // 随机选择一个选项
    const randomIndex = Math.floor(Math.random() * optionButtons.length);
    console.log(`📝 第 ${count + 1} 题: 选择第 ${randomIndex + 1} 个选项 (共${optionButtons.length}个)`);
    
    // 点击
    optionButtons[randomIndex].click();
    count++;
    
    // 继续下一题
    setTimeout(clickNext, 600);
  }
  
  // 1秒后开始
  setTimeout(clickNext, 1000);
  console.log('🚀 1秒后开始自动测试...');
})();
