/**
 * FBTI 快速测试脚本
 * 
 * 使用方法:
 * 1. 在浏览器中打开 FBTI 测试页面
 * 2. 打开浏览器开发者工具 (F12)
 * 3. 切换到 Console 标签
 * 4. 复制粘贴此脚本的全部内容并回车
 * 5. 脚本会自动完成所有测试题目
 * 
 * 注意: 此脚本仅用于开发测试,不会提交到生产环境
 */

(function quickTest() {
  console.log('🎬 FBTI 快速测试脚本启动...');
  
  // 自动点击选项的策略
  const strategies = {
    // 策略1: 总是选择第一个选项
    first: () => 0,
    
    // 策略2: 随机选择
    random: (max) => Math.floor(Math.random() * max),
    
    // 策略3: 交替选择
    alternate: (index, max) => index % 2 === 0 ? 0 : (max > 1 ? 1 : 0),
    
    // 策略4: 优先选择skip(如果有)
    skipFirst: (options) => {
      const skipIndex = options.findIndex(opt => opt.type === 'skip');
      return skipIndex !== -1 ? skipIndex : 0;
    }
  };
  
  // 默认使用随机策略
  const strategy = strategies.random;
  
  // 获取所有按钮
  const getButtons = () => {
    return document.querySelectorAll('button');
  };
  
  // 找到选项按钮并点击
  const clickOption = (questionIndex, optionIndex) => {
    const buttons = Array.from(getButtons());
    
    // 查找所有选项按钮(排除"上一题"、"下一题"、"返回主页"等)
    const optionButtons = buttons.filter(btn => {
      const text = btn.textContent;
      return text && 
             !text.includes('上一题') && 
             !text.includes('下一题') && 
             !text.includes('返回主页') &&
             !text.includes('确认') &&
             !text.includes('取消') &&
             !text.includes('确定') &&
             btn.offsetParent !== null; // 可见的元素
    });
    
    if (optionButtons[optionIndex]) {
      optionButtons[optionIndex].click();
      return true;
    }
    return false;
  };
  
  // 自动完成所有题目
  const runAutoTest = async () => {
    let questionCount = 0;
    const maxQuestions = 60; // 安全上限
    const delay = 500; // 每题间隔(毫秒)
    
    const processNext = () => {
      if (questionCount >= maxQuestions) {
        console.log('✅ 测试完成!');
        return;
      }
      
      // 获取当前题目信息
      const questionNum = document.querySelector('.text-gray-400.text-sm');
      if (!questionNum) {
        console.log('⚠️ 无法获取题目信息,可能已到达结果页');
        return;
      }
      
      const currentText = questionNum.textContent;
      const match = currentText.match(/(\d+)\s*\/\s*(\d+)/);
      
      if (!match) {
        console.log('⚠️ 无法解析题目编号');
        return;
      }
      
      const current = parseInt(match[1]);
      const total = parseInt(match[2]);
      
      console.log(`📝 当前: 第 ${current}/${total} 题`);
      
      // 获取选项数量
      const allButtons = Array.from(getButtons());
      const optionButtons = allButtons.filter(btn => {
        const text = btn.textContent;
        return text && 
               !text.includes('上一题') && 
               !text.includes('下一题') && 
               !text.includes('返回主页') &&
               !text.includes('确认') &&
               !text.includes('取消') &&
               !text.includes('确定') &&
               btn.offsetParent !== null;
      });
      
      if (optionButtons.length === 0) {
        console.log('❌ 未找到选项按钮');
        return;
      }
      
      // 根据策略选择选项
      const optionIndex = strategy(optionButtons.length);
      console.log(`  → 选择第 ${optionIndex + 1} 个选项`);
      
      // 点击选项
      if (clickOption(current, optionIndex)) {
        questionCount++;
        
        // 如果是最后一题,等待跳转到结果页
        if (current === total) {
          console.log('🎉 完成所有题目,正在生成结果...');
          setTimeout(() => {
            console.log('✅ 测试脚本执行完毕');
          }, 3000);
          return;
        }
        
        // 继续下一题
        setTimeout(processNext, delay);
      } else {
        console.log('❌ 点击失败');
      }
    };
    
    // 开始执行
    console.log(`🚀 开始自动测试 (共 ${maxQuestions} 题上限)`);
    setTimeout(processNext, 1000);
  };
  
  // 执行
  runAutoTest();
  
  console.log('💡 提示: 如果需要其他策略,可以修改 strategy 变量');
  console.log('   可用策略: first(第一个), random(随机), alternate(交替), skipFirst(优先skip)');
  
})();
