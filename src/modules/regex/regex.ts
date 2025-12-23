export interface RegexOptions {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  sticky: boolean;
}

export interface MatchResult {
  match: string;
  index: number;
  groups?: Record<string, string>;
}

export interface RegexTestResult {
  isValid: boolean;
  matches: MatchResult[];
  error?: string;
}

export interface RegexReplaceResult {
  isValid: boolean;
  result: string;
  error?: string;
}

/**
 * 测试正则表达式是否匹配文本
 */
export function testRegex(pattern: string, text: string, options: RegexOptions): RegexTestResult {
  try {
    // 创建正则表达式对象
    const flags = [
      options.global ? 'g' : '',
      options.ignoreCase ? 'i' : '',
      options.multiline ? 'm' : '',
      options.dotAll ? 's' : '',
      options.unicode ? 'u' : '',
      options.sticky ? 'y' : ''
    ].join('');
    
    const regex = new RegExp(pattern, flags);
    const matches: MatchResult[] = [];
    
    // 查找所有匹配项
    if (options.global) {
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups
        });
        
        // 防止无限循环
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(text);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups
        });
      }
    }
    
    return {
      isValid: true,
      matches
    };
  } catch (error) {
    return {
      isValid: false,
      matches: [],
      error: error instanceof Error ? error.message : '无效的正则表达式'
    };
  }
}

/**
 * 使用正则表达式替换文本
 */
export function replaceRegex(pattern: string, text: string, replacement: string, options: RegexOptions): RegexReplaceResult {
  try {
    // 创建正则表达式对象
    const flags = [
      options.global ? 'g' : '',
      options.ignoreCase ? 'i' : '',
      options.multiline ? 'm' : '',
      options.dotAll ? 's' : '',
      options.unicode ? 'u' : '',
      options.sticky ? 'y' : ''
    ].join('');
    
    const regex = new RegExp(pattern, flags);
    const result = text.replace(regex, replacement);
    
    return {
      isValid: true,
      result
    };
  } catch (error) {
    return {
      isValid: false,
      result: text,
      error: error instanceof Error ? error.message : '无效的正则表达式'
    };
  }
}

/**
 * 格式化匹配结果，用于显示
 */
export function formatMatchResults(results: RegexTestResult): string {
  if (!results.isValid) {
    return `错误: ${results.error}`;
  }
  
  if (results.matches.length === 0) {
    return '没有找到匹配项';
  }
  
  return results.matches.map((match, index) => {
    let output = `匹配 ${index + 1}: "${match.match}"\n`;
    output += `位置: ${match.index}\n`;
    
    if (match.groups && Object.keys(match.groups).length > 0) {
      output += `分组: ${JSON.stringify(match.groups, null, 2)}\n`;
    }
    
    return output;
  }).join('\n');
}
