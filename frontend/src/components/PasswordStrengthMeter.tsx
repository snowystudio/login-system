import React, { useEffect, useState } from 'react';
import { Progress, Tag, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface PasswordStrengthMeterProps {
  password: string;
  onStrengthChange?: (strength: 'weak' | 'medium' | 'strong', score: number) => void;
}

interface StrengthResult {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  missingRequirements: string[];
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  onStrengthChange,
}) => {
  const [result, setResult] = useState<StrengthResult | null>(null);

  useEffect(() => {
    if (!password) {
      setResult(null);
      return;
    }

    // 计算密码强度
    const requirements = {
      length: password.length >= 8 && password.length <= 20,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    let score = 0;
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 5;
    if (password.length >= 16) score += 5;
    if (requirements.uppercase) score += 15;
    if (requirements.lowercase) score += 15;
    if (requirements.number) score += 15;
    if (requirements.special) score += 15;
    if (password.length >= 12 && Object.values(requirements).filter(Boolean).length >= 4) score += 10;
    if (password.length >= 16 && Object.values(requirements).filter(Boolean).length >= 4) score += 10;

    score = Math.min(score, 100);

    let strength: 'weak' | 'medium' | 'strong';
    if (score < 30) strength = 'weak';
    else if (score < 80) strength = 'medium';
    else strength = 'strong';

    const missingRequirements: string[] = [];
    if (!requirements.length) missingRequirements.push('需 8-20 位');
    if (!requirements.uppercase) missingRequirements.push('需包含大写字母');
    if (!requirements.lowercase) missingRequirements.push('需包含小写字母');
    if (!requirements.number) missingRequirements.push('需包含数字');
    if (!requirements.special) missingRequirements.push('需包含特殊字符');

    const strengthResult: StrengthResult = {
      strength,
      score,
      requirements,
      missingRequirements,
    };

    setResult(strengthResult);
    onStrengthChange?.(strength, score);
  }, [password, onStrengthChange]);

  if (!result) return null;

  const getProgressColor = (strength: string) => {
    switch (strength) {
      case 'weak':
        return '#ff4d4f';
      case 'medium':
        return '#faad14';
      case 'strong':
        return '#52c41a';
      default:
        return '#d9d9d9';
    }
  };

  const getStrengthText = (strength: string) => {
    switch (strength) {
      case 'weak':
        return '弱';
      case 'medium':
        return '中';
      case 'strong':
        return '强';
      default:
        return '';
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <Progress
        percent={result.score}
        strokeColor={getProgressColor(result.strength)}
        showInfo={false}
        size="small"
      />
      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
        密码强度：<span style={{ color: getProgressColor(result.strength), fontWeight: 'bold' }}>
          {getStrengthText(result.strength)}
        </span>
      </div>
      <Space wrap size={[0, 8]} style={{ marginTop: 8 }}>
        <Tag icon={result.requirements.length ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={result.requirements.length ? 'success' : 'default'}>
          8-20 位
        </Tag>
        <Tag icon={result.requirements.uppercase ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={result.requirements.uppercase ? 'success' : 'default'}>
          大写字母
        </Tag>
        <Tag icon={result.requirements.lowercase ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={result.requirements.lowercase ? 'success' : 'default'}>
          小写字母
        </Tag>
        <Tag icon={result.requirements.number ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={result.requirements.number ? 'success' : 'default'}>
          数字
        </Tag>
        <Tag icon={result.requirements.special ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={result.requirements.special ? 'success' : 'default'}>
          特殊字符
        </Tag>
      </Space>
    </div>
  );
};
