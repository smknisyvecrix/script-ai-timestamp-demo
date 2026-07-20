// 剧本创作平台类型定义

export interface Script {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  timestampCertificates?: TimestampCertificate[];
}

export interface TimestampCertificate {
  id: string;
  scriptId: string;
  certificateNumber: string;
  timestamp: string;
  contentHash: string;
  status: 'pending' | 'verified' | 'expired';
  issuedAt: string;
  validUntil: string;
  pdfUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  highlight?: boolean;
}
